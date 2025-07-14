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
        borderBottom: 'none',
        background: 'linear-gradient(90deg,#2563eb,#60a5fa)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 16px rgba(37,99,235,0.10)',
        borderRadius: '0 0 18px 18px',
        color: '#fff',
        paddingTop: 18,
        paddingBottom: 10
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#fff' }}>
            <div style={{ fontWeight: 'bold', fontSize: '22px', letterSpacing: '0.04em', textShadow: '0 2px 8px #2563eb33' }}>
              <span style={{ fontWeight: 900, fontSize: 26 }}>C</span>hallengeMap
            </div>
          </Link>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link href="/search" style={{ color: '#fff', fontSize: 22, padding: 6, borderRadius: 8, background: 'rgba(255,255,255,0.08)' }}>🔍</Link>
            {user ? (
              <Link href="/mypage" style={{ color: '#fff', fontSize: 22, padding: 6, borderRadius: 8, background: 'rgba(255,255,255,0.08)' }}>👤</Link>
            ) : (
              <Link href="/auth" style={{ color: '#fff', fontSize: 22, padding: 6, borderRadius: 8, background: 'rgba(255,255,255,0.08)' }}>🔐</Link>
            )}
          </div>
        </div>
        <MobileNavigation user={user} />
      </header>
    );
  }

  // デスクトップ用のヘッダー
  return (
    <header className="header-desktop" style={{ background: 'linear-gradient(90deg,#2563eb,#60a5fa)', color: '#fff', boxShadow: '0 2px 16px rgba(37,99,235,0.10)', borderBottom: 'none', borderRadius: '0 0 18px 18px', padding: '18px 40px' }}>
      <Link href="/" style={{ textDecoration: 'none', color: '#fff' }}>
        <div style={{ fontWeight: 'bold', fontSize: '28px', letterSpacing: '0.04em', textShadow: '0 2px 8px #2563eb33' }}>
          <span style={{ fontWeight: 900, fontSize: 32 }}>C</span>hallengeMap
        </div>
      </Link>
      <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <Link href="/map" style={{ color: '#fff', fontWeight: 600, fontSize: 18, padding: '8px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', transition: 'background 0.2s' }}>地図</Link>
        <Link href="/search" style={{ color: '#fff', fontWeight: 600, fontSize: 18, padding: '8px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', transition: 'background 0.2s' }}>検索</Link>
        <Link href="/challenge/new" style={{ color: '#fff', fontWeight: 600, fontSize: 18, padding: '8px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', transition: 'background 0.2s' }}>投稿</Link>
      </nav>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {user ? (
          <Link href="/mypage" style={{ color: '#fff', fontWeight: 700, fontSize: 18, padding: '8px 24px', borderRadius: 12, background: 'linear-gradient(90deg,#60a5fa,#2563eb)', boxShadow: '0 2px 8px #2563eb33', border: 'none', transition: 'all 0.2s' }}>マイページ</Link>
        ) : (
          <Link href="/auth" style={{ color: '#fff', fontWeight: 700, fontSize: 18, padding: '8px 24px', borderRadius: 12, background: 'linear-gradient(90deg,#60a5fa,#2563eb)', boxShadow: '0 2px 8px #2563eb33', border: 'none', transition: 'all 0.2s' }}>ログイン</Link>
        )}
      </div>
    </header>
  );
};

export default Header; 