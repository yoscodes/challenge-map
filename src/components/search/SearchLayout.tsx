"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { isMobile } from '@/lib/mobile-utils';

interface SearchLayoutProps {
  children: React.ReactNode;
}

const SearchLayout: React.FC<SearchLayoutProps> = ({ children }) => {
  const router = useRouter();
  const showBackButton = !isMobile();
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      {/* Heroセクション */}
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '56px 0 32px 0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <div style={{ flex: 1, textAlign: 'left' }}>
          <h1
            style={{
              fontSize: '40px',
              fontWeight: 'bold',
              margin: '0 0 16px 0',
              color: '#1a1a1a',
              letterSpacing: 0.5,
              lineHeight: 1.1,
            }}
          >
            <span role="img" aria-label="search">🔍</span> 検索
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: '#555',
              margin: 0,
              fontWeight: 500,
              letterSpacing: 0.2,
            }}
          >
            チャレンジ・ユーザー・地域・カテゴリで横断検索できます
          </p>
        </div>
        {/* 戻るボタンは不要のため削除 */}
      </div>
      {/* 中央カード */}
      <main
        style={{
          maxWidth: 900,
          margin: '0 auto',
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 8px 32px #2563eb13',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          minHeight: 400,
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default SearchLayout; 