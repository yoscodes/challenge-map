import React from "react";
import type { Challenge } from '@/lib/supabase';
import ChallengeCard from "./ChallengeCard";

interface ChallengeListProps {
  challenges: Challenge[];
  isLoading: boolean;
  error: string | null;
}

const ChallengeList = ({ challenges, isLoading, error }: ChallengeListProps) => {
  if (isLoading) {
    return (
      <section style={{ margin: '32px 0' }}>
        <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 16 }}>🆕 新着チャレンジ</div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">読み込み中...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ margin: '32px 0' }}>
        <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 16 }}>🆕 新着チャレンジ</div>
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (challenges.length === 0) {
    return (
      <section style={{ margin: '32px 0' }}>
        <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 16 }}>🆕 新着チャレンジ</div>
        <div className="text-center py-8 text-gray-600">
          <p>まだチャレンジが投稿されていません。</p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ margin: '32px 0' }}>
      <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 16 }}>🆕 新着チャレンジ</div>
      {challenges.map((challenge) => (
        <ChallengeCard 
          key={challenge.id}
          id={challenge.id}
          title={challenge.title}
          user={challenge.users?.username || 'Unknown'}
          applause={0} // TODO: 拍手機能の実装
          progress={`進捗：${challenge.status} → 目標：${challenge.goal_date ? new Date(challenge.goal_date).toLocaleDateString('ja-JP') : '未設定'}`}
        />
      ))}
    </section>
  );
};

export default ChallengeList; 