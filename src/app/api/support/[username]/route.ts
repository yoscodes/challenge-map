import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    
    if (!username) {
      return NextResponse.json(
        { error: 'ユーザー名が必要です' },
        { status: 400 }
      );
    }

    // ユーザー情報を取得
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // サポーター数を取得（statusカラムが存在しない場合は全件カウント）
    let supporterCount = 0;
    try {
      const { data: count, error: supporterCountError } = await supabase
        .rpc('get_supporter_count', { user_id: user.id });
      supporterCount = count || 0;
    } catch (error) {
      // statusカラムが存在しない場合は直接カウント
      const { count, error: countError } = await supabase
        .from('supporters')
        .select('*', { count: 'exact', head: true })
        .eq('supported_user_id', user.id);
      supporterCount = count || 0;
    }

    // 支援総額を取得（statusカラムが存在しない場合は全件合計）
    let totalAmount = 0;
    try {
      const { data: amount, error: totalAmountError } = await supabase
        .rpc('get_total_support_amount', { user_id: user.id });
      totalAmount = amount || 0;
    } catch (error) {
      // statusカラムが存在しない場合は直接合計
      const { data: supporters, error: sumError } = await supabase
        .from('supporters')
        .select('amount')
        .eq('supported_user_id', user.id);
      totalAmount = supporters?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
    }

    // 月額支援額を取得（statusカラムが存在しない場合は全件合計）
    let monthlyAmount = 0;
    try {
      const { data: amount, error: monthlyAmountError } = await supabase
        .rpc('get_monthly_support_amount', { user_id: user.id });
      monthlyAmount = amount || 0;
    } catch (error) {
      // statusカラムが存在しない場合は直接合計
      const { data: supporters, error: sumError } = await supabase
        .from('supporters')
        .select('amount')
        .eq('supported_user_id', user.id)
        .eq('plan_type', 'monthly');
      monthlyAmount = supporters?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
    }

    // サポーター一覧を取得（supporter_listビューを使用）
    let supporters = [];
    try {
      const { data: supporterList, error: supportersError } = await supabase
        .from('supporter_list')
        .select('*')
        .eq('supported_user_id', user.id)
        .order('supported_at', { ascending: false })
        .limit(10);
      supporters = supporterList || [];
    } catch (error) {
      // ビューが存在しない場合は直接JOIN
      const { data: supporterList, error: supportersError } = await supabase
        .from('supporters')
        .select(`
          id as support_id,
          supported_user_id,
          amount,
          plan_type,
          created_at as supported_at,
          users!supporter_id(id, username, avatar_url, bio)
        `)
        .eq('supported_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      supporters = supporterList?.map((s: any) => ({
        support_id: s.support_id,
        supported_user_id: s.supported_user_id,
        amount: s.amount,
        plan_type: s.plan_type,
        message: null, // messageカラムが存在しない場合はnull
        supported_at: s.supported_at,
        user_id: s.users?.id,
        username: s.users?.username,
        avatar_url: s.users?.avatar_url,
        bio: s.users?.bio
      })) || [];
    }

    // アクティブなチャレンジ数を取得
    const { data: activeChallenges, error: challengesError } = await supabase
      .from('challenges')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'in_progress');

    if (challengesError) {
      console.error('チャレンジ数取得エラー:', challengesError);
    }

    // 完了したチャレンジ数を取得
    const { data: completedChallenges, error: completedError } = await supabase
      .from('challenges')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'completed');

    if (completedError) {
      console.error('完了チャレンジ数取得エラー:', completedError);
    }

    // 拍手数を取得
    const { data: applauseCount, error: applauseError } = await supabase
      .from('progress_updates')
      .select('applause_count')
      .eq('user_id', user.id);

    if (applauseError) {
      console.error('拍手数取得エラー:', applauseError);
    }

    const totalApplauseCount = applauseCount?.reduce((sum, item) => sum + (item.applause_count || 0), 0) || 0;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
        bio: user.bio,
        location: user.location,
        website: user.website,
        twitter: user.twitter,
        instagram: user.instagram,
        created_at: user.created_at
      },
      stats: {
        supporterCount,
        totalAmount,
        monthlyAmount,
        activeChallenges: activeChallenges?.length || 0,
        completedChallenges: completedChallenges?.length || 0,
        totalApplauseCount
      },
      supporters
    });

  } catch (error) {
    console.error('サポート情報取得エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 