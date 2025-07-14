"use client";

import React from "react";
import ChallengeCard from "./ChallengeCard";

type Challenge = {
  id: string;
  title: string;
  status: "active" | "completed";
  progressDay?: number;
  applauseCount: number;
  supporterCount?: number;
  completionComment?: string;
  coverImage?: string;
};

type ChallengeCardListProps = {
  challenges: Challenge[];
  type: "active" | "completed";
};

const ChallengeCardList = ({ challenges, type }: ChallengeCardListProps) => {
  const filteredChallenges = challenges.filter(challenge => challenge.status === type);
  
  if (filteredChallenges.length === 0) {
    return (
      <div className="card fade-in" style={{ 
        textAlign: 'center', 
        padding: '40px 20px', 
        color: '#666',
        background: '#f8fafc',
        borderRadius: 16,
        boxShadow: '0 2px 12px #2563eb11',
        marginBottom: 24
      }}>
        {type === "active" ? "挑戦中のチャレンジはありません" : "完了したチャレンジはありません"}
      </div>
    );
  }

  return (
    <div className="card fade-in" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #2563eb11', padding: '24px 18px', marginBottom: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {filteredChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            {...challenge}
          />
        ))}
      </div>
    </div>
  );
};

export default ChallengeCardList; 