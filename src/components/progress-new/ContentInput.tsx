"use client";

import React from "react";

type ContentInputProps = {
  content: string;
  onContentChange: (content: string) => void;
};

const ContentInput = ({ content, onContentChange }: ContentInputProps) => (
  <section style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
      ✏️ 進捗内容（テキストエリア）
    </h2>
    <div style={{ marginBottom: 8 }}>
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="今ここにいます！〇〇まで到着。現地の景色が最高です！"
        style={{
          width: '100%',
          minHeight: 120,
          padding: '12px 16px',
          border: '1px solid #ddd',
          borderRadius: 8,
          fontSize: 16,
          lineHeight: 1.5,
          resize: 'vertical',
          boxSizing: 'border-box'
        }}
      />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: 14, color: '#666' }}>
        {content.length}/500文字
      </div>
    </div>
    
    <div style={{ 
      marginTop: 12, 
      padding: '12px', 
      background: '#f6ffed', 
      border: '1px solid #b7eb8f', 
      borderRadius: 6,
      fontSize: 14,
      color: '#52c41a'
    }}>
      💡 例文：「出発直後の気持ち」「ちょっとした変化」「今日できたこと」「次のステップ」
    </div>
  </section>
);

export default ContentInput; 