"use client";

import React from "react";

type UserChallengeCardProps = {
  id: string;
  title: string;
  status: "active" | "completed";
  progressDay?: number;
  applauseCount: number;
  supporterCount?: number;
  completionDate?: string;
  coverImage?: string;
};

const UserChallengeCard = ({ 
  id, 
  title, 
  status, 
  progressDay, 
  applauseCount, 
  supporterCount, 
  completionDate,
  coverImage 
}: UserChallengeCardProps) => (
  <div style={{ 
    background: '#fff', 
    borderRadius: 12, 
    padding: 20, 
    marginBottom: 16,
    border: '1px solid #eee',
    display: 'flex',
    gap: 16,
    alignItems: 'center'
  }}>
    {/* カバー画像 */}
    {coverImage && (
      <img
        src={coverImage}
        alt="チャレンジ画像"
        style={{
          width: 80,
          height: 80,
          borderRadius: 8,
          objectFit: 'cover',
          flexShrink: 0
        }}
      />
    )}
    
    {/* チャレンジ情報 */}
    <div style={{ flex: 1 }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8, 
        marginBottom: 8 
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 'bold', margin: 0 }}>
          ■ {title}
        </h3>
        {status === "completed" && (
          <span style={{ 
            padding: '4px 8px', 
            background: '#52c41a', 
            color: '#fff', 
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 'bold'
          }}>
            完了
          </span>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: 16, fontSize: 14, color: '#666' }}>
        {status === "active" && progressDay && (
          <span>進捗：Day {progressDay}</span>
        )}
        <span>👏 拍手：{applauseCount}</span>
        {supporterCount && <span>💖 支援者：{supporterCount}人</span>}
        {status === "completed" && completionDate && (
          <span>終了日：{completionDate}</span>
        )}
      </div>
    </div>
    
    {/* アクションボタン */}
    <div>
      <button style={{ 
        padding: '8px 16px', 
        background: '#1890ff', 
        color: '#fff', 
        border: 'none', 
        borderRadius: 6,
        fontSize: 14,
        cursor: 'pointer'
      }}>
        {status === "active" ? "詳細を見る" : "完了レポート"}
      </button>
    </div>
  </div>
);

export default UserChallengeCard; 