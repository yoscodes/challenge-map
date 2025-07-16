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
  onUsernameChange?: (username: string) => Promise<void>;
  onBioChange?: (bio: string) => Promise<void>;
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
  onAvatarChange,
  onUsernameChange,
  onBioChange
}: ProfileHeaderProps) => {
  const [uploading, setUploading] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [editingBio, setEditingBio] = React.useState(false);
  const [usernameInput, setUsernameInput] = React.useState(username.replace(/^@/, ''));
  const [bioInput, setBioInput] = React.useState(bio);
  const [saving, setSaving] = React.useState(false);
  const [savingBio, setSavingBio] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [bioError, setBioError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setUsernameInput(username.replace(/^@/, ''));
  }, [username]);

  React.useEffect(() => {
    setBioInput(bio);
  }, [bio]);

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

  const handleUsernameSave = async () => {
    if (!usernameInput.trim()) {
      setError('ユーザー名を入力してください');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (onUsernameChange) await onUsernameChange(usernameInput.trim());
      setEditing(false);
    } catch (e) {
      setError('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleBioSave = async () => {
    if (!bioInput.trim()) {
      setBioError('自己紹介を入力してください');
      return;
    }
    if (bioInput.length > 500) {
      setBioError('自己紹介は500文字以内で入力してください');
      return;
    }
    setSavingBio(true);
    setBioError(null);
    try {
      if (onBioChange) await onBioChange(bioInput.trim());
      setEditingBio(false);
    } catch (e) {
      setBioError('保存に失敗しました');
    } finally {
      setSavingBio(false);
    }
  };

  return (
    <section className="card fade-in" style={{ 
      background: 'linear-gradient(135deg, #e0e7ef 0%, #fff 100%)',
      borderRadius: 22, 
      padding: 32, 
      marginBottom: 32,
      boxShadow: '0 4px 24px rgba(37,99,235,0.08)',
      border: 'none',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
        {/* プロフィール画像 */}
        <div style={{ flexShrink: 0, textAlign: 'center', position: 'relative' }}>
          <img
            src={profileImage || getPlaceholderImage(PLACEHOLDER_TYPES.AVATAR)}
            alt="プロフィール画像"
            style={{
              width: 128,
              height: 128,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid #60a5fa',
              boxShadow: '0 4px 24px #60a5fa33',
              background: '#fff'
            }}
            onError={(e) => { e.currentTarget.src = getPlaceholderImage(PLACEHOLDER_TYPES.AVATAR); }}
          />
          <div style={{ marginTop: 14 }}>
            <label style={{ cursor: uploading ? 'not-allowed' : 'pointer', color: uploading ? '#aaa' : '#2563eb', fontSize: 15, fontWeight: 600, background: 'rgba(37,99,235,0.08)', borderRadius: 8, padding: '6px 18px', display: 'inline-block', transition: 'background 0.2s' }}>
              {uploading ? 'アップロード中...' : '画像を変更'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} disabled={uploading} />
            </label>
          </div>
        </div>
        {/* プロフィール情報 */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 10px 0', color: '#2563eb', letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32, marginRight: 6 }}>👤</span>
            {editing ? (
              <>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    border: '1.5px solid #60a5fa',
                    borderRadius: 8,
                    padding: '6px 16px',
                    outline: 'none',
                    marginRight: 8,
                    background: '#f8fafc',
                    color: '#2563eb',
                    boxShadow: '0 2px 8px #60a5fa22',
                    transition: 'border 0.2s',
                  }}
                  maxLength={24}
                  disabled={saving}
                />
                <button
                  onClick={handleUsernameSave}
                  disabled={saving}
                  style={{
                    background: 'linear-gradient(90deg,#2563eb,#60a5fa)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 15,
                    padding: '6px 18px',
                    marginRight: 6,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px #2563eb22',
                    transition: 'background 0.2s',
                  }}
                >{saving ? '保存中...' : '保存'}</button>
                <button
                  onClick={() => { setEditing(false); setUsernameInput(username.replace(/^@/, '')); setError(null); }}
                  disabled={saving}
                  style={{
                    background: '#eee',
                    color: '#2563eb',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 15,
                    padding: '6px 14px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    marginLeft: 2
                  }}
                >キャンセル</button>
              </>
            ) : (
              <>
                @{usernameInput}
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    marginLeft: 12,
                    background: 'rgba(37,99,235,0.08)',
                    color: '#2563eb',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 15,
                    padding: '6px 14px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >ユーザー名を編集</button>
              </>
            )}
          </h1>
          {error && <div style={{ color: '#ff4d4f', fontWeight: 600, marginBottom: 8 }}>{error}</div>}
          {location && (
            <div style={{ fontSize: 15, color: '#2563eb', marginBottom: 10, fontWeight: 600 }}>
              📍 {location}
            </div>
          )}
          
          {/* 自己紹介欄 */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#2563eb' }}>📝 自己紹介</span>
              {!editingBio && (
                <button
                  onClick={() => setEditingBio(true)}
                  style={{
                    background: 'rgba(37,99,235,0.08)',
                    color: '#2563eb',
                    border: 'none',
                    borderRadius: 6,
                    fontWeight: 600,
                    fontSize: 13,
                    padding: '4px 10px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >編集</button>
              )}
            </div>
            
            {editingBio ? (
              <div>
                <textarea
                  value={bioInput}
                  onChange={e => setBioInput(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: 80,
                    fontSize: 16,
                    lineHeight: 1.6,
                    border: '1.5px solid #60a5fa',
                    borderRadius: 8,
                    padding: '12px',
                    outline: 'none',
                    background: '#f8fafc',
                    color: '#222',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxShadow: '0 2px 8px #60a5fa22',
                    transition: 'border 0.2s',
                  }}
                  placeholder="自己紹介を入力してください（500文字以内）"
                  maxLength={500}
                  disabled={savingBio}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <button
                    onClick={handleBioSave}
                    disabled={savingBio}
                    style={{
                      background: 'linear-gradient(90deg,#2563eb,#60a5fa)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      fontWeight: 700,
                      fontSize: 14,
                      padding: '6px 16px',
                      cursor: savingBio ? 'not-allowed' : 'pointer',
                      boxShadow: '0 2px 8px #2563eb22',
                      transition: 'background 0.2s',
                    }}
                  >{savingBio ? '保存中...' : '保存'}</button>
                  <button
                    onClick={() => { setEditingBio(false); setBioInput(bio); setBioError(null); }}
                    disabled={savingBio}
                    style={{
                      background: '#eee',
                      color: '#2563eb',
                      border: 'none',
                      borderRadius: 6,
                      fontWeight: 700,
                      fontSize: 14,
                      padding: '6px 14px',
                      cursor: savingBio ? 'not-allowed' : 'pointer',
                    }}
                  >キャンセル</button>
                  <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>
                    {bioInput.length}/500文字
                  </span>
                </div>
                {bioError && <div style={{ color: '#ff4d4f', fontWeight: 600, marginTop: 4, fontSize: 14 }}>{bioError}</div>}
              </div>
            ) : (
              <div style={{ 
                fontSize: 16, 
                lineHeight: 1.7, 
                color: '#222', 
                fontWeight: 500,
                background: 'rgba(37,99,235,0.03)',
                borderRadius: 8,
                padding: '12px',
                border: '1px solid rgba(37,99,235,0.1)'
              }}>
                {bio || '自己紹介が設定されていません'}
              </div>
            )}
          </div>
          
          {/* SNSリンク */}
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            {website && (
              <a href={website} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 700, fontSize: 15, background: 'rgba(37,99,235,0.08)', borderRadius: 8, padding: '6px 14px', textDecoration: 'none', transition: 'background 0.2s' }}>
                🌐 Webサイト
              </a>
            )}
            {twitter && (
              <a href={twitter} target="_blank" rel="noopener noreferrer" style={{ color: '#1da1f2', fontWeight: 700, fontSize: 15, background: 'rgba(29,161,242,0.08)', borderRadius: 8, padding: '6px 14px', textDecoration: 'none', transition: 'background 0.2s' }}>
                🐦 Twitter
              </a>
            )}
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#e1306c', fontWeight: 700, fontSize: 15, background: 'rgba(225,48,108,0.08)', borderRadius: 8, padding: '6px 14px', textDecoration: 'none', transition: 'background 0.2s' }}>
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