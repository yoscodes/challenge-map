"use client";

import React from "react";

type UserStatsProps = {
  supporterCount: number;
  applauseCount: number;
  continuousDays: number;
  completedChallenges: number;
};

const UserStats = ({ 
  supporterCount, 
  applauseCount, 
  continuousDays, 
  completedChallenges 
}: UserStatsProps) => (
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
          👏 {applauseCount}回
        </div>
        <div style={{ fontSize: 14, color: '#666' }}>拍手数</div>
      </div>
      
      <div>
        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
          ✨ {continuousDays}日
        </div>
        <div style={{ fontSize: 14, color: '#666' }}>継続日数</div>
      </div>
      
      <div>
        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
          🏁 {completedChallenges}件
        </div>
        <div style={{ fontSize: 14, color: '#666' }}>完了チャレンジ</div>
      </div>
    </div>
    
    {continuousDays >= 7 && (
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
        🔥 継続{continuousDays}日達成！
      </div>
    )}
  </section>
);

export default UserStats; 