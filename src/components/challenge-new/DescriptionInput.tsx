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
    <section className="desc-section">
      <h2 className="desc-title">
        <span className="desc-badge">✨ なぜこのチャレンジをするのか？（説明）</span>
      </h2>
      <div className="desc-field-wrap">
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="「自分への挑戦」「過去の悔しさ」「夢」など動機を書く"
          className="desc-field"
          maxLength={1000}
        />
      </div>
      <div className="desc-bottom">
        <div className="desc-length">
          {description.length}/1000文字
        </div>
        <div className="desc-markdown">Markdown対応</div>
      </div>
      <button
        onClick={handleGPTSuggest}
        disabled={loading}
        className="desc-gpt-btn"
        type="button"
      >
        {loading ? '生成中...' : '🤖 GPT提案'}
      </button>
      <div className="desc-hint">
        💡 ヒント：「なぜ始めたいのか」「どんな変化を期待しているか」「過去の経験」などを書くと、他のユーザーにも共感されやすくなります。
      </div>
    </section>
  );
};

export default DescriptionInput; 