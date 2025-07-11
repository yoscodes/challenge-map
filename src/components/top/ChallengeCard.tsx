import React, { useEffect, useState } from "react";
import ApplauseButton from "@/components/common/ApplauseButton";
import { getApplauseCount, isApplaudedByUser } from "@/lib/applause";
import { useAuth } from "@/contexts/AuthContext";
import ReportModal from '@/components/common/ReportModal';

type ChallengeCardProps = {
  id: string;
  title: string;
  user: string;
  applause: number;
  progress: string;
};


const ChallengeCard = ({ id, title, user, applause, progress }: ChallengeCardProps) => {
  const { user: authUser } = useAuth();
  const [applauseCnt, setApplauseCnt] = useState(applause || 0);
  const [applauded, setApplauded] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    let ignore = false;
    const fetchApplause = async () => {
      const [{ count }, { applauded }] = await Promise.all([
        getApplauseCount('challenge', id),
        authUser ? isApplaudedByUser(authUser.id, 'challenge', id) : Promise.resolve({ applauded: false })
      ]);
      if (!ignore) {
        setApplauseCnt(count ?? 0);
        setApplauded(!!applauded);
      }
    };
    fetchApplause();
    return () => { ignore = true; };
  }, [id, authUser]);

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 12, background: '#fff' }}>
      <div style={{ fontWeight: 'bold', fontSize: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
        ■ {title}
        <span style={{ color: '#888', fontSize: 14 }}>by {user}</span>
        <ApplauseButton
          targetType="challenge"
          targetId={id}
          initialCount={applauseCnt}
          initialApplauded={applauded}
          onChange={(a, c) => { setApplauded(a); setApplauseCnt(c); }}
        />
        <button
          onClick={() => setReportOpen(true)}
          style={{ marginLeft: 'auto', background: '#ff7875', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 13, cursor: 'pointer' }}
        >
          通報
        </button>
        <ReportModal
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          targetType="challenge"
          targetId={id}
        />
      </div>
      <div style={{ marginTop: 8, color: '#555' }}>{progress}</div>
    </div>
  );
};

export default ChallengeCard; 