"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { isMobile, getMobileStyles } from "@/lib/mobile-utils";
import MobileNavigation from "@/components/common/MobileNavigation";

const Header = () => {
  const { user } = useAuth();
  const [isMobileView, setIsMobileView] = useState(false);
  const mobileStyles = getMobileStyles();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(isMobile());
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // モバイルの場合はMobileNavigationを使用
  if (isMobileView) {
    return (
      <header style={{
        ...mobileStyles.mobilePadding,
        borderBottom: '1px solid #eee',
        background: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <Link href="/" style={{
            textDecoration: 'none',
            color: '#333'
          }}>
            <div style={{
              fontWeight: 'bold',
              fontSize: '20px'
            }}>
              ChallengeMap
            </div>
          </Link>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <Link href="/search" style={{
              textDecoration: 'none',
              color: '#666',
              padding: '8px',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              🔍
            </Link>
            {user ? (
              <Link href="/mypage" style={{
                textDecoration: 'none',
                color: '#666',
                padding: '8px',
                borderRadius: '6px',
                fontSize: '14px'
              }}>
                👤
              </Link>
            ) : (
              <Link href="/auth" style={{
                textDecoration: 'none',
                color: '#666',
                padding: '8px',
                borderRadius: '6px',
                fontSize: '14px'
              }}>
                🔐
              </Link>
            )}
          </div>
        </div>
        
        <MobileNavigation user={user} />
      </header>
    );
  }

  // デスクトップ用のヘッダー
  return (
    <header className="header-desktop">
      <Link href="/" style={{
        textDecoration: 'none',
        color: '#333'
      }}>
        <div style={{
          fontWeight: 'bold',
          fontSize: '24px'
        }}>
          ChallengeMap
        </div>
      </Link>
      
      <nav style={{
        display: 'flex',
        gap: '24px',
        alignItems: 'center'
      }}>
        <Link href="/map" style={{
          textDecoration: 'none',
          color: '#333',
          padding: '8px 12px',
          borderRadius: '6px',
          transition: 'background-color 0.2s ease'
        }}>
          地図
        </Link>
        <Link href="/search" style={{
          textDecoration: 'none',
          color: '#333',
          padding: '8px 12px',
          borderRadius: '6px',
          transition: 'background-color 0.2s ease'
        }}>
          検索
        </Link>
        <Link href="/challenge/new" style={{
          textDecoration: 'none',
          color: '#333',
          padding: '8px 12px',
          borderRadius: '6px',
          transition: 'background-color 0.2s ease'
        }}>
          投稿
        </Link>
      </nav>
      
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        {user ? (
          <Link href="/mypage" style={{
            textDecoration: 'none',
            color: '#1890ff',
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #1890ff',
            transition: 'all 0.2s ease'
          }}>
            マイページ
          </Link>
        ) : (
          <Link href="/auth" style={{
            textDecoration: 'none',
            color: '#1890ff',
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #1890ff',
            transition: 'all 0.2s ease'
          }}>
            ログイン
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header; 