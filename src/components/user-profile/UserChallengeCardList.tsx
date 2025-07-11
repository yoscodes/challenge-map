"use client";

import React from "react";
import UserChallengeCard from "./UserChallengeCard";

type Challenge = {
  id: string;
  title: string;
  status: "active" | "completed";
  progressDay?: number;
  applauseCount: number;
  supporterCount?: number;
  completionDate?: string;
  coverImage?: string;
};

type UserChallengeCardListProps = {
  challenges: Challenge[];
  type: "active" | "completed";
};

const UserChallengeCardList = ({ challenges, type }: UserChallengeCardListProps) => {
  const filteredChallenges = challenges.filter(challenge => challenge.status === type);
  
  if (filteredChallenges.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 20px', 
        color: '#666',
        background: '#fafafa',
        borderRadius: 12
      }}>
        {type === "active" ? "挑戦中のチャレンジはありません" : "完了したチャレンジはありません"}
      </div>
    );
  }

  return (
    <div>
      {filteredChallenges.map((challenge) => (
        <UserChallengeCard
          key={challenge.id}
          {...challenge}
        />
      ))}
    </div>
  );
};

export default UserChallengeCardList; 