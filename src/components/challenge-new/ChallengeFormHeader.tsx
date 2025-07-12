"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { isMobile } from "@/lib/mobile-utils";

const ChallengeFormHeader = () => {
  const router = useRouter();
  const showBackButton = !isMobile();
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      marginBottom: 32,
      borderBottom: '1px solid #eee',
      paddingBottom: 16
    }}>
      {showBackButton && (
        <button 
          style={{ 
            marginRight: 16, 
            padding: '8px 12px', 
            border: '1px solid #ddd', 
            borderRadius: 4, 
            background: '#fff',
            cursor: 'pointer'
          }}
          onClick={() => router.back()}
        >
          ← 戻る
        </button>
      )}
      <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0 }}>
        新しいチャレンジを投稿する
      </h1>
    </div>
  );
};

export default ChallengeFormHeader; 