import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { follows } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { followerId, followingId } = await request.json();

    if (!followerId || !followingId) {
      return NextResponse.json(
        { error: 'followerIdとfollowingIdが必要です' },
        { status: 400 }
      );
    }

    const { data, error } = await follows.follow(followerId, followingId);

    if (error) {
      console.error('フォローエラー:', error);
      return NextResponse.json(
        { error: 'フォローに失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('フォローAPIエラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { followerId, followingId } = await request.json();

    if (!followerId || !followingId) {
      return NextResponse.json(
        { error: 'followerIdとfollowingIdが必要です' },
        { status: 400 }
      );
    }

    const { error } = await follows.unfollow(followerId, followingId);

    if (error) {
      console.error('フォロー解除エラー:', error);
      return NextResponse.json(
        { error: 'フォロー解除に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('フォロー解除APIエラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const followerId = searchParams.get('followerId');
    const followingId = searchParams.get('followingId');
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'followers' or 'following'

    if (followerId && followingId) {
      // フォロー状態確認
      const { isFollowing, error } = await follows.isFollowing(followerId, followingId);
      
      if (error) {
        console.error('フォロー状態確認エラー:', error);
        return NextResponse.json(
          { error: 'フォロー状態の確認に失敗しました' },
          { status: 500 }
        );
      }

      return NextResponse.json({ isFollowing });
    }

    if (userId && type) {
      // フォロワー/フォロー中一覧取得
      let data, error;
      
      if (type === 'followers') {
        const result = await follows.getFollowers(userId);
        data = result.data;
        error = result.error;
      } else if (type === 'following') {
        const result = await follows.getFollowing(userId);
        data = result.data;
        error = result.error;
      } else {
        return NextResponse.json(
          { error: 'typeはfollowersまたはfollowingである必要があります' },
          { status: 400 }
        );
      }

      if (error) {
        console.error('フォロー一覧取得エラー:', error);
        return NextResponse.json(
          { error: 'フォロー一覧の取得に失敗しました' },
          { status: 500 }
        );
      }

      return NextResponse.json({ data });
    }

    return NextResponse.json(
      { error: 'パラメータが不足しています' },
      { status: 400 }
    );
  } catch (error) {
    console.error('フォローAPIエラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 