"use client";

import React from 'react';
import { getPlaceholderImage, PLACEHOLDER_TYPES } from "@/lib/placeholder-images";
import Link from 'next/link';
import FollowButton from '@/components/common/FollowButton';

interface SearchResultsProps {
  results: any;
  searchType: 'all' | 'challenges' | 'users' | 'categories' | 'locations';
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  selectedLocation: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  searchType,
  isLoading,
  error,
  searchQuery,
  selectedCategory,
  selectedLocation
}) => {
  if (isLoading) {
    return (
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        border: '1px solid #eee'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #1890ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        <div style={{ color: '#666', fontSize: '16px' }}>
          検索中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        border: '1px solid #eee'
      }}>
        <div style={{ color: '#ff4d4f', fontSize: '16px', marginBottom: '8px' }}>
          ❌ エラー
        </div>
        <div style={{ color: '#666', fontSize: '14px' }}>
          {error}
        </div>
      </div>
    );
  }

  const hasResults = 
    (results.challenges && results.challenges.length > 0) ||
    (results.users && results.users.length > 0) ||
    (results.categories && results.categories.length > 0) ||
    (results.locations && results.locations.length > 0);

  if (!hasResults && (searchQuery || selectedCategory || selectedLocation)) {
    return (
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        border: '1px solid #eee'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>
          🔍
        </div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
          検索結果が見つかりませんでした
        </div>
        <div style={{ color: '#666', fontSize: '14px' }}>
          検索条件を変更してお試しください
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* チャレンジ結果 */}
      {(searchType === 'all' || searchType === 'challenges') && results.challenges && results.challenges.length > 0 && (
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #eee'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🎯 チャレンジ ({results.challenges.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {results.challenges.map((challenge: any) => (
              <Link
                key={challenge.id}
                href={`/challenge/${challenge.id}`}
                style={{
                  display: 'block',
                  padding: '16px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1890ff';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#f0f0f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: '#f0f8ff',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    🎯
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      margin: '0 0 8px 0',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#333'
                    }}>
                      {challenge.title}
                    </h4>
                    <p style={{
                      margin: '0 0 8px 0',
                      fontSize: '14px',
                      color: '#666',
                      lineHeight: '1.4'
                    }}>
                      {challenge.description.length > 100 
                        ? `${challenge.description.substring(0, 100)}...` 
                        : challenge.description
                      }
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      fontSize: '12px',
                      color: '#999'
                    }}>
                      <span>👤 {challenge.users?.username}</span>
                      <span>📂 {challenge.category}</span>
                      {challenge.location && (
                        <span>📍 {
                          typeof challenge.location === 'string' 
                            ? challenge.location 
                            : challenge.location.address
                        }</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ユーザー結果 */}
      {(searchType === 'all' || searchType === 'users') && results.users && results.users.length > 0 && (
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #eee'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            👥 ユーザー ({results.users.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {results.users.map((user: any) => (
              <div
                key={user.id}
                style={{
                  padding: '16px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center'
                }}
              >
                <img
                  src={user.avatar_url || getPlaceholderImage(PLACEHOLDER_TYPES.AVATAR_SMALL)}
                  alt="アバター"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => { e.currentTarget.src = getPlaceholderImage(PLACEHOLDER_TYPES.AVATAR_SMALL); }}
                />
                <div style={{ flex: 1 }}>
                  <Link
                    href={`/user/${user.username}`}
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#1890ff',
                      textDecoration: 'none'
                    }}
                  >
                    @{user.username}
                  </Link>
                  {user.bio && (
                    <p style={{
                      margin: '4px 0 0 0',
                      fontSize: '14px',
                      color: '#666',
                      lineHeight: '1.4'
                    }}>
                      {user.bio.length > 80 
                        ? `${user.bio.substring(0, 80)}...` 
                        : user.bio
                      }
                    </p>
                  )}
                </div>
                <FollowButton
                  targetUserId={user.id}
                  targetUsername={user.username}
                  size="small"
                  variant="outline"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* カテゴリ結果 */}
      {searchType === 'categories' && results.categories && results.categories.length > 0 && (
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #eee'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📂 カテゴリ ({results.categories.length})
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            {results.categories.map((category: any) => (
              <Link
                key={category.name}
                href={`/search?type=challenges&category=${encodeURIComponent(category.name)}`}
                style={{
                  display: 'block',
                  padding: '16px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'inherit',
                  textAlign: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1890ff';
                  e.currentTarget.style.background = '#f0f8ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#f0f0f0';
                  e.currentTarget.style.background = '#fff';
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                  📂
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '4px'
                }}>
                  {category.name}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {category.count}件のチャレンジ
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 地域結果 */}
      {searchType === 'locations' && results.locations && results.locations.length > 0 && (
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #eee'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📍 地域 ({results.locations.length})
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '16px' 
          }}>
            {results.locations.map((location: any, index: number) => (
              <Link
                key={index}
                href={`/search?type=challenges&location=${encodeURIComponent(location.address)}`}
                style={{
                  display: 'block',
                  padding: '16px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1890ff';
                  e.currentTarget.style.background = '#f0f8ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#f0f0f0';
                  e.currentTarget.style.background = '#fff';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>📍</span>
                  <span style={{
                    fontSize: '14px',
                    color: '#333'
                  }}>
                    {location.address}
                  </span>
                </div>
              </Link>
            ))}
          </div>
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

export default SearchResults; 