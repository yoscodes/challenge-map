"use client";
import React, { useState } from "react";

type UserProfileEditModalProps = {
  initialBio: string;
  initialWebsite?: string;
  initialTwitter?: string;
  initialInstagram?: string;
  open: boolean;
  onClose: () => void;
  onSave: (values: { bio: string; website?: string; twitter?: string; instagram?: string }) => void;
};

const UserProfileEditModal = ({ initialBio, initialWebsite, initialTwitter, initialInstagram, open, onClose, onSave }: UserProfileEditModalProps) => {
  const [bio, setBio] = useState(initialBio);
  const [website, setWebsite] = useState(initialWebsite || "");
  const [twitter, setTwitter] = useState(initialTwitter || "");
  const [instagram, setInstagram] = useState(initialInstagram || "");
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 360, maxWidth: 480, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
        <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>プロフィール編集</h2>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>自己紹介</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} style={{ width: '100%', minHeight: 80, marginTop: 4, borderRadius: 6, border: '1px solid #ddd', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Webサイト</label>
          <input value={website} onChange={e => setWebsite(e.target.value)} style={{ width: '100%', marginTop: 4, borderRadius: 6, border: '1px solid #ddd', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Twitter</label>
          <input value={twitter} onChange={e => setTwitter(e.target.value)} style={{ width: '100%', marginTop: 4, borderRadius: 6, border: '1px solid #ddd', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 'bold', fontSize: 14 }}>Instagram</label>
          <input value={instagram} onChange={e => setInstagram(e.target.value)} style={{ width: '100%', marginTop: 4, borderRadius: 6, border: '1px solid #ddd', padding: 8 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button onClick={onClose} style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: '#eee', color: '#333', fontWeight: 'bold', cursor: 'pointer' }}>キャンセル</button>
          <button onClick={() => onSave({ bio, website, twitter, instagram })} style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: '#1890ff', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>保存</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileEditModal; 