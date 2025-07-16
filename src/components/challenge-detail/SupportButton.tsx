import React from "react";
import Link from "next/link";

interface SupportButtonProps {
  author: string; // 例: "@ai_traveler"
  challengeId?: string;
}

const SupportButton = ({ author, challengeId }: SupportButtonProps) => {
  // @を除去
  const username = author.startsWith("@") ? author.slice(1) : author;
  
  // サポートページのURLを作成
  const supportUrl = challengeId 
    ? `/support/${username}?challengeId=${challengeId}`
    : `/support/${username}`;
    
  return (
    <section style={{ marginBottom: 32 }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        padding: '24px',
        background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
        borderRadius: 12,
        color: '#fff'
      }}>
        <Link 
          href={supportUrl}
          style={{ 
            fontSize: 18,
            padding: '16px 32px',
            background: 'rgba(255,255,255,0.2)',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: 32,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            display: 'inline-block',
            textAlign: 'center'
          }}
        >
          💖 この人を応援する → サポーター支援ページへ
        </Link>
      </div>
    </section>
  );
};

export default SupportButton; 