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
      <div className="card fade-in" style={{ 
        textAlign: 'center', 
        padding: '40px 20px', 
        color: '#666',
        background: '#f8fafc',
        borderRadius: 16,
        boxShadow: '0 2px 12px #2563eb11',
        marginBottom: 24
      }}>
        まだサポーターがいません
      </div>
    );
  }

  return (
    <div className="card fade-in" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #2563eb11', padding: '24px 18px', marginBottom: 24 }}>
      {supporters.map((supporter) => (
        <div key={supporter.id} style={{ 
          background: 'linear-gradient(90deg,#f8fafc,#e0e7ef)', 
          borderRadius: 12, 
          padding: 18, 
          marginBottom: 16,
          boxShadow: '0 2px 8px #2563eb11',
          display: 'flex',
          gap: 18,
          alignItems: 'center',
          transition: 'box-shadow 0.2s',
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
              flexShrink: 0,
              boxShadow: '0 2px 8px #2563eb22'
            }}
            onError={(e) => { e.currentTarget.src = getPlaceholderImage(PLACEHOLDER_TYPES.AVATAR_SMALL); }}
          />
          {/* サポーター情報 */}
          <div style={{ flex: 1 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 10, 
              marginBottom: 4 
            }}>
              <span style={{ fontSize: 17, fontWeight: 'bold', color: '#2563eb' }}>
                @{supporter.username}
              </span>
              <span style={{ 
                padding: '4px 12px', 
                background: supporter.type === "monthly" ? 'linear-gradient(90deg,#ff6b6b,#fbbf24)' : 'linear-gradient(90deg,#52c41a,#a7f3d0)', 
                color: '#fff', 
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 'bold',
                boxShadow: '0 1px 4px #2563eb11'
              }}>
                {supporter.type === "monthly" ? "月額" : "単発"}
              </span>
            </div>
            <div style={{ fontSize: 17, fontWeight: 'bold', color: '#222', marginBottom: 4 }}>
              ¥{supporter.amount.toLocaleString()}
              {supporter.type === "monthly" && "/月"}
            </div>
            {supporter.comment && (
              <div style={{ fontSize: 14, color: '#2563eb', fontStyle: 'italic' }}>
                💬 "{supporter.comment}"
              </div>
            )}
          </div>
          {/* アクションボタン */}
          <div>
            <button style={{ 
              padding: '10px 22px', 
              background: 'linear-gradient(90deg,#2563eb,#60a5fa)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #2563eb22',
              transition: 'all 0.2s'
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