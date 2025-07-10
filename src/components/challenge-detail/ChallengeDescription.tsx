import React from "react";

type ChallengeDescriptionProps = {
  description: string;
};

const ChallengeDescription = ({ description }: ChallengeDescriptionProps) => (
  <section style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>📝 チャレンジの詳細説明（なぜ始めたか）</h2>
    <div style={{ 
      background: '#f8f9fa', 
      padding: 20, 
      borderRadius: 8, 
      border: '1px solid #e9ecef',
      lineHeight: 1.6,
      color: '#333'
    }}>
      {description}
    </div>
  </section>
);

export default ChallengeDescription; 