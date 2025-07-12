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
    <div style={{ background: '#fafcff', minHeight: '100vh' }}>
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {/* ヘッダー */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          marginBottom: '32px',
          padding: '32px 0'
        }}>
          {showBackButton && (
            <button
              style={{
                marginRight: 16,
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: 4,
                background: '#fff',
                cursor: 'pointer',
                fontSize: 18
              }}
              onClick={() => router.back()}
            >
              ← 戻る
            </button>
          )}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              margin: '0 0 8px 0',
              color: '#1a1a1a'
            }}>
              🔍 検索
            </h1>
            <p style={{ 
              fontSize: '16px', 
              color: '#666', 
              margin: 0 
            }}>
              チャレンジ、ユーザー、地域、カテゴリで検索できます
            </p>
          </div>
        </div>

        {/* コンテンツ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default SearchLayout; 