"use client";

import React from "react";

type TitleInputProps = {
  title: string;
  onTitleChange: (title: string) => void;
  onGPTSuggest: () => void;
};

const TitleInput = ({ title, onTitleChange, onGPTSuggest }: TitleInputProps) => (
  <section style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
      📝 チャレンジタイトル（必須）
    </h2>
    <div style={{ marginBottom: 8 }}>
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="例：「世界一周して自分の価値観を広げたい」"
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid #ddd',
          borderRadius: 8,
          fontSize: 16,
          boxSizing: 'border-box'
        }}
      />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: 14, color: '#666' }}>
        {title.length}/100文字
      </div>
      <button
        onClick={onGPTSuggest}
        style={{
          padding: '8px 16px',
          background: '#52c41a',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          fontSize: 14,
          cursor: 'pointer'
        }}
      >
        🧠 GPTでタイトル提案
      </button>
    </div>
    {title.length === 0 && (
      <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 8 }}>
        タイトルを入力してください
      </div>
    )}
  </section>
);

export default TitleInput; 