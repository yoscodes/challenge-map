"use client";

import React, { useState } from "react";

type DescriptionInputProps = {
  description: string;
  onDescriptionChange: (description: string) => void;
};

const DescriptionInput = ({ description, onDescriptionChange }: DescriptionInputProps) => {
  const [loading, setLoading] = useState(false);

  const handleGPTSuggest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gpt/suggest-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `チャレンジの動機や目標を日本語で200文字以内で魅力的に説明してください。` })
      });
      const data = await res.json();
      if (data.message) {
        onDescriptionChange(data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        ✨ なぜこのチャレンジをするのか？（説明）
      </h2>
      <div style={{ marginBottom: 8 }}>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="「自分への挑戦」「過去の悔しさ」「夢」など動機を書く"
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
          {description.length}/1000文字
        </div>
        <div style={{ fontSize: 14, color: '#666' }}>
          Markdown対応
        </div>
      </div>
      <button
        onClick={handleGPTSuggest}
        disabled={loading}
        style={{
          marginTop: 12,
          padding: '8px 16px',
          background: '#722ed1',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          fontSize: 14,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '生成中...' : '🤖 GPT提案'}
      </button>
      <div style={{ 
        marginTop: 8, 
        padding: '12px', 
        background: '#f6ffed', 
        border: '1px solid #b7eb8f', 
        borderRadius: 6,
        fontSize: 14,
        color: '#52c41a'
      }}>
        💡 ヒント：「なぜ始めたいのか」「どんな変化を期待しているか」「過去の経験」などを書くと、他のユーザーにも共感されやすくなります。
      </div>
    </section>
  );
};

export default DescriptionInput; 