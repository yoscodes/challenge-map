"use client";

import React from "react";

type SupportPageHeaderProps = {
  username: string;
};

const SupportPageHeader = ({ username }: SupportPageHeaderProps) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    marginBottom: 32,
    borderBottom: '1px solid #eee',
    paddingBottom: 16
  }}>
    <button style={{ 
      marginRight: 16, 
      padding: '8px 12px', 
      border: '1px solid #ddd', 
      borderRadius: 4, 
      background: '#fff',
      cursor: 'pointer'
    }}>
      ← 戻る
    </button>
    <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0 }}>
      {username} さんを応援する
    </h1>
  </div>
);

export default SupportPageHeader; 