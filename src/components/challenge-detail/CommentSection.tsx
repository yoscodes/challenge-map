"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { comments as commentsAPI } from "@/lib/database";
import type { Comment } from "@/lib/supabase";
import ReportModal from '@/components/common/ReportModal';

type CommentData = {
  id: string;
  author: string;
  content: string;
  date: string;
  isAnonymous?: boolean;
  canDelete?: boolean;
};

type CommentSectionProps = {
  comments: CommentData[];
  challengeId: string;
  onCommentAdded?: () => void;
};

const CommentSection = ({ comments: initialComments, challengeId, onCommentAdded }: CommentSectionProps) => {
  const { user, loading } = useAuth();
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!newComment.trim() || !user || !challengeId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const commentData = {
        challenge_id: challengeId,
        user_id: isAnonymous ? undefined : user.id,
        content: newComment.trim(),
        is_anonymous: isAnonymous,
      };

      const { data, error: commentError } = await commentsAPI.create(commentData);

      if (commentError) {
        console.error('コメント投稿エラー:', commentError);
        setError('コメントの投稿に失敗しました。');
        return;
      }

      // 新しいコメントを追加
      const newCommentData: CommentData = {
        id: data.id,
        author: isAnonymous ? '匿名' : user.email?.split('@')[0] || 'Unknown',
        content: newComment.trim(),
        date: new Date().toLocaleString('ja-JP'),
        isAnonymous,
        canDelete: true,
      };

      setComments([...comments, newCommentData]);
      setNewComment("");
      setIsAnonymous(false);
      onCommentAdded?.();

    } catch (err) {
      console.error('コメント投稿エラー:', err);
      setError('コメントの投稿に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!user) return;

    try {
      const { error } = await commentsAPI.delete(commentId);
      
      if (error) {
        console.error('コメント削除エラー:', error);
        setError('コメントの削除に失敗しました。');
        return;
      }

      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('コメント削除エラー:', err);
      setError('コメントの削除に失敗しました。');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  if (loading) {
    return (
      <section className="comment-section-card">
        <div className="comment-section-loading"></div>
      </section>
    );
  }

  // textarea, コメントリスト、コメントアイテムのスタイルを強化
  const textareaStyle = {
    width: '100%',
    minHeight: 64,
    border: '1.5px solid #b6c2d9',
    borderRadius: 10,
    padding: '12px 14px',
    fontSize: 15,
    background: '#fff',
    marginBottom: 10,
    outline: 'none',
    boxShadow: '0 1px 4px #b6c2d933',
    resize: 'vertical' as const,
    transition: 'border 0.2s',
    color: '#222', // 文字色を濃く
  };
  const commentItemStyle = {
    background: '#fff',
    border: '1.2px solid #e2e8f0',
    borderRadius: 10,
    padding: '14px 16px',
    marginBottom: 14,
    boxShadow: '0 1px 6px #b6c2d922',
    position: 'relative' as const, // 通報ボタン配置用
  };
  const deleteBtnStyle = {
    background: 'none',
    color: '#bbb',
    border: 'none',
    borderRadius: '50%',
    fontSize: 18,
    cursor: 'pointer',
    position: 'absolute' as const,
    top: '50%',
    right: 10,
    transform: 'translateY(-50%)',
    zIndex: 2,
    padding: 0,
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.18s',
  };

  return (
    <section className="comment-section-card">
      {!user ? (
        <div className="comment-section-login-required">
          コメントを投稿するには<a href="/auth" className="comment-section-login-link">ログイン</a>してください
        </div>
      ) : (
        <div className="comment-section-form">
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="応援メッセージを入力してください... (Ctrl+Enterで投稿)"
            className="comment-section-textarea"
            disabled={isSubmitting}
            style={textareaStyle}
          />
          {error && (
            <div className="comment-section-error">
              {error}
            </div>
          )}
          <div className="comment-section-form-bottom">
            <div className="comment-section-form-meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <label className="comment-section-anonymous-label">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="comment-section-anonymous-checkbox"
                  />
                  匿名で投稿
                </label>
                <span className="comment-section-length">
                  {newComment.length}/500文字
                </span>
              </div>
              <button 
                onClick={handleSubmit}
                disabled={!newComment.trim() || isSubmitting}
                className="comment-section-submit-btn"
                style={{ marginLeft: 16, minWidth: 110 }}
              >
                {isSubmitting ? '投稿中...' : 'コメント投稿'}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="comment-section-list">
        {comments.length === 0 ? (
          <div className="comment-section-empty">まだコメントがありません。最初のコメントを投稿してみましょう！</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-section-item" style={commentItemStyle}>
              <div className="comment-section-item-header">
                <div className="comment-section-author">
                  <span className="comment-section-author-name">
                    {comment.isAnonymous ? '匿名' : `@${comment.author}`}
                  </span>
                  <span className="comment-section-date">
                    {comment.date}
                  </span>
                </div>
                <div className="comment-section-item-actions" style={{position: 'relative'}}>
                  {comment.canDelete && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="comment-section-delete-btn"
                      title="削除"
                      style={deleteBtnStyle}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              <div className="comment-section-content">
                {comment.content}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;