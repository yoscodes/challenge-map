import React from "react";
import ChallengeCard from "./ChallengeCard";

const dummyChallenges = [
  {
    title: "世界一周、まずは台湾から",
    user: "@ai_traveler",
    applause: 21,
    progress: "進捗：準備中 → 渡航予定日：8/15",
  },
  {
    title: "筋トレ習慣づけ、3日坊主卒業へ",
    user: "@run_tanaka",
    applause: 12,
    progress: "進捗：1週間継続中",
  },
];

const ChallengeList = () => (
  <section style={{ margin: '32px 0' }}>
    <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 16 }}>🆕 新着チャレンジ</div>
    {dummyChallenges.map((c, i) => (
      <ChallengeCard key={i} {...c} />
    ))}
  </section>
);

export default ChallengeList; 