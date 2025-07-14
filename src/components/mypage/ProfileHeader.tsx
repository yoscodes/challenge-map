"use client";

import React from "react";
import { getPlaceholderImage, PLACEHOLDER_TYPES } from "@/lib/placeholder-images";
import { uploadImageToStorage, getImageUrlFromStorage } from '@/lib/storage';

type ProfileHeaderProps = {
  username: string;
  profileImage?: string;
  bio: string;
  location?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
  userId: string;
  onAvatarChange?: (url: string) => void;
};

const ProfileHeader = ({ 
  username, 
  profileImage, 
  bio, 
  location, 
  website, 
  twitter, 
  instagram,
  userId,
  onAvatarChange
}: ProfileHeaderProps) => {
  const [uploading, setUploading] = React.useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    // 修正: filePathから'avatars/'を除去
    const filePath = `${userId}_${Date.now()}.${ext}`;
    const { error } = await uploadImageToStorage(file, filePath, 'avatars');
    if (error) {
      alert('アップロードに失敗しました: ' + error);
      setUploading(false);
      return;
    }
    // 修正: getImageUrlFromStorageにも同じfilePathを渡す
    const url = getImageUrlFromStorage(filePath, 'avatars');
    setUploading(false);
    if (onAvatarChange) onAvatarChange(url);
  };

  return (
    <section style={{ 
      background: '#fff', 
      borderRadius: 12, 
      padding: 24, 
      marginBottom: 24,
      border: '1px solid #eee'
    }}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* プロフィール画像 */}
        <div style={{ flexShrink: 0, textAlign: 'center' }}>
          <img
            src={profileImage || getPlaceholderImage(PLACEHOLDER_TYPES.AVATAR)}
            alt="プロフィール画像"
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #f0f0f0'
            }}
            onError={(e) => { e.currentTarget.src = getPlaceholderImage(PLACEHOLDER_TYPES.AVATAR); }}
          />
          <div style={{ marginTop: 12 }}>
            <label style={{ cursor: uploading ? 'not-allowed' : 'pointer', color: uploading ? '#aaa' : '#1890ff', fontSize: 14 }}>
              {uploading ? 'アップロード中...' : '画像を変更'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} disabled={uploading} />
            </label>
          </div>
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
};

export default ProfileHeader; 