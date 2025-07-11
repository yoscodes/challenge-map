"use client";

import React from "react";

type SupportButtonProps = {
  onSupport: () => void;
  isSupported: boolean;
};

const SupportButton = ({ onSupport, isSupported }: SupportButtonProps) => (
  <section style={{ 
    background: '#fff', 
    borderRadius: 12, 
    padding: 20, 
    marginBottom: 24,
    border: '1px solid #eee',
    textAlign: 'center'
  }}>
    <button
      onClick={onSupport}
      style={{
        fontSize: 18,
        padding: '16px 32px',
        background: isSupported ? '#52c41a' : 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
        color: '#fff',
        border: 'none',
        borderRadius: 32,
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(255,107,107,0.3)',
        transition: 'all 0.3s ease',
        minWidth: 250
      }}
    >
      {isSupported ? '✅ 応援中' : '💖 この人を応援する'}
    </button>
    
    <div style={{ 
      marginTop: 12, 
      fontSize: 14, 
      color: '#666' 
    }}>
      {isSupported 
        ? 'このユーザーを応援しています' 
        : '月額500円〜でこの人の挑戦を応援できます'
      }
    </div>
  </section>
);

export default SupportButton; 