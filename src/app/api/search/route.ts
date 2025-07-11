import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // 'all', 'challenges', 'users', 'categories'
    const category = searchParams.get('category') || '';
    const location = searchParams.get('location') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query && !category && !location) {
      return NextResponse.json(
        { error: '検索クエリ、カテゴリ、または地域のいずれかが必要です' },
        { status: 400 }
      );
    }

    let results: any = {};

    // チャレンジ検索
    if (type === 'all' || type === 'challenges') {
      let challengesQuery = supabase
        .from('challenges')
        .select(`
          *,
          users!inner(username, avatar_url, bio)
        `)
        .eq('is_public', true);

      // キーワード検索
      if (query) {
        challengesQuery = challengesQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }

      // カテゴリフィルター
      if (category) {
        challengesQuery = challengesQuery.eq('category', category);
      }

      // 地域フィルター
      if (location) {
        challengesQuery = challengesQuery.ilike('location->address', `%${location}%`);
      }

      const { data: challenges, error: challengesError } = await challengesQuery
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (challengesError) {
        console.error('チャレンジ検索エラー:', challengesError);
      } else {
        results.challenges = challenges || [];
      }
    }

    // ユーザー検索
    if (type === 'all' || type === 'users') {
      let usersQuery = supabase
        .from('users')
        .select('*');

      // キーワード検索
      if (query) {
        usersQuery = usersQuery.or(`username.ilike.%${query}%,bio.ilike.%${query}%`);
      }

      const { data: users, error: usersError } = await usersQuery
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (usersError) {
        console.error('ユーザー検索エラー:', usersError);
      } else {
        results.users = users || [];
      }
    }

    // カテゴリ一覧取得
    if (type === 'categories') {
      const { data: categories, error: categoriesError } = await supabase
        .from('challenges')
        .select('category')
        .eq('is_public', true)
        .not('category', 'is', null);

      if (categoriesError) {
        console.error('カテゴリ取得エラー:', categoriesError);
      } else {
        // カテゴリの重複を除去してカウント
        const categoryCounts = (categories || []).reduce((acc: any, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {});
        
        results.categories = Object.entries(categoryCounts).map(([name, count]) => ({
          name,
          count
        }));
      }
    }

    // 地域検索（進捗更新から）
    if (type === 'all' || type === 'locations') {
      let locationsQuery = supabase
        .from('progress_updates')
        .select('location')
        .not('location', 'is', null);

      if (location) {
        locationsQuery = locationsQuery.ilike('location->address', `%${location}%`);
      }

      const { data: locations, error: locationsError } = await locationsQuery
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (locationsError) {
        console.error('地域検索エラー:', locationsError);
      } else {
        // 地域の重複を除去
        const uniqueLocations = (locations || [])
          .filter(item => item.location?.address)
          .reduce((acc: any[], item) => {
            const exists = acc.find(loc => 
              loc.location.address === item.location.address
            );
            if (!exists) {
              acc.push(item);
            }
            return acc;
          }, []);
        
        results.locations = uniqueLocations;
      }
    }

    return NextResponse.json({
      success: true,
      results,
      query,
      type,
      category,
      location,
      limit,
      offset
    });

  } catch (error) {
    console.error('検索APIエラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 