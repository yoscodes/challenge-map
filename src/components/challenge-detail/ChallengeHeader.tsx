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
    <div style={{ borderBottom: '1px solid #eee', paddingBottom: 16, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ marginRight: 16, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, background: '#fff', textDecoration: 'none', color: '#333' }}>
            ← 戻る
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0 }}>{title}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
              style={{ 
                padding: '8px 16px', 
                background: '#007bff', 
                color: 'white', 
                borderRadius: 4, 
                textDecoration: 'none',
                fontSize: 14
              }}
            >
              📝 進捗を投稿
            </Link>
          )}
        </div>
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
};

export default ChallengeHeader; 