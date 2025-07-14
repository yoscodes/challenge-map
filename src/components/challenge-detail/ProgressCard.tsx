"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { comments as commentsAPI } from "@/lib/database";
import { getImageUrlFromStorage } from "@/lib/storage";
import type { ProgressComment } from "@/lib/supabase";
import ApplauseButton from "@/components/common/ApplauseButton";
import { getApplauseCount, isApplaudedByUser } from "@/lib/applause";
import { progressUpdates } from '@/lib/database';

type ProgressCommentData = {
  id: string;
  author: string;
  content: string;
  date: string;
  isAnonymous?: boolean;
  canDelete?: boolean;
};

type ProgressCardProps = {
  id: string;
  date: string;
  content: string;
  imageUrl?: string;
  images?: string[];
  applauseCount: number;
  commentCount: number;
  progressType?: string; // 追加
  onDelete?: (id: string) => void; // 追加
};

const ProgressCard = ({ id, date, content, imageUrl, images, applauseCount, commentCount, progressType, onDelete }: ProgressCardProps) => {
  const { user, loading } = useAuth();
  const [comments, setComments] = useState<ProgressCommentData[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applauseCnt, setApplauseCnt] = useState(applauseCount || 0);
  const [applauded, setApplauded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // 追加

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

  const fetchComments = async () => {
    try {
      const { data, error } = await commentsAPI.getByProgressId(id);
      if (error) {
        console.error('進捗コメント取得エラー:', error);
        return;
      }
      
      const commentData = data?.map(comment => ({
        id: comment.id,
        author: comment.user_id ? comment.users?.username || 'Unknown' : '匿名',
        content: comment.content,
        date: new Date(comment.created_at).toLocaleString('ja-JP'),
        isAnonymous: comment.is_anonymous,
        canDelete: comment.user_id === user?.id,
      })) || [];
      
      setComments(commentData);
    } catch (err) {
      console.error('進捗コメント取得エラー:', err);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const commentData = {
        progress_id: id,
        user_id: user.id,
        content: newComment.trim(),
      };

      const { data, error: commentError } = await commentsAPI.createProgressComment(commentData);

      if (commentError) {
        console.error('進捗コメント投稿エラー:', commentError);
        // コメント機能が無効な場合の特別な処理
        if (commentError && typeof commentError === 'object' && 'message' in commentError && commentError.message === '進捗コメント機能は現在利用できません') {
          setError('コメント機能は現在メンテナンス中です。しばらくお待ちください。');
        } else {
          setError('コメントの投稿に失敗しました。');
        }
        return;
      }

      // 新しいコメントを追加
      const newCommentData: ProgressCommentData = {
        id: data.id,
        author: user.email?.split('@')[0] || 'Unknown',
        content: newComment.trim(),
        date: new Date().toLocaleString('ja-JP'),
        isAnonymous: false,
        canDelete: true,
      };

      setComments([...comments, newCommentData]);
      setNewComment("");

    } catch (err) {
      console.error('進捗コメント投稿エラー:', err);
      setError('コメントの投稿に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const { error } = await commentsAPI.deleteProgressComment(commentId);
      
      if (error) {
        console.error('進捗コメント削除エラー:', error);
        // コメント機能が無効な場合の特別な処理
        if (error && typeof error === 'object' && 'message' in error && error.message === '進捗コメント機能は現在利用できません') {
          setError('コメント機能は現在メンテナンス中です。しばらくお待ちください。');
        } else {
          setError('コメントの削除に失敗しました。');
        }
        return;
      }

      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('進捗コメント削除エラー:', err);
      setError('コメントの削除に失敗しました。');
    }
  };

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmitComment();
    }
  };

  // コメントセクションが開かれたときにコメントを取得
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative', marginBottom: 48 }}>
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
        <div style={{ flex: 1, width: 4, background: 'linear-gradient(180deg,#e0e7ef 0%,#b2d8ef 100%)', minHeight: 80, borderRadius: 2 }} />
      </div>
      {/* カード本体 */}
      <div className="progress-card" style={{ flex: 1, marginLeft: 12, background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #2563eb13', padding: 24, position: 'relative', animation: 'fadeInUp 0.7s', minWidth: 0 }}>
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
        <div className="progress-card-content" style={{ fontSize: 17, fontWeight: 500, color: '#222', marginBottom: 16, lineHeight: 1.7 }}>
          {content}
        </div>
        <div className="progress-card-actions" style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 4 }}>
          <ApplauseButton
            targetType="progress"
            targetId={id}
            initialCount={applauseCnt}
            initialApplauded={applauded}
            onChange={(a, c) => { setApplauded(a); setApplauseCnt(c); }}
          />
          <button
            onClick={() => setShowComments(!showComments)}
            className="progress-card-comment-btn"
            style={{ background: 'none', border: 'none', color: '#888', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
          >
            💬 {comments.length}コメント
          </button>
        </div>
        {/* コメントセクション（省略: 既存のまま） */}
        {showComments && (
          <div className="progress-card-comments">
            <h4 className="progress-card-comments-title">
              💬 コメント
            </h4>
            {!user ? (
              <div className="progress-card-login-required">
                コメントを投稿するには<a href="/auth" className="progress-card-login-link">ログイン</a>してください
              </div>
            ) : (
              <div className="progress-card-comment-form">
                <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="応援メッセージを入力してください... (Ctrl+Enterで投稿)"
                  className="progress-card-comment-textarea"
                  disabled={isSubmitting}
                />
                {error && (
                  <div className="progress-card-comment-error">
                    {error}
                  </div>
                )}
                <div className="progress-card-comment-form-bottom">
                  <div className="progress-card-comment-form-meta">
                    <label className="progress-card-anonymous-label">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="progress-card-anonymous-checkbox"
                      />
                      匿名
                    </label>
                    <span className="progress-card-comment-length">
                      {newComment.length}/200文字
                    </span>
                  </div>
                  <button 
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmitting}
                    className="progress-card-comment-submit-btn"
                  >
                    {isSubmitting ? '投稿中...' : '投稿'}
                  </button>
                </div>
              </div>
            )}
            <div className="progress-card-comment-list">
              {comments.length === 0 ? (
                <div className="progress-card-comment-empty">まだコメントがありません</div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="progress-card-comment-item">
                    <div className="progress-card-comment-item-header">
                      <div className="progress-card-comment-author">
                        <span className="progress-card-comment-author-name">
                          {comment.isAnonymous ? '匿名' : `@${comment.author}`}
                        </span>
                        <span className="progress-card-comment-date">
                          {comment.date}
                        </span>
                      </div>
                      {comment.canDelete && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="progress-card-comment-delete-btn"
                          title="削除"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    <div className="progress-card-comment-content">
                      {comment.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressCard; 