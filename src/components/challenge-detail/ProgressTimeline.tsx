import React from "react";
import ProgressCard from "./ProgressCard";

type Progress = {
  id: string;
  date: string;
  content: string;
  imageUrl?: string;
  applauseCount: number;
  commentCount: number;
};

type ProgressTimelineProps = {
  progresses: Progress[];
};

const ProgressTimeline = ({ progresses }: ProgressTimelineProps) => (
  <section style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>🧭 進捗タイムライン（降順）</h2>
    <div>
      {progresses.map((progress) => (
        <ProgressCard
          key={progress.id}
          date={progress.date}
          content={progress.content}
          imageUrl={progress.imageUrl}
          applauseCount={progress.applauseCount}
          commentCount={progress.commentCount}
        />
      ))}
    </div>
  </section>
);

export default ProgressTimeline; 