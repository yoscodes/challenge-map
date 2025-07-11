"use client";

import React, { useState } from "react";
import FollowList from "./FollowList";

type UserStatsProps = {
  supporterCount: number;
  totalApplauseCount: number;
  completedChallenges: number;
  activeChallenges: number;
  continuousDays?: number;
  followerCount?: number;
  followingCount?: number;
  userId?: string;
};

const UserStats = ({ 
  supporterCount, 
  totalApplauseCount, 
  completedChallenges, 
  activeChallenges,
  continuousDays,
  followerCount = 0,
  followingCount = 0,
  userId
}: UserStatsProps) => {
  const [showFollowList, setShowFollowList] = useState(false);
  const [followListType, setFollowListType] = useState<'followers' | 'following'>('followers');

  const handleFollowClick = (type: 'followers' | 'following') => {
    setFollowListType(type);
    setShowFollowList(true);
  };

  return (
    <>
      <section style={{ 
        background: '#fff', 
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 24,
        border: '1px solid #eee'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff6b6b' }}>
              💖 {supporterCount}人
            </div>
            <div style={{ fontSize: 14, color: '#666' }}>サポーター</div>
          </div>
          
          <div>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
              👏 {totalApplauseCount}回
            </div>
            <div style={{ fontSize: 14, color: '#666' }}>総拍手数</div>
          </div>
          
          <div>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
              🏁 {completedChallenges}件
            </div>
            <div style={{ fontSize: 14, color: '#666' }}>完了チャレンジ</div>
          </div>
          
          <div>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
              🔥 {activeChallenges}件
            </div>
            <div style={{ fontSize: 14, color: '#666' }}>継続中</div>
          </div>
        </div>
        
        {continuousDays && continuousDays >= 7 && (
          <div style={{ 
            marginTop: 16, 
            padding: '8px 16px', 
            background: 'linear-gradient(135deg, #ffd700, #ffed4e)', 
            borderRadius: 20,
            textAlign: 'center',
            fontSize: 14,
            fontWeight: 'bold',
            color: '#8b6914'
          }}>
            🎖 継続{continuousDays}日達成！
          </div>
        )}

        {/* フォロー統計 */}
        {(followerCount > 0 || followingCount > 0) && (
          <div style={{ 
            marginTop: 16, 
            padding: '16px', 
            background: '#f8f9fa', 
            borderRadius: 8,
            border: '1px solid #e9ecef'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-around', 
              textAlign: 'center' 
            }}>
              <button
                onClick={() => handleFollowClick('followers')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
                  👥 {followerCount}人
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>フォロワー</div>
              </button>
              
              <button
                onClick={() => handleFollowClick('following')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#52c41a' }}>
                  🔍 {followingCount}人
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>フォロー中</div>
              </button>
            </div>
          </div>
        )}
      </section>

      {showFollowList && userId && (
        <FollowList
          userId={userId}
          type={followListType}
          onClose={() => setShowFollowList(false)}
        />
      )}
    </>
  );
};

export default UserStats; 