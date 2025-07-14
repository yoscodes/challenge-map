import React, { useState } from "react";
import ProgressCard from "./ProgressCard";
import { useRouter } from "next/navigation";

type Progress = {
  id: string;
  date: string;
  content: string;
  imageUrl?: string;
  images?: string[];
  applauseCount: number;
  commentCount: number;
  progressType?: string; // 追加
};

type ProgressTimelineProps = {
  progresses: Progress[];
  challengeId: string;
};

const ProgressTimeline = ({ progresses, challengeId }: ProgressTimelineProps) => {
  const [progressList, setProgressList] = useState(progresses);
  const router = useRouter();

  const handleDelete = (id: string) => {
    setProgressList((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <section className="progress-timeline-card">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button
          onClick={() => router.push(`/challenge/${challengeId}/progress/new`)}
          style={{
            background: 'linear-gradient(90deg, #36d1c4, #5b86e5)',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: 16,
            boxShadow: '0 2px 8px rgba(44,62,80,0.08)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          ＋ 進捗を投稿
        </button>
      </div>
      <div className="progress-timeline-list">
        {progressList.length === 0 ? (
          <div className="progress-timeline-empty">まだ進捗がありません</div>
        ) : (
          progressList.map((progress) => (
            <ProgressCard
              key={progress.id}
              id={progress.id}
              date={progress.date}
              content={progress.content}
              imageUrl={progress.imageUrl}
              images={progress.images}
              applauseCount={progress.applauseCount}
              commentCount={progress.commentCount}
              progressType={progress.progressType} // 追加
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default ProgressTimeline; 