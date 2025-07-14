import { supabase } from './supabase';
import type { Challenge, ProgressUpdate, Comment, User } from './supabase';

// チャレンジ関連
export const challenges = {
  // チャレンジ一覧取得
  async getAll(limit = 20) {
    const { data, error } = await supabase
      .from('challenges')
      .select(`
        *,
        users!inner(username, avatar_url)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  // ユーザーのチャレンジ取得
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  // チャレンジ詳細取得
  async getById(id: string) {
    console.log('チャレンジ取得開始:', id);
    
    const { data, error } = await supabase
      .from('challenges')
      .select(`
        *,
        users!inner(username, avatar_url, bio)
      `)
      .eq('id', id)
      .single();
    
    console.log('チャレンジ取得結果:', { data, error });
    
    return { data, error };
  },

  // チャレンジ作成
  async create(challenge: Omit<Challenge, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('challenges')
      .insert([challenge])
      .select()
      .single();
    
    return { data, error };
  },

  // チャレンジ更新
  async update(id: string, updates: Partial<Challenge>) {
    const { data, error } = await supabase
      .from('challenges')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  // チャレンジ削除
  async delete(id: string) {
    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', id);
    
    return { error };
  },
};

// 進捗更新関連
export const progressUpdates = {
  // チャレンジの進捗取得
  async getByChallengeId(challengeId: string) {
    const { data, error } = await supabase
      .from('progress_updates')
      .select(`
        *,
        users!inner(username, avatar_url)
      `)
      .eq('challenge_id', challengeId)
      .order('created_at', { ascending: true });
    
    return { data, error };
  },

  // 進捗作成
  async create(progress: Omit<ProgressUpdate, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('progress_updates')
      .insert([progress])
      .select()
      .single();
    
    return { data, error };
  },

  // 進捗削除
  async delete(id: string) {
    const { error } = await supabase
      .from('progress_updates')
      .delete()
      .eq('id', id);
    
    return { error };
  },
};

// コメント関連
export const comments = {
  // チャレンジのコメント取得
  async getByChallengeId(challengeId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        users(username, avatar_url)
      `)
      .eq('challenge_id', challengeId)
      .order('created_at', { ascending: true });
    
    return { data, error };
  },

  // 進捗のコメント取得
  async getByProgressId(progressId: string) {
    try {
      const { data, error } = await supabase
        .from('progress_comments')
        .select(`
          *,
          users(username, avatar_url)
        `)
        .eq('progress_id', progressId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('進捗コメント取得エラー:', error);
        // テーブルが存在しない場合やリレーションシップエラーの場合は空配列を返す
        if (error.code === '42P01' || error.code === 'PGRST200') {
          console.log('progress_commentsテーブルが存在しないか、リレーションシップが設定されていません。空配列を返します。');
          return { data: [], error: null };
        }
      }
      
      return { data: data || [], error };
    } catch (err) {
      console.error('進捗コメント取得エラー:', err);
      return { data: [], error: err };
    }
  },

  // コメント作成
  async create(comment: Omit<Comment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('comments')
      .insert([comment])
      .select()
      .single();
    // 通知追加処理
    if (data && !error) {
      // チャレンジの投稿者IDを取得
      const { data: challenge } = await supabase
        .from('challenges')
        .select('user_id')
        .eq('id', comment.challenge_id)
        .single();
      if (challenge && challenge.user_id && comment.user_id !== challenge.user_id) {
        // 投稿者本人のコメントは通知しない
        const { data: user } = await supabase
          .from('users')
          .select('username')
          .eq('id', comment.user_id)
          .single();
        const username = user?.username || '誰か';
        await supabase.from('notifications').insert([
          {
            user_id: challenge.user_id,
            type: 'comment',
            related_id: data.id,
            message: `${username}さんがあなたのチャレンジにコメントしました`,
            is_read: false
          }
        ]);
      }
    }
    return { data, error };
  },

  // 進捗コメント作成
  async createProgressComment(comment: {
    progress_id: string;
    user_id: string;
    content: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('progress_comments')
        .insert([comment])
        .select()
        .single();
      
      if (error) {
        console.error('進捗コメント作成エラー:', error);
        // テーブルが存在しない場合やリレーションシップエラーの場合はエラーを返す
        if (error.code === '42P01' || error.code === 'PGRST200') {
          return { data: null, error: new Error('進捗コメント機能は現在利用できません') };
        }
      }
      
      return { data, error };
    } catch (err) {
      console.error('進捗コメント作成エラー:', err);
      return { data: null, error: err };
    }
  },

  // 進捗コメント削除
  async deleteProgressComment(id: string) {
    try {
      const { error } = await supabase
        .from('progress_comments')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('進捗コメント削除エラー:', error);
        // テーブルが存在しない場合やリレーションシップエラーの場合はエラーを返す
        if (error.code === '42P01' || error.code === 'PGRST200') {
          return { error: new Error('進捗コメント機能は現在利用できません') };
        }
      }
      
      return { error };
    } catch (err) {
      console.error('進捗コメント削除エラー:', err);
      return { error: err };
    }
  },

  // コメント削除
  async delete(id: string) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);
    
    return { error };
  },
};

