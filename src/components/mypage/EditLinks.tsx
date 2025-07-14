"use client";

import React from "react";

const EditLinks = () => (
  <section style={{ 
    background: '#fff', 
    borderRadius: 12, 
    padding: 20, 
    marginTop: 32,
    border: '1px solid #eee'
  }}>
    <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: "#222" }}>
      🛠 設定・編集リンク
    </h3>
    
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <button style={{ 
        padding: '12px 20px', 
        background: '#1890ff', 
        color: '#fff', 
        border: 'none', 
        borderRadius: 8,
        fontSize: 14,
        cursor: 'pointer'
      }}>
        👤 プロフィール編集
      </button>
      
      <button style={{ 
        padding: '12px 20px', 
        background: '#52c41a', 
        color: '#fff', 
        border: 'none', 
        borderRadius: 8,
        fontSize: 14,
        cursor: 'pointer'
      }}>
        📝 チャレンジ編集
      </button>
      
      <button style={{ 
        padding: '12px 20px', 
        background: '#722ed1', 
        color: '#fff', 
        border: 'none', 
        borderRadius: 8,
        fontSize: 14,
        cursor: 'pointer'
      }}>
        💳 Stripe支払い管理へ
      </button>
      
      <button style={{ 
        padding: '12px 20px', 
        background: '#fa8c16', 
        color: '#fff', 
        border: 'none', 
        borderRadius: 8,
        fontSize: 14,
        cursor: 'pointer'
      }}>
        📊 統計・分析
      </button>
    </div>
  </section>
);

export default EditLinks; 