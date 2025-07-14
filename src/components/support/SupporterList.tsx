"use client";

import React from "react";
import { getPlaceholderImage, PLACEHOLDER_TYPES } from "@/lib/placeholder-images";

type Supporter = {
  id: string;
  username: string;
  amount: number;
  type: "monthly" | "oneTime";
  comment?: string;
  profileImage?: string;
};

type SupporterListProps = {
  supporters: Supporter[];
};

const SupporterList = ({ supporters }: SupporterListProps) => {
  if (supporters.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 20px', 
        color: '#666',
        background: '#fafafa',
        borderRadius: 12
      }}>
        まだサポーターがいません
      </div>
    );
  }

  return (
    <div>
      {supporters.map((supporter) => (
        <div key={supporter.id} style={{ 
          background: '#fff', 
          borderRadius: 12, 
          padding: 20, 
          marginBottom: 16,
          border: '1px solid #eee',
          display: 'flex',
          gap: 16,
          alignItems: 'center'
        }}>
          {/* プロフィール画像 */}
          <img
            src={supporter.profileImage || getPlaceholderImage(PLACEHOLDER_TYPES.AVATAR_SMALL)}
            alt={`${supporter.username}のプロフィール`}
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0
            }}
            onError={(e) => { e.currentTarget.src = getPlaceholderImage(PLACEHOLDER_TYPES.AVATAR_SMALL); }}
          />
          
          {/* サポーター情報 */}
          <div style={{ flex: 1 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8, 
              marginBottom: 4 
            }}>
              <span style={{ fontSize: 16, fontWeight: 'bold' }}>
                @{supporter.username}
              </span>
              <span style={{ 
                padding: '4px 8px', 
                background: supporter.type === "monthly" ? '#ff6b6b' : '#52c41a', 
                color: '#fff', 
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 'bold'
              }}>
                {supporter.type === "monthly" ? "月額" : "単発"}
              </span>
            </div>
            
            <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff', marginBottom: 4 }}>
              ¥{supporter.amount.toLocaleString()}
              {supporter.type === "monthly" && "/月"}
            </div>
            
            {supporter.comment && (
              <div style={{ 
                fontSize: 14, 
                color: '#666',
                fontStyle: 'italic'
              }}>
                💬 "{supporter.comment}"
              </div>
            )}
          </div>
          
          {/* アクションボタン */}
          <div>
            <button style={{ 
              padding: '8px 16px', 
              background: '#52c41a', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 6,
              fontSize: 14,
              cursor: 'pointer'
            }}>
              お礼を送る
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupporterList; 