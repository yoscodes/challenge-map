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
  onDelete?: (id: string) => void; // 追加
};

const ProgressCard = ({ id, date, content, imageUrl, images, applauseCount, commentCount, onDelete }: ProgressCardProps) => {
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
    <div style={{ 
      border: '1px solid #eee', 
      borderRadius: 8, 
      padding: 16, 
      marginBottom: 16,
      background: '#fff'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: 12,
        fontSize: 14,
        color: '#666',
        justifyContent: 'space-between' // 追加
      }}>
        <span>🔽 {date}</span>
        {/* 削除ボタン */}
        {onDelete && (
          <button
            onClick={handleDeleteProgress}
            disabled={isDeleting}
            style={{
              background: 'none',
              border: 'none',
              color: '#ff4d4f',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              fontSize: 14,
              padding: '2px 8px',
              borderRadius: 4
            }}
            title="進捗を削除"
          >
            🗑️
          </button>
        )}
      </div>
      
      {/* Storage画像を表示 */}
      {images && images.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {images.map((imgPath, idx) => (
            <img
              key={idx}
              src={getImageUrlFromStorage(imgPath)}
              alt={`進捗画像${idx + 1}`}
              style={{ maxWidth: 180, maxHeight: 180, borderRadius: 8, border: '1px solid #eee' }}
            />
          ))}
        </div>
      )}
      {/* 旧imageUrl（互換） */}
      {imageUrl && (
        <div style={{ marginBottom: 12 }}>
          <img 
            src={imageUrl} 
            alt="進捗画像" 
            style={{ 
              maxWidth: '100%', 
              borderRadius: 8,
              border: '1px solid #eee'
            }} 
          />
        </div>
      )}
      
      <div style={{ 
        marginBottom: 12,
        lineHeight: 1.5,
        fontSize: 16
      }}>
        {content}
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: 16,
        fontSize: 14,
        color: '#666',
        marginBottom: 12
      }}>
        <ApplauseButton
          targetType="progress"
          targetId={id}
          initialCount={applauseCnt}
          initialApplauded={applauded}
          onChange={(a, c) => { setApplauded(a); setApplauseCnt(c); }}
        />
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            background: 'none',
            border: 'none',
            color: '#1890ff',
            cursor: 'pointer',
            fontSize: 14,
            padding: 0
          }}
        >
          💬 {comments.length}コメント
        </button>
      </div>

      {/* コメントセクション */}
      {showComments && (
        <div style={{ 
          borderTop: '1px solid #eee', 
          paddingTop: 12,
          marginTop: 12
        }}>
          <h4 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
            💬 コメント
          </h4>
          
          {!user ? (
            <div style={{ 
              padding: '12px', 
              background: '#f8f9fa', 
              borderRadius: 6, 
              border: '1px solid #e9ecef',
              textAlign: 'center',
              color: '#666',
              fontSize: 14
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
                  minHeight: 60, 
                  padding: 8, 
                  border: '1px solid #ddd', 
                  borderRadius: 4,
                  resize: 'vertical',
                  fontSize: 14,
                  lineHeight: 1.5
                }}
                disabled={isSubmitting}
              />
              
              {error && (
                <div style={{ 
                  marginTop: 4, 
                  padding: '4px 8px', 
                  background: '#fff2f0', 
                  border: '1px solid #ffccc7', 
                  borderRadius: 4,
                  color: '#cf1322',
                  fontSize: 12
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      style={{ margin: 0 }}
                    />
                    匿名
                  </label>
                  
                  <span style={{ fontSize: 12, color: '#666' }}>
                    {newComment.length}/200文字
                  </span>
                </div>
                
                <button 
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                  style={{ 
                    padding: '4px 8px',
                    background: newComment.trim() && !isSubmitting ? '#1890ff' : '#d9d9d9',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    cursor: newComment.trim() && !isSubmitting ? 'pointer' : 'not-allowed',
                    fontSize: 12
                  }}
                >
                  {isSubmitting ? '投稿中...' : '投稿'}
                </button>
              </div>
            </div>
          )}
          
          <div>
            {comments.length === 0 ? (
              <div style={{ 
                padding: '12px', 
                textAlign: 'center', 
                color: '#666',
                background: '#f8f9fa',
                borderRadius: 6,
                border: '1px solid #e9ecef',
                fontSize: 14
              }}>
                まだコメントがありません
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} style={{ 
                  border: '1px solid #eee', 
                  borderRadius: 6, 
                  padding: 8, 
                  marginBottom: 8,
                  background: '#fafafa'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: 4
                  }}>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                        {comment.isAnonymous ? '匿名' : `@${comment.author}`}
                      </span>
                      <span style={{ marginLeft: 8 }}>
                        {comment.date}
                      </span>
                    </div>
                    
                    {comment.canDelete && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ff4d4f',
                          cursor: 'pointer',
                          fontSize: 10,
                          padding: '2px 4px',
                          borderRadius: 2
                        }}
                        title="削除"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  
                  <div style={{ 
                    lineHeight: 1.4,
                    fontSize: 13,
                    wordBreak: 'break-word'
                  }}>
                    {comment.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressCard; 