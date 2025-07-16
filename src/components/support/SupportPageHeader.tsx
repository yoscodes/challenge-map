"use client";

import React from "react";
import { useRouter } from "next/navigation";

type SupportPageHeaderProps = {
  username: string;
  challengeId?: string;
};

const SupportPageHeader = ({ username, challengeId }: SupportPageHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (challengeId) {
      // チャレンジ詳細ページに戻る
      router.push(`/challenge/${challengeId}`);
    } else {
      // チャレンジIDがない場合はユーザープロフィールページに戻る
      router.push(`/user/${username}`);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      marginBottom: 32,
      borderBottom: '1px solid #eee',
      paddingBottom: 16
    }}>
      <button 
        onClick={handleBack}
        style={{ 
          marginRight: 16, 
          padding: '8px 12px', 
          border: '1px solid #ddd', 
          borderRadius: 4, 
          background: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        ← 戻る
      </button>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0 }}>
        {username} さんを応援する
      </h1>
    </div>
  );
};

export default SupportPageHeader; 