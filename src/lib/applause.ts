import { supabase } from './storage';

export type ApplauseTargetType = 'challenge' | 'progress' | 'comment';

// 拍手追加
export async function addApplause(userId: string, targetType: ApplauseTargetType, targetId: string) {
  const { data, error } = await supabase.from('applause').insert([
    { user_id: userId, target_type: targetType, target_id: targetId }
  ]);
  // 通知追加処理
  if (!error) {
    // 投稿者ID取得
    let ownerId: string | undefined;
    if (targetType === 'challenge') {
      const { data: challenge } = await supabase.from('challenges').select('user_id').eq('id', targetId).single();
      ownerId = challenge?.user_id;
    } else if (targetType === 'progress') {
      const { data: progress } = await supabase.from('progress_updates').select('user_id').eq('id', targetId).single();
      ownerId = progress?.user_id;
    }
    if (ownerId && ownerId !== userId) {
      // ユーザー名取得
      const { data: user } = await supabase.from('users').select('username').eq('id', userId).single();
      const username = user?.username || '誰か';
      await supabase.from('notifications').insert([
        {
          user_id: ownerId,
          type: 'applause',
          related_id: targetId,
          message: `${username}さんがあなたの投稿に拍手しました`,
          is_read: false
        }
      ]);
    }
  }
  return { data, error };
}

// 拍手削除
export async function removeApplause(userId: string, targetType: ApplauseTargetType, targetId: string) {
  const { data, error } = await supabase
    .from('applause')
    .delete()
    .match({ user_id: userId, target_type: targetType, target_id: targetId });
  return { data, error };
}

// 拍手数取得
export async function getApplauseCount(targetType: ApplauseTargetType, targetId: string) {
  const { count, error } = await supabase
    .from('applause')
    .select('*', { count: 'exact', head: true })
    .eq('target_type', targetType)
    .eq('target_id', targetId);
  return { count, error };
}

// 拍手済み判定
export async function isApplaudedByUser(userId: string, targetType: ApplauseTargetType, targetId: string) {
  const { data, error } = await supabase
    .from('applause')
    .select('id')
    .eq('user_id', userId)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .maybeSingle();
  return { applauded: !!data, error };
} 