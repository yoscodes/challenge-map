import React from "react";

type ChallengeCardProps = {
  title: string;
  user: string;
  applause: number;
  progress: string;
};

const ChallengeCard = ({ title, user, applause, progress }: ChallengeCardProps) => (
  <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 12, background: '#fff' }}>
    <div style={{ fontWeight: 'bold', fontSize: 18 }}>■ {title} <span style={{ color: '#888', fontSize: 14 }}>by {user}（👏{applause}）</span></div>
    <div style={{ marginTop: 8, color: '#555' }}>{progress}</div>
  </div>
);

export default ChallengeCard; 