import React, { useEffect, useState } from "react";
import Link from "next/link";
import ApplauseButton from "@/components/common/ApplauseButton";
import { getApplauseCount, isApplaudedByUser } from "@/lib/applause";
import { useAuth } from "@/contexts/AuthContext";

type ChallengeHeaderProps = {
  title: string;
  author: string;
  category: string;
  startDate: string;
  targetDate: string;
  location: string;
  challengeId?: string;
};

const ChallengeHeader = ({ title, author, category, startDate, targetDate, location, challengeId }: ChallengeHeaderProps) => {
  const { user } = useAuth();
  const [applauseCnt, setApplauseCnt] = useState(0);
  const [applauded, setApplauded] = useState(false);

  useEffect(() => {
    let ignore = false;
    if (!challengeId) return;
    const fetchApplause = async () => {
      const [{ count }, { applauded }] = await Promise.all([
        getApplauseCount('challenge', challengeId),
        user ? isApplaudedByUser(user.id, 'challenge', challengeId) : Promise.resolve({ applauded: false })
      ]);
      if (!ignore) {
        setApplauseCnt(count ?? 0);
        setApplauded(!!applauded);
      }
    };
    fetchApplause();
    return () => { ignore = true; };
  }, [challengeId, user]);

  return (
    <div className="challenge-header-card">
      <div className="challenge-header-top">
        <h1 className="challenge-header-title">{title}</h1>
        <div className="challenge-header-actions">
          {challengeId && (
            <ApplauseButton
              targetType="challenge"
              targetId={challengeId}
              initialCount={applauseCnt}
              initialApplauded={applauded}
              onChange={(a, c) => { setApplauded(a); setApplauseCnt(c); }}
            />
          )}
          {challengeId && (
            <Link 
              href={`/challenge/${challengeId}/progress/new`}
              className="challenge-header-progress-btn"
            >
              <span role="img" aria-label="進捗">📝</span> 進捗を投稿
            </Link>
          )}
        </div>
      </div>
      <div className="challenge-header-info">
        <div className="challenge-header-badges">
          <span className="challenge-header-badge"><span role="img" aria-label="投稿者">👤</span> {author}</span>
          <span className="challenge-header-badge"><span role="img" aria-label="カテゴリ">🌐</span> {category}</span>
        </div>
        <div className="challenge-header-badges">
          <span className="challenge-header-badge"><span role="img" aria-label="開始">🗓</span> 開始：{startDate}</span>
          <span className="challenge-header-badge">目標日：{targetDate}</span>
        </div>
        <div className="challenge-header-badges">
          <span className="challenge-header-badge"><span role="img" aria-label="場所">📍</span> {location}</span>
        </div>
      </div>
    </div>
  );
};

export default ChallengeHeader; 