"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import FollowButton from '@/components/common/FollowButton';

interface FollowUser {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

interface FollowListProps {
  userId: string;
  type: 'followers' | 'following';
  onClose: () => void;
}

const FollowList: React.FC<FollowListProps> = ({ userId, type, onClose }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowList = async () => {
      try {
        const response = await fetch(`/api/follow?userId=${userId}&type=${type}`);
        if (response.ok) {
          const { data } = await response.json();
          // データ構造を調整（SupabaseのJOIN結果に応じて）
          const followUsers = data?.map((item: any) => ({
            id: type === 'followers' ? item.users?.id : item.users?.id,
            username: type === 'followers' ? item.users?.username : item.users?.username,
            avatar_url: type === 'followers' ? item.users?.avatar_url : item.users?.avatar_url,
            bio: type === 'followers' ? item.users?.bio : item.users?.bio,
            created_at: item.created_at
          })) || [];
          setUsers(followUsers);
        } else {
          setError('データの取得に失敗しました');
        }
      } catch (error) {
        console.error('フォロー一覧取得エラー:', error);
        setError('ネットワークエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowList();
  }, [userId, type]);

  const handleFollowChange = (targetUserId: string, isFollowing: boolean) => {
    // フォロー状態が変更された場合の処理
    console.log(`${targetUserId}のフォロー状態が${isFollowing ? 'フォロー' : 'フォロー解除'}に変更されました`);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* ヘッダー */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #eee',
          paddingBottom: '16px'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
            {type === 'followers' ? 'フォロワー' : 'フォロー中'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        {/* コンテンツ */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {isLoading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #1890ff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
          ) : error ? (
            <div style={{
              textAlign: 'center',
              color: '#ff4d4f',
              padding: '40px 20px'
            }}>
              {error}
            </div>
          ) : users.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#666',
              padding: '40px 20px'
            }}>
              {type === 'followers' ? 'フォロワーがいません' : 'フォロー中のユーザーがいません'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {users.map((followUser) => (
                <div
                  key={followUser.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0'
                  }}
                >
                  {/* アバター */}
                  <img
                    src={followUser.avatar_url || "https://via.placeholder.com/48x48/87CEEB/FFFFFF?text=👤"}
                    alt="アバター"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  
                  {/* ユーザー情報 */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      marginBottom: '4px'
                    }}>
                      @{followUser.username}
                    </div>
                    {followUser.bio && (
                      <div style={{
                        fontSize: '14px',
                        color: '#666',
                        lineHeight: '1.4'
                      }}>
                        {followUser.bio.length > 50 
                          ? `${followUser.bio.substring(0, 50)}...` 
                          : followUser.bio
                        }
                      </div>
                    )}
                  </div>

                  {/* フォローボタン（自分以外のユーザーに表示） */}
                  {user && user.id !== followUser.id && (
                    <div>
                      <FollowButton
                        targetUserId={followUser.id}
                        targetUsername={followUser.username}
                        size="small"
                        variant="outline"
                        onFollowChange={(isFollowing) => handleFollowChange(followUser.id, isFollowing)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default FollowList; 