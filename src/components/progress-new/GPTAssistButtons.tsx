"use client";

import React from "react";

type GPTAssistButtonsProps = {
  onSNSFormat: () => void;
  onPositiveRewrite: () => void;
};

const GPTAssistButtons = ({ onSNSFormat, onPositiveRewrite }: GPTAssistButtonsProps) => (
  <section style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
      🤖 AI補助ツール（任意）
    </h2>
    
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <button
        onClick={onSNSFormat}
        style={{
          padding: '12px 20px',
          background: '#52c41a',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        📱 GPTでSNS投稿風に整える
      </button>
      
      <button
        onClick={onPositiveRewrite}
        style={{
          padding: '12px 20px',
          background: '#722ed1',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        ✨ GPTにポジティブに書き直させる
      </button>
    </div>
    
    <div style={{ 
      marginTop: 12, 
      padding: '12px', 
      background: '#fff7e6', 
      border: '1px solid #ffd591', 
      borderRadius: 6,
      fontSize: 14,
      color: '#d46b08'
    }}>
      💡 AIが文章を読みやすく、魅力的に整形してくれます。投稿前に試してみてください！
    </div>
  </section>
);

export default GPTAssistButtons; 