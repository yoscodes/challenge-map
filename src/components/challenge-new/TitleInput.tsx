"use client";

import React from "react";

type TitleInputProps = {
  title: string;
  onTitleChange: (title: string) => void;
  onGPTSuggest: () => void;
};

const TitleInput = ({ title, onTitleChange, onGPTSuggest }: TitleInputProps) => (
  <section className="title-section">
    <h2 className="title-title">
      <span className="title-badge">📝 チャレンジタイトル（必須）</span>
    </h2>
    <div className="title-field-wrap">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="例：「世界一周して自分の価値観を広げたい」"
        className="title-field"
        maxLength={100}
      />
    </div>
    <div className="title-bottom">
      <div className="title-length">
        {title.length}/100文字
      </div>
      <button
        onClick={onGPTSuggest}
        className="title-gpt-btn"
        type="button"
      >
        🧠 GPTでタイトル提案
      </button>
    </div>
    {title.length === 0 && (
      <div className="title-error">
        タイトルを入力してください
      </div>
    )}
  </section>
);

export default TitleInput; 