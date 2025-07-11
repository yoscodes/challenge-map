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
  const [reportTargetId, setReportTargetId] = useState<string|null>(null);

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
      <section style={{ marginBottom: 32 }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </section>
    );
  }

  return (
    <section style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        💬 コメント欄（応援メッセージ投稿）
      </h3>
      
      {!user ? (
        <div style={{ 
          padding: '16px', 
          background: '#f8f9fa', 
          borderRadius: 8, 
          border: '1px solid #e9ecef',
          textAlign: 'center',
          color: '#666'
        }}>
          コメントを投稿するには<a href="/auth" style={{ color: '#1890ff', textDecoration: 'underline' }}>ログイン</a>してください
        </div>
      ) : (
        <div style={{ marginBottom: 16 }}>
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="応援メッセージを入力してください... (Ctrl+Enterで投稿)"
            style={{ 
              width: '100%', 
              minHeight: 80, 
              padding: 12, 
              border: '1px solid #ddd', 
              borderRadius: 8,
              resize: 'vertical',
              fontSize: 14,
              lineHeight: 1.5
            }}
            disabled={isSubmitting}
          />
          
          {error && (
            <div style={{ 
              marginTop: 8, 
              padding: '8px 12px', 
              background: '#fff2f0', 
              border: '1px solid #ffccc7', 
              borderRadius: 4,
              color: '#cf1322',
              fontSize: 14
            }}>
              {error}
            </div>
          )}
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: 8 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  style={{ margin: 0 }}
                />
                匿名で投稿
              </label>
              
              <span style={{ fontSize: 12, color: '#666' }}>
                {newComment.length}/500文字
              </span>
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={!newComment.trim() || isSubmitting}
              style={{ 
                padding: '8px 16px',
                background: newComment.trim() && !isSubmitting ? '#1890ff' : '#d9d9d9',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: newComment.trim() && !isSubmitting ? 'pointer' : 'not-allowed',
                fontSize: 14
              }}
            >
              {isSubmitting ? '投稿中...' : 'コメント投稿'}
            </button>
          </div>
        </div>
      )}
      
      <div>
        {comments.length === 0 ? (
          <div style={{ 
            padding: '24px', 
            textAlign: 'center', 
            color: '#666',
            background: '#f8f9fa',
            borderRadius: 8,
            border: '1px solid #e9ecef'
          }}>
            まだコメントがありません。最初のコメントを投稿してみましょう！
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} style={{ 
              border: '1px solid #eee', 
              borderRadius: 8, 
              padding: 12, 
              marginBottom: 8,
              background: '#fafafa'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: 8
              }}>
                <div style={{ fontSize: 14, color: '#666' }}>
                  <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                    {comment.isAnonymous ? '匿名' : `@${comment.author}`}
                  </span>
                  <span style={{ marginLeft: 8 }}>
                    {comment.date}
                  </span>
                </div>
                
                {comment.canDelete && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff4d4f',
                      cursor: 'pointer',
                      fontSize: 12,
                      padding: '4px 8px',
                      borderRadius: 4
                    }}
                    title="削除"
                  >
                    🗑️
                  </button>
                )}
                <button
                  onClick={() => setReportTargetId(comment.id)}
                  style={{ marginLeft: 8, background: '#ff7875', color: '#fff', border: 'none', borderRadius: 6, padding: '2px 8px', fontSize: 12, cursor: 'pointer' }}
                >
                  通報
                </button>
              </div>
              
              <div style={{ 
                lineHeight: 1.5,
                fontSize: 14,
                wordBreak: 'break-word'
              }}>
                {comment.content}
              </div>
            </div>
          ))
        )}
      </div>
      <ReportModal
        open={!!reportTargetId}
        onClose={() => setReportTargetId(null)}
        targetType="comment"
        targetId={reportTargetId || ''}
      />
    </section>
  );
};

export default CommentSection; 