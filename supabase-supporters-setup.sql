-- サポーター機能のテーブル作成

-- supporters テーブル（支援関係を管理）
CREATE TABLE IF NOT EXISTS supporters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  supported_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'one_time')),
  message TEXT,
  stripe_subscription_id TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 同じ支援関係の重複を防ぐ（月額の場合）
  UNIQUE(supporter_id, supported_user_id, plan_type)
);

-- 既存のテーブルにmessageカラムを追加（テーブルが既に存在する場合）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'supporters' AND column_name = 'message'
  ) THEN
    ALTER TABLE supporters ADD COLUMN message TEXT;
  END IF;
END $$;

-- 既存のテーブルにstatusカラムを追加（テーブルが既に存在する場合）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'supporters' AND column_name = 'status'
  ) THEN
    ALTER TABLE supporters ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'failed'));
  END IF;
END $$;

-- 既存のテーブルにstripe_payment_intent_idカラムを追加（テーブルが既に存在する場合）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'supporters' AND column_name = 'stripe_payment_intent_id'
  ) THEN
    ALTER TABLE supporters ADD COLUMN stripe_payment_intent_id TEXT;
  END IF;
END $$;

-- 既存のテーブルにupdated_atカラムを追加（テーブルが既に存在する場合）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'supporters' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE supporters ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- インデックス作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_supporters_supporter_id ON supporters(supporter_id);
CREATE INDEX IF NOT EXISTS idx_supporters_supported_user_id ON supporters(supported_user_id);
CREATE INDEX IF NOT EXISTS idx_supporters_created_at ON supporters(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_supporters_plan_type ON supporters(plan_type);
CREATE INDEX IF NOT EXISTS idx_supporters_status ON supporters(status);

-- RLS（Row Level Security）ポリシー設定
ALTER TABLE supporters ENABLE ROW LEVEL SECURITY;

-- 支援関係の読み取りポリシー（認証済みユーザーのみ）
CREATE POLICY "Users can view support relationships" ON supporters
  FOR SELECT USING (auth.role() = 'authenticated');

-- 支援作成ポリシー（自分以外のユーザーを支援可能）
CREATE POLICY "Users can support other users" ON supporters
  FOR INSERT WITH CHECK (
    auth.uid() = supporter_id 
    AND supporter_id != supported_user_id
  );

-- 支援更新ポリシー（自分の支援関係のみ更新可能）
CREATE POLICY "Users can update their own support" ON supporters
  FOR UPDATE USING (auth.uid() = supporter_id);

-- 支援削除ポリシー（自分の支援関係のみ削除可能）
CREATE POLICY "Users can cancel their own support" ON supporters
  FOR DELETE USING (auth.uid() = supporter_id);

-- サポーター数を取得する関数
CREATE OR REPLACE FUNCTION get_supporter_count(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(DISTINCT supporter_id)::INTEGER 
    FROM supporters 
    WHERE supported_user_id = user_id
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 支援総額を取得する関数
CREATE OR REPLACE FUNCTION get_total_support_amount(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(amount), 0)::INTEGER 
    FROM supporters 
    WHERE supported_user_id = user_id
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 月額支援額を取得する関数
CREATE OR REPLACE FUNCTION get_monthly_support_amount(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(amount), 0)::INTEGER 
    FROM supporters 
    WHERE supported_user_id = user_id
    AND plan_type = 'monthly'
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 支援状態を確認する関数
CREATE OR REPLACE FUNCTION is_supporting(supporter_id UUID, supported_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 
    FROM supporters 
    WHERE supporters.supporter_id = is_supporting.supporter_id 
    AND supporters.supported_user_id = is_supporting.supported_user_id
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- サポーター一覧を取得するビュー
CREATE OR REPLACE VIEW supporter_list AS
SELECT 
  s.id as support_id,
  s.supported_user_id,
  s.amount,
  s.plan_type,
  COALESCE(s.message, '') as message,
  s.created_at as supported_at,
  u.id as user_id,
  u.username,
  u.avatar_url,
  u.bio
FROM supporters s
JOIN users u ON s.supporter_id = u.id
WHERE COALESCE(s.status, 'active') = 'active'
ORDER BY s.created_at DESC;

-- 支援履歴を取得するビュー
CREATE OR REPLACE VIEW support_history AS
SELECT 
  s.id as support_id,
  s.amount,
  s.plan_type,
  COALESCE(s.message, '') as message,
  s.created_at,
  COALESCE(s.status, 'active') as status,
  supporter.username as supporter_username,
  supporter.avatar_url as supporter_avatar,
  supported.username as supported_username
FROM supporters s
JOIN users supporter ON s.supporter_id = supporter.id
JOIN users supported ON s.supported_user_id = supported.id
ORDER BY s.created_at DESC;

-- 通知テーブルに支援通知タイプを追加（既存のnotificationsテーブルがある場合）
-- 注意: 既存のnotificationsテーブルがある場合は、typeカラムに'support'を追加するだけ

-- サンプルデータ（テスト用）
-- INSERT INTO supporters (supporter_id, supported_user_id, amount, plan_type, message) VALUES 
--   ('user1-uuid', 'user2-uuid', 500, 'monthly', '応援しています！'),
--   ('user3-uuid', 'user2-uuid', 1000, 'one_time', '頑張ってください！'),
--   ('user4-uuid', 'user2-uuid', 300, 'monthly', '素晴らしい挑戦ですね');

-- updated_atを自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_supporters_updated_at 
    BEFORE UPDATE ON supporters 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 