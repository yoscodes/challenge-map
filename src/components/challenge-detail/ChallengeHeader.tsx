import React from "react";

type ChallengeHeaderProps = {
  title: string;
  author: string;
  category: string;
  startDate: string;
  targetDate: string;
  location: string;
};

const ChallengeHeader = ({ title, author, category, startDate, targetDate, location }: ChallengeHeaderProps) => (
  <div style={{ borderBottom: '1px solid #eee', paddingBottom: 16, marginBottom: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
      <button style={{ marginRight: 16, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, background: '#fff' }}>
        ← 戻る
      </button>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0 }}>{title}</h1>
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: '#666' }}>
      <div>
        👤 投稿者：{author}　🌐 カテゴリ：{category}
      </div>
      <div>
        🗓 開始：{startDate}　目標日：{targetDate}
      </div>
      <div>
        📍 実施場所：{location}
      </div>
    </div>
  </div>
);

export default ChallengeHeader; 