"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";

type ProgressFormHeaderProps = {
  challengeTitle: string;
};

const ProgressFormHeader = ({ challengeTitle }: ProgressFormHeaderProps) => {
  const router = useRouter();
  const params = useParams();
  const challengeId = params.id as string;
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      marginBottom: 32,
      borderBottom: '1px solid #eee',
      paddingBottom: 16
    }}>
      <button 
        style={{ 
          marginRight: 16, 
          padding: '8px 12px', 
          border: '1px solid #ddd', 
          borderRadius: 4, 
          background: '#fff',
          cursor: 'pointer'
        }}
        onClick={() => router.push(`/challenge/${challengeId}`)}
      >
        ← チャレンジ詳細へ戻る
      </button>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: '0 0 4px 0' }}>
          進捗を投稿する
        </h1>
        <div style={{ fontSize: 14, color: '#666' }}>
          {challengeTitle}
        </div>
      </div>
    </div>
  );
};

export default ProgressFormHeader; 