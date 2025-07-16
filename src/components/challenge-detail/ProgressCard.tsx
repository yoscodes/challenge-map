"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getImageUrlFromStorage } from "@/lib/storage";
import LikeButton from "@/components/common/LikeButton";
import { getApplauseCount, isApplaudedByUser } from "@/lib/applause";
import { progressUpdates } from '@/lib/database';

type ProgressCardProps = {
  id: string;
  date: string;
  content: string;
  imageUrl?: string;
  images?: string[];
  applauseCount: number;
  commentCount: number;
  progressType?: string;
  onDelete?: (id: string) => void;
};

const ProgressCard = ({ id, date, content, imageUrl, images, applauseCount, commentCount, progressType, onDelete }: ProgressCardProps) => {
  const { user, loading } = useAuth();
  const [applauseCnt, setApplauseCnt] = useState(applauseCount || 0);
  const [applauded, setApplauded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 進捗タイプのバッジ色
  const typeBadge = (type?: string) => {
    if (type === 'achievement') return { label: '成果', color: '#36d1c4' };
    if (type === 'trouble') return { label: '悩み', color: '#ff4d4f' };
    if (type === 'plan') return { label: '計画', color: '#1890ff' };
    return { label: type || 'その他', color: '#bbb' };
  };
  const badge = typeBadge(progressType);

  // 初期拍手数・状態取得
  useEffect(() => {
    let ignore = false;
    const fetchApplause = async () => {
      const [{ count }, { applauded }] = await Promise.all([
        getApplauseCount('progress', id),
        user ? isApplaudedByUser(user.id, 'progress', id) : Promise.resolve({ applauded: false })
      ]);
      if (!ignore) {
        setApplauseCnt(count ?? 0);
        setApplauded(!!applauded);
      }
    };
    fetchApplause();
    return () => { ignore = true; };
  }, [id, user]);

  const handleDeleteProgress = async () => {
    if (!window.confirm('この進捗を本当に削除しますか？')) return;
    setIsDeleting(true);
    const { error } = await progressUpdates.delete(id);
    setIsDeleting(false);
    if (error) {
      alert('削除に失敗しました');
      return;
    }
    if (onDelete) onDelete(id);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative', marginBottom: 32 }}>
      {/* タイムライン縦線＋日付バッジ */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 64, position: 'relative', zIndex: 2
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: 8, background: 'linear-gradient(90deg,#36d1c4,#5b86e5)', marginBottom: 4, border: '2px solid #fff', boxShadow: '0 2px 8px #36d1c422'
        }} />
        <div style={{
          background: 'linear-gradient(90deg,#36d1c4,#5b86e5)', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 12, padding: '4px 14px', marginBottom: 8, boxShadow: '0 2px 8px #36d1c422', letterSpacing: 0.5
        }}>{date}</div>
        <div style={{ flex: 1, width: 4, background: 'linear-gradient(180deg,#e0e7ef 0%,#b2d8ef 100%)', minHeight: 60, borderRadius: 2 }} />
      </div>
      {/* カード本体 */}
      <div className="progress-card" style={{ flex: 1, marginLeft: 12, background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #2563eb13', padding: 20, position: 'relative', animation: 'fadeInUp 0.7s', minWidth: 0 }}>
        {/* 進捗タイプバッジ */}
        <div style={{ marginBottom: 8 }}>
          <span style={{
            display: 'inline-block',
            background: badge.color,
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            borderRadius: 12,
            padding: '4px 16px',
            marginRight: 8,
            marginBottom: 6,
            letterSpacing: 0.5,
            boxShadow: '0 2px 8px #36d1c422',
          }}>{badge.label}</span>
        </div>
        {/* 削除ボタンを右上に絶対配置 */}
        {onDelete && (
          <button
            onClick={handleDeleteProgress}
            disabled={isDeleting}
            className="progress-card-delete-btn"
            title="進捗を削除"
            style={{
              position: 'absolute',
              top: 12,
              right: 16,
              background: 'none',
              border: 'none',
              color: '#bbb',
              fontSize: 22,
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            🗑️
          </button>
        )}
        {/* 画像ギャラリー */}
        {images && images.length > 0 && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 12 }}>
            {images.map((imgPath, idx) => (
              <img
                key={idx}
                src={getImageUrlFromStorage(imgPath)}
                alt={`進捗画像${idx + 1}`}
                style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 10, boxShadow: '0 2px 8px #2563eb11' }}
              />
            ))}
          </div>
        )}
        {imageUrl && (
          <div style={{ marginBottom: 12 }}>
            <img 
              src={imageUrl} 
              alt="進捗画像" 
              style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 10, boxShadow: '0 2px 8px #2563eb11' }}
            />
          </div>
        )}
        <div className="progress-card-content" style={{ fontSize: 17, fontWeight: 500, color: '#222', marginBottom: 12, lineHeight: 1.7 }}>
          {content}
        </div>
        <div className="progress-card-actions" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <LikeButton
            targetType="progress"
            targetId={id}
            initialCount={applauseCnt}
            initialLiked={applauded}
            onChange={(a, c) => { setApplauded(a); setApplauseCnt(c); }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressCard; 