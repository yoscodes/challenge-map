"use client";

import React from "react";

type UserMiniProfileProps = {
  username: string;
  profileImage?: string;
  bio?: string;
  supporterCount: number;
  applauseCount: number;
  activeChallenges: number;
};

const UserMiniProfile = ({ 
  username, 
  profileImage, 
  bio, 
  supporterCount, 
  applauseCount, 
  activeChallenges 
}: UserMiniProfileProps) => (
  <section style={{ 
    background: '#fff', 
    borderRadius: 12, 
    padding: 24, 
    marginBottom: 24,
    border: '1px solid #eee'
  }}>
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      {/* プロフィール画像 */}
      <div style={{ flexShrink: 0 }}>
        <img
          src={profileImage || "https://via.placeholder.com/80x80/87CEEB/FFFFFF?text=👤"}
          alt="プロフィール画像"
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #f0f0f0'
          }}
        />
      </div>
      
      {/* プロフィール情報 */}
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: 20, fontWeight: 'bold', margin: '0 0 8px 0', color: '#222' }}>
          {username}
        </h2>
        
        {bio && (
          <div style={{ 
            fontSize: 14, 
            lineHeight: 1.5, 
            marginBottom: 12,
            color: '#333',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            background: 'rgba(37,99,235,0.03)',
            borderRadius: 8,
            padding: '10px',
            border: '1px solid rgba(37,99,235,0.1)'
          }}>
            {bio}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: 16, fontSize: 14, color: '#666', marginBottom: 8 }}>
          <span>📈 現在の支援者数：{supporterCount}人</span>
          <span>拍手：{applauseCount}</span>
        </div>
        
        <div style={{ fontSize: 14, color: '#666' }}>
          🔥 継続中のチャレンジ：{activeChallenges}件
        </div>
      </div>
    </div>
  </section>
);

export default UserMiniProfile; 