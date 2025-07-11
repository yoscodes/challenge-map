"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isMobile, isTouchDevice } from '@/lib/mobile-utils';

interface MobileNavigationProps {
  user?: any;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ user }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(isMobile());
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigationItems = [
    { href: '/', label: 'ホーム', icon: '🏠' },
    { href: '/map', label: '地図', icon: '🗺️' },
    { href: '/search', label: '検索', icon: '🔍' },
    { href: '/challenge/new', label: '投稿', icon: '➕' },
    { href: user ? '/mypage' : '/auth', label: user ? 'マイページ' : 'ログイン', icon: user ? '👤' : '🔐' }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // デスクトップ用のナビゲーション
  if (!isMobileView) {
    return (
      <nav style={{
        display: 'flex',
        gap: '24px',
        alignItems: 'center'
      }}>
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              textDecoration: 'none',
              color: isActive(item.href) ? '#1890ff' : '#333',
              fontWeight: isActive(item.href) ? 'bold' : 'normal',
              padding: '8px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.href)) {
                e.currentTarget.style.background = '#f0f8ff';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.href)) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  // モバイル用のボトムナビゲーション
  return (
    <>
      {/* ボトムナビゲーション */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderTop: '1px solid #eee',
        padding: '8px 0',
        zIndex: 1000,
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: isActive(item.href) ? '#1890ff' : '#666',
                padding: '8px 4px',
                borderRadius: '8px',
                minWidth: '60px',
                transition: 'all 0.2s ease',
                ...(isTouchDevice() && {
                  WebkitTapHighlightColor: 'transparent',
                  userSelect: 'none'
                })
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div style={{
                fontSize: '20px',
                marginBottom: '4px'
              }}>
                {item.icon}
              </div>
              <div style={{
                fontSize: '10px',
                fontWeight: isActive(item.href) ? 'bold' : 'normal'
              }}>
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* ハンバーガーメニュー（追加メニュー用） */}
      <div style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 1001
      }}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#fff',
            border: '1px solid #ddd',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* ハンバーガーメニューのオーバーレイ */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}

      {/* ハンバーガーメニューのコンテンツ */}
      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '16px',
          background: '#fff',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          minWidth: '200px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <Link
              href="/support"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                textDecoration: 'none',
                color: '#333',
                borderRadius: '8px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span>💬</span>
              <span>サポート</span>
            </Link>
            
            <Link
              href="/about"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                textDecoration: 'none',
                color: '#333',
                borderRadius: '8px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span>ℹ️</span>
              <span>アプリについて</span>
            </Link>
            
            {user && (
              <button
                onClick={() => {
                  // ログアウト処理
                  setIsMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  color: '#ff4d4f',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fff1f0'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>🚪</span>
                <span>ログアウト</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* モバイル用のメインコンテンツのパディング調整 */}
      <div style={{ paddingBottom: '80px' }} />
    </>
  );
};

export default MobileNavigation; 