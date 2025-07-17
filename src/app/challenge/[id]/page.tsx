"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { challenges, progressUpdates, comments } from '@/lib/database';
import ChallengeDetailLayout from '@/components/challenge-detail/ChallengeDetailLayout';
import type { Challenge, ProgressUpdate, Comment } from '@/lib/supabase';
import dynamic from "next/dynamic";
import { useRouter } from 'next/navigation';

// SSR無効化でMapViewを動的インポート
const MapView = dynamic(() => import("@/components/map/MapView"), { ssr: false });

export default function ChallengeDetailPage() {
  const params = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [progresses, setProgresses] = useState<ProgressUpdate[]>([]);
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const challengeId = params.id as string;

  const fetchChallengeData = async () => {
    if (!challengeId) return;

    try {
      setIsLoading(true);
      setError(null);

      // チャレンジ詳細を取得
      const { data: challengeData, error: challengeError } = await challenges.getById(challengeId);
      
      if (challengeError) {
        console.error('チャレンジ取得エラー:', challengeError);
        setError('チャレンジが見つかりません。');
        return;
      }

      setChallenge(challengeData);

      // デバッグ: cover_imageの値を確認
      console.log('チャレンジデータ:', challengeData);
      console.log('cover_image:', challengeData?.cover_image);

      // 進捗更新を取得
      const { data: progressData, error: progressError } = await progressUpdates.getByChallengeId(challengeId);
      
      if (progressError) {
        console.error('進捗取得エラー:', progressError);
      } else {
        setProgresses(progressData || []);
      }

      // コメントを取得
      const { data: commentData, error: commentError } = await comments.getByChallengeId(challengeId);
      
      if (commentError) {
        console.error('コメント取得エラー:', commentError);
      } else {
        setCommentsList(commentData || []);
      }

    } catch (err) {
      console.error('データ取得エラー:', err);
      setError('データの取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallengeData();
  }, [challengeId]);

  // コメント追加時のリフレッシュ
  const handleCommentAdded = () => {
    fetchChallengeData();
  };

  // チャレンジ削除ハンドラ
  const handleDeleteChallenge = async () => {
    if (!challenge) return;
    const ok = window.confirm('本当にこのチャレンジを削除しますか？');
    if (!ok) return;
    try {
      await challenges.delete(challenge.id);
      router.push('/');
    } catch (err) {
      alert('削除に失敗しました');
    }
  };

  // チャレンジ完了ハンドラ
  const handleCompleteChallenge = async () => {
    if (!challenge) return;
    const ok = window.confirm('このチャレンジを完了済みにしますか？');
    if (!ok) return;
    try {
      await challenges.update(challenge.id, { status: 'completed' });
      fetchChallengeData();
    } catch (err) {
      alert('完了に失敗しました');
    }
  };

  // オーナー判定
  const isOwner = user?.id === challenge?.user_id;

  // カテゴリID→日本語名変換辞書
  const categoryMap: Record<string, string> = {
    travel: '旅',
    learning: '学習',
    health: '健康',
    career: 'キャリア',
    creative: '創作',
    social: '社会貢献',
    finance: 'お金',
    other: 'その他',
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">エラー</h2>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">チャレンジが見つかりません</h2>
        </div>
      </div>
    );
  }

  // データをコンポーネント用の形式に変換
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const coverImageUrl = challenge.cover_image
    ? challenge.cover_image.startsWith('http')
      ? challenge.cover_image
      : `${SUPABASE_URL}/storage/v1/object/public/avatars/${challenge.cover_image}`
    : undefined;
  const challengeData = {
    title: challenge.title,
    author: challenge.users?.username || 'Unknown',
    category: categoryMap[challenge.category] || challenge.category,
    startDate: new Date(challenge.created_at).toLocaleDateString('ja-JP'),
    targetDate: challenge.goal_date === 'undecided' ? '未定' : (challenge.goal_date ? new Date(challenge.goal_date).toLocaleDateString('ja-JP') : '未設定'),
    location: challenge.location?.address || '未設定',
    description: challenge.description,
    coverImageUrl,
    challengeId: String(challenge.id),
    status: challenge.status, // 追加
  };

  const progressData = progresses.map(progress => {
    const dateStr = progress.date ? String(progress.date) : undefined;
    return {
      id: String(progress.id),
      date: dateStr
        ? new Date(dateStr as string).toLocaleDateString('ja-JP')
        : new Date(progress.created_at as string).toLocaleDateString('ja-JP'),
      content: progress.content,
      imageUrl: progress.images?.[0] || undefined,
      applauseCount: 0, // TODO: 拍手機能の実装
      commentCount: 0, // TODO: コメント数カウント
      progressType: progress.progress_type ? String(progress.progress_type) : undefined,
    };
  });

  const commentData = commentsList.map(comment => ({
    id: comment.id,
    author: comment.user_id ? comment.users?.username || 'Unknown' : '匿名',
    content: comment.content,
    date: new Date(comment.created_at).toLocaleString('ja-JP'),
    isAnonymous: comment.is_anonymous,
    canDelete: comment.user_id === user?.id,
  }));

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafcff',
      padding: '0',
    }}>
      <ChallengeDetailLayout 
        challenge={challengeData}
        progresses={progressData}
        comments={commentData}
        onCommentAdded={handleCommentAdded}
        onEdit={() => router.push(`/challenge/${challenge.id}/edit`)}
        onDelete={handleDeleteChallenge}
        onBack={() => router.back()}
        isOwner={isOwner}
        onComplete={handleCompleteChallenge}
      />
    </div>
  );
} 