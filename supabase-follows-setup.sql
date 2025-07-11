-- フォロー機能のテーブル作成

-- follows テーブル（フォロー関係を管理）
CREATE TABLE IF NOT EXISTS follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 同じフォロー関係の重複を防ぐ
  UNIQUE(follower_id, following_id)
);

-- インデックス作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_follows_created_at ON follows(created_at);

-- RLS（Row Level Security）ポリシー設定
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- フォロー関係の読み取りポリシー（認証済みユーザーのみ）
CREATE POLICY "Users can view follow relationships" ON follows
  FOR SELECT USING (auth.role() = 'authenticated');

-- フォロー作成ポリシー（自分以外のユーザーをフォロー可能）
CREATE POLICY "Users can follow other users" ON follows
  FOR INSERT WITH CHECK (
    auth.uid() = follower_id 
    AND follower_id != following_id
  );

-- フォロー解除ポリシー（自分のフォロー関係のみ削除可能）
CREATE POLICY "Users can unfollow" ON follows
  FOR DELETE USING (auth.uid() = follower_id);

-- フォロー数・フォロワー数を取得する関数
CREATE OR REPLACE FUNCTION get_follower_count(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER 
    FROM follows 
    WHERE following_id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_following_count(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER 
    FROM follows 
    WHERE follower_id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- フォロー状態を確認する関数
CREATE OR REPLACE FUNCTION is_following(follower_id UUID, following_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 
    FROM follows 
    WHERE follows.follower_id = is_following.follower_id 
    AND follows.following_id = is_following.following_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 通知テーブルにフォロー通知タイプを追加（既存のnotificationsテーブルがある場合）
-- 注意: 既存のnotificationsテーブルがある場合は、typeカラムに'follow'を追加するだけ

-- サンプルデータ（テスト用）
-- INSERT INTO follows (follower_id, following_id) VALUES 
--   ('user1-uuid', 'user2-uuid'),
--   ('user1-uuid', 'user3-uuid'),
--   ('user2-uuid', 'user1-uuid');

-- ビュー作成（フォロワー一覧取得用）
CREATE OR REPLACE VIEW follower_list AS
SELECT 
  f.id as follow_id,
  f.created_at as followed_at,
  u.id as user_id,
  u.username,
  u.avatar_url,
  u.bio
FROM follows f
JOIN users u ON f.follower_id = u.id
ORDER BY f.created_at DESC;

-- ビュー作成（フォロー中一覧取得用）
CREATE OR REPLACE VIEW following_list AS
SELECT 
  f.id as follow_id,
  f.created_at as followed_at,
  u.id as user_id,
  u.username,
  u.avatar_url,
  u.bio
FROM follows f
JOIN users u ON f.following_id = u.id
ORDER BY f.created_at DESC; 