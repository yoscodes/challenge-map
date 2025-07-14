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
  <section className="card fade-in" style={{ 
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
    borderRadius: 18, 
    padding: 28, 
    marginBottom: 28,
    boxShadow: '0 4px 24px rgba(37,99,235,0.08)',
    border: 'none',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 18
  }}>
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ fontSize: 28, fontWeight: 'bold', color: '#ff6b6b', marginBottom: 4, textShadow: '0 2px 8px #ff6b6b22' }}>
        💖 {supporterCount}人
      </div>
      <div style={{ fontSize: 15, color: '#b91c1c', fontWeight: 600 }}>サポーター</div>
    </div>
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ fontSize: 28, fontWeight: 'bold', color: '#52c41a', marginBottom: 4, textShadow: '0 2px 8px #52c41a22' }}>
        👏 {applauseCount}回
      </div>
      <div style={{ fontSize: 15, color: '#15803d', fontWeight: 600 }}>拍手数</div>
    </div>
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ fontSize: 28, fontWeight: 'bold', color: '#1890ff', marginBottom: 4, textShadow: '0 2px 8px #2563eb22' }}>
        ✨ {continuousDays}日
      </div>
      <div style={{ fontSize: 15, color: '#2563eb', fontWeight: 600 }}>継続日数</div>
    </div>
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ fontSize: 28, fontWeight: 'bold', color: '#722ed1', marginBottom: 4, textShadow: '0 2px 8px #722ed122' }}>
        🏁 {completedChallenges}件
      </div>
      <div style={{ fontSize: 15, color: '#722ed1', fontWeight: 600 }}>完了チャレンジ</div>
    </div>
    {continuousDays >= 7 && (
      <div style={{ 
        position: 'absolute',
        top: 18,
        right: 28,
        padding: '8px 18px',
        background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
        borderRadius: 20,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        color: '#8b6914',
        boxShadow: '0 2px 8px #ffd70033'
      }}>
        🔥 継続{continuousDays}日達成！
      </div>
    )}
  </section>
);

export default UserStats; 