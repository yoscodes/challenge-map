-- 検索機能のパフォーマンス向上設定

-- チャレンジ検索用インデックス
CREATE INDEX IF NOT EXISTS idx_challenges_title_description ON challenges USING gin(to_tsvector('japanese', title || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_challenges_category ON challenges(category);
CREATE INDEX IF NOT EXISTS idx_challenges_location_address ON challenges USING gin((location->>'address') gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_challenges_created_at ON challenges(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_challenges_is_public ON challenges(is_public) WHERE is_public = true;

-- ユーザー検索用インデックス
CREATE INDEX IF NOT EXISTS idx_users_username ON users USING gin(username gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_bio ON users USING gin(to_tsvector('japanese', bio));
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- 進捗更新の地域検索用インデックス
CREATE INDEX IF NOT EXISTS idx_progress_updates_location_address ON progress_updates USING gin((location->>'address') gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_progress_updates_created_at ON progress_updates(created_at DESC);

-- 全文検索用の関数
CREATE OR REPLACE FUNCTION search_challenges(search_query TEXT, category_filter TEXT DEFAULT NULL, location_filter TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  location JSONB,
  created_at TIMESTAMPTZ,
  user_id UUID,
  username TEXT,
  avatar_url TEXT,
  bio TEXT,
  rank FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.description,
    c.category,
    c.location,
    c.created_at,
    c.user_id,
    u.username,
    u.avatar_url,
    u.bio,
    ts_rank(
      to_tsvector('japanese', c.title || ' ' || c.description),
      plainto_tsquery('japanese', search_query)
    ) as rank
  FROM challenges c
  JOIN users u ON c.user_id = u.id
  WHERE 
    c.is_public = true
    AND (
      search_query = '' OR
      to_tsvector('japanese', c.title || ' ' || c.description) @@ plainto_tsquery('japanese', search_query) OR
      c.title ILIKE '%' || search_query || '%' OR
      c.description ILIKE '%' || search_query || '%'
    )
    AND (category_filter IS NULL OR c.category = category_filter)
    AND (location_filter IS NULL OR c.location->>'address' ILIKE '%' || location_filter || '%')
  ORDER BY rank DESC NULLS LAST, c.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ユーザー検索用の関数
CREATE OR REPLACE FUNCTION search_users(search_query TEXT)
RETURNS TABLE (
  id UUID,
  username TEXT,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ,
  rank FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.username,
    u.email,
    u.avatar_url,
    u.bio,
    u.created_at,
    ts_rank(
      to_tsvector('japanese', u.username || ' ' || COALESCE(u.bio, '')),
      plainto_tsquery('japanese', search_query)
    ) as rank
  FROM users u
  WHERE 
    search_query = '' OR
    to_tsvector('japanese', u.username || ' ' || COALESCE(u.bio, '')) @@ plainto_tsquery('japanese', search_query) OR
    u.username ILIKE '%' || search_query || '%' OR
    u.bio ILIKE '%' || search_query || '%'
  ORDER BY rank DESC NULLS LAST, u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 地域検索用の関数
CREATE OR REPLACE FUNCTION search_locations(location_query TEXT)
RETURNS TABLE (
  location JSONB,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pu.location,
    COUNT(*) as count
  FROM progress_updates pu
  WHERE 
    pu.location IS NOT NULL 
    AND pu.location->>'address' IS NOT NULL
    AND (location_query = '' OR pu.location->>'address' ILIKE '%' || location_query || '%')
  GROUP BY pu.location
  ORDER BY count DESC, pu.location->>'address';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- カテゴリ統計用の関数
CREATE OR REPLACE FUNCTION get_category_stats()
RETURNS TABLE (
  category TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.category,
    COUNT(*) as count
  FROM challenges c
  WHERE c.is_public = true AND c.category IS NOT NULL
  GROUP BY c.category
  ORDER BY count DESC, c.category;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 人気の検索キーワードを取得する関数
CREATE OR REPLACE FUNCTION get_popular_search_terms()
RETURNS TABLE (
  term TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    unnest(string_to_array(lower(c.title || ' ' || c.description), ' ')) as term,
    COUNT(*) as count
  FROM challenges c
  WHERE c.is_public = true
  GROUP BY term
  HAVING length(term) > 2
  ORDER BY count DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 検索履歴テーブル（オプション）
CREATE TABLE IF NOT EXISTS search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  search_type TEXT NOT NULL,
  category TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 検索履歴のインデックス
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history USING gin(query gin_trgm_ops);

-- 検索履歴のRLSポリシー
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own search history" ON search_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own search history" ON search_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own search history" ON search_history
  FOR DELETE USING (auth.uid() = user_id);

-- 検索履歴を保存する関数
CREATE OR REPLACE FUNCTION save_search_history(
  search_query TEXT,
  search_type TEXT,
  category_filter TEXT DEFAULT NULL,
  location_filter TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO search_history (user_id, query, search_type, category, location)
  VALUES (auth.uid(), search_query, search_type, category_filter, location_filter);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ユーザーの検索履歴を取得する関数
CREATE OR REPLACE FUNCTION get_user_search_history(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  query TEXT,
  search_type TEXT,
  category TEXT,
  location TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sh.query,
    sh.search_type,
    sh.category,
    sh.location,
    sh.created_at
  FROM search_history sh
  WHERE sh.user_id = auth.uid()
  ORDER BY sh.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 