"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface FollowButtonProps {
  targetUserId: string;
  targetUsername: string;
  initialIsFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline';
}

const FollowButton: React.FC<FollowButtonProps> = ({
  targetUserId,
  targetUsername,
  initialIsFollowing = false,
  onFollowChange,
  size = 'medium',
  variant = 'primary'
}) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 認証チェック
  if (!user) {
    return (
      <button
        disabled
        style={{
          padding: size === 'small' ? '6px 12px' : size === 'large' ? '12px 24px' : '8px 16px',
          fontSize: size === 'small' ? '12px' : size === 'large' ? '16px' : '14px',
          background: '#f5f5f5',
          color: '#999',
          border: '1px solid #ddd',
          borderRadius: '6px',
          cursor: 'not-allowed'
        }}
      >
        ログインが必要です
      </button>
    );
  }

  // 自分自身をフォローできないようにチェック
  if (user.id === targetUserId) {
    return null;
  }

  // フォロー状態の初期確認
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await fetch(
          `/api/follow?followerId=${user.id}&followingId=${targetUserId}`
        );
        if (response.ok) {
          const { isFollowing: status } = await response.json();
          setIsFollowing(status);
        }
      } catch (error) {
        console.error('フォロー状態確認エラー:', error);
      }
    };

    checkFollowStatus();
  }, [user.id, targetUserId]);

  const handleFollowToggle = async () => {
    if (!user || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      const response = await fetch('/api/follow', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followerId: user.id,
          followingId: targetUserId,
        }),
      });

      if (response.ok) {
        const newIsFollowing = !isFollowing;
        setIsFollowing(newIsFollowing);
        onFollowChange?.(newIsFollowing);
      } else {
        const { error: errorMessage } = await response.json();
        setError(errorMessage || '操作に失敗しました');
      }
    } catch (error) {
      console.error('フォロー操作エラー:', error);
      setError('ネットワークエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonStyles = () => {
    const baseStyles = {
      padding: size === 'small' ? '6px 12px' : size === 'large' ? '12px 24px' : '8px 16px',
      fontSize: size === 'small' ? '12px' : size === 'large' ? '16px' : '14px',
      border: 'none',
      borderRadius: '6px',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      fontWeight: 'bold',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      minWidth: size === 'small' ? '80px' : size === 'large' ? '120px' : '100px',
      justifyContent: 'center'
    };

    if (variant === 'outline') {
      return {
        ...baseStyles,
        background: 'transparent',
        color: isFollowing ? '#666' : '#1890ff',
        border: `1px solid ${isFollowing ? '#ddd' : '#1890ff'}`,
        ':hover': {
          background: isFollowing ? '#f5f5f5' : '#f0f8ff',
        }
      };
    }

    if (variant === 'secondary') {
      return {
        ...baseStyles,
        background: isFollowing ? '#f5f5f5' : '#52c41a',
        color: isFollowing ? '#666' : '#fff',
        ':hover': {
          background: isFollowing ? '#e8e8e8' : '#389e0d',
        }
      };
    }

    // primary (default)
    return {
      ...baseStyles,
      background: isFollowing ? '#f5f5f5' : '#1890ff',
      color: isFollowing ? '#666' : '#fff',
      ':hover': {
        background: isFollowing ? '#e8e8e8' : '#096dd9',
      }
    };
  };

  const buttonStyles = getButtonStyles();

  return (
    <div>
      <button
        onClick={handleFollowToggle}
        disabled={isLoading}
        style={buttonStyles}
      >
        {isLoading ? (
          <>
            <div style={{
              width: '12px',
              height: '12px',
              border: '2px solid transparent',
              borderTop: `2px solid ${isFollowing ? '#666' : '#fff'}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            {isFollowing ? '解除中...' : 'フォロー中...'}
          </>
        ) : (
          <>
            {isFollowing ? '✓ フォロー中' : '+ フォロー'}
          </>
        )}
      </button>
      
      {error && (
        <div style={{
          color: '#ff4d4f',
          fontSize: '12px',
          marginTop: '4px'
        }}>
          {error}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FollowButton; 