// フォロー関連
export const follows = {
  // フォロー状態確認
  async isFollowing(followerId: string, followingId: string) {
    const { data, error } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();
    
    return { isFollowing: !!data, error };
  },

  // フォロー数取得
  async getFollowerCount(userId: string) {
    const { count, error } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', userId);
    
    return { count: count || 0, error };
  },

  // フォロー中数取得
  async getFollowingCount(userId: string) {
    const { count, error } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId);
    
    return { count: count || 0, error };
  },

  // フォロー実行
  async follow(followerId: string, followingId: string) {
    // 自分自身をフォローできないようにチェック
    if (followerId === followingId) {
      return { error: new Error('自分自身をフォローすることはできません') };
    }

    const { data, error } = await supabase
      .from('follows')
      .insert([
        {
          follower_id: followerId,
          following_id: followingId,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    // 通知追加処理
    if (data && !error) {
      const { data: follower } = await supabase
        .from('users')
        .select('username')
        .eq('id', followerId)
        .single();
      
      const username = follower?.username || '誰か';
      await supabase.from('notifications').insert([
        {
          user_id: followingId,
          type: 'follow',
          related_id: data.id,
          message: `${username}さんがあなたをフォローしました`,
          is_read: false
        }
      ]);
    }

    return { data, error };
  },

  // フォロー解除
  async unfollow(followerId: string, followingId: string) {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);
    
    return { error };
  },

  // フォロワー一覧取得
  async getFollowers(userId: string, limit = 20) {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        *,
        users!follower_id(username, avatar_url, bio)
      `)
      .eq('following_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  // フォロー中一覧取得
  async getFollowing(userId: string, limit = 20) {
    const { data, error } = await supabase
      .from('follows')
      .select(`
        *,
        users!following_id(username, avatar_url, bio)
      `)
      .eq('follower_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },
};

// 拍手関連
export const applause = {
  // 拍手追加
  async addApplause(challengeId: string, userId: string) {
    const { data, error } = await supabase
      .from('applause')
      .insert([
        {
          challenge_id: challengeId,
          user_id: userId,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    // 通知追加処理
    if (data && !error) {
      // チャレンジの投稿者IDを取得
      const { data: challenge } = await supabase
        .from('challenges')
        .select('user_id')
        .eq('id', challengeId)
        .single();
      
      if (challenge && challenge.user_id && userId !== challenge.user_id) {
        // 投稿者本人の拍手は通知しない
        const { data: user } = await supabase
          .from('users')
          .select('username')
          .eq('id', userId)
          .single();
        
        const username = user?.username || '誰か';
        await supabase.from('notifications').insert([
          {
            user_id: challenge.user_id,
            type: 'applause',
            related_id: data.id,
            message: `${username}さんがあなたのチャレンジに拍手しました`,
            is_read: false
          }
        ]);
      }
    }

    return { data, error };
  },

  // 拍手削除
  async removeApplause(challengeId: string, userId: string) {
    const { error } = await supabase
      .from('applause')
      .delete()
      .eq('challenge_id', challengeId)
      .eq('user_id', userId);
    
    return { error };
  },

  // 拍手数取得
  async getApplauseCount(challengeId: string) {
    const { count, error } = await supabase
      .from('applause')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', challengeId);
    
    return { count: count || 0, error };
  },

  // ユーザーの拍手済み確認
  async hasApplaused(challengeId: string, userId: string) {
    const { data, error } = await supabase
      .from('applause')
      .select('*')
      .eq('challenge_id', challengeId)
      .eq('user_id', userId)
      .single();
    
    return { hasApplaused: !!data, error };
  },
};

// ユーザー関連
export const users = {
  // ユーザープロフィール取得
  async getById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  // ユーザープロフィール更新
  async update(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  // ユーザー一覧取得（公開プロフィール）
  async getAll(limit = 20) {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, avatar_url, bio, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },
}; 

// サポーター関連
export const supporters = {
  // 指定ユーザーを支援しているサポーター一覧取得
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('supporters')
      .select(`
        *,
        users:supporter_id(username, avatar_url)
      `)
      .eq('supported_user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },
}; 