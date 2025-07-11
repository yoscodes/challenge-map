"use client";

import React from "react";

type ProfileHeaderProps = {
  username: string;
  profileImage?: string;
  bio: string;
  location?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
};

const ProfileHeader = ({ 
  username, 
  profileImage, 
  bio, 
  location, 
  website, 
  twitter, 
  instagram 
}: ProfileHeaderProps) => (
  <section style={{ 
    background: '#fff', 
    borderRadius: 12, 
    padding: 24, 
    marginBottom: 24,
    border: '1px solid #eee'
  }}>
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {/* プロフィール画像 */}
      <div style={{ flexShrink: 0 }}>
        <img
          src={profileImage || "https://via.placeholder.com/120x120/87CEEB/FFFFFF?text=👤"}
          alt="プロフィール画像"
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid #f0f0f0'
          }}
        />
      </div>
      
      {/* プロフィール情報 */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: '0 0 8px 0' }}>
          👤 {username}
        </h1>
        
        {location && (
          <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
            📍 {location}
          </div>
        )}
        
        <div style={{ 
          fontSize: 16, 
          lineHeight: 1.6, 
          marginBottom: 16,
          color: '#333'
        }}>
          {bio}
        </div>
        
        {/* SNSリンク */}
        <div style={{ display: 'flex', gap: 12 }}>
          {website && (
            <a href={website} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
              🌐 Webサイト
            </a>
          )}
          {twitter && (
            <a href={twitter} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
              🐦 Twitter
            </a>
          )}
          {instagram && (
            <a href={instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
              📷 Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  </section>
);

export default ProfileHeader; 