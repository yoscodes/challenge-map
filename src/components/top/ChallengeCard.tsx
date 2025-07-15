import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getApplauseCount, isApplaudedByUser } from "@/lib/applause";
import { useAuth } from "@/contexts/AuthContext";
import ReportModal from "@/components/common/ReportModal";

// 仮のアバター生成
const getAvatar = (username: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    username
  )}&background=60a5fa&color=fff&rounded=true&size=64`;

type ChallengeCardProps = {
  id: string;
  title: string;
  user: string;
  applause: number;
  progress: string;
  avatarUrl?: string;
};

const ChallengeCard = ({
  id,
  title,
  user,
  applause,
  progress,
  avatarUrl
}: ChallengeCardProps) => {
  const { user: authUser } = useAuth();
  const [applauseCnt, setApplauseCnt] = useState(applause || 0);
  const [applauded, setApplauded] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let ignore = false;
    const fetchApplause = async () => {
      const [{ count }, { applauded }] = await Promise.all([
        getApplauseCount("challenge", id),
        authUser
          ? isApplaudedByUser(authUser.id, "challenge", id)
          : Promise.resolve({ applauded: false }),
      ]);
      if (!ignore) {
        setApplauseCnt(count ?? 0);
        setApplauded(!!applauded);
      }
    };
    fetchApplause();
    return () => {
      ignore = true;
    };
  }, [id, authUser]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Link
      href={`/challenge/${id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        className="challenge-card fade-in"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          cursor: "pointer",
          position: "relative",
          minHeight: 90,
        }}
      >
        {/* アバター（PC時左、スマホ時はuser名右） */}
        {!isMobile && (
          <img
            src={avatarUrl || getAvatar(user)}
            alt="ユーザーアバター"
            className="challenge-avatar"
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              boxShadow: "0 2px 8px rgba(37,99,235,0.10)",
              marginRight: 8,
              flexShrink: 0,
              transition: "all 0.2s",
            }}
          />
        )}
        {/* メイン情報 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              gap: isMobile ? 2 : 10,
              marginBottom: 4,
              minWidth: 0,
            }}
          >
            {isMobile && (
              <span
                className="challenge-new-badge"
                style={{
                  background: isMobile
                    ? "#e0e7ef"
                    : "linear-gradient(90deg,#2563eb,#60a5fa)",
                  color: isMobile ? "#2563eb" : "#fff",
                  borderRadius: isMobile ? 8 : 12,
                  fontSize: isMobile ? 10 : 12,
                  fontWeight: isMobile ? 500 : 600,
                  padding: isMobile ? "1px 3px" : "2px 10px",
                  marginBottom: isMobile ? 2 : 0,
                  marginLeft: isMobile ? 0 : 4,
                  boxShadow: isMobile ? "none" : "0 2px 8px #2563eb22",
                }}
              >
                NEW
              </span>
            )}
            <span
              className="challenge-title"
              style={{
                fontWeight: 700,
                fontSize: 20,
                color: "#222",
                letterSpacing: "0.01em",
                lineHeight: 1.2,
                maxWidth: "60vw",
                minWidth: 0,
                display: "inline-block",
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {title}
            </span>
            {!isMobile && (
              <span
                className="challenge-new-badge"
                style={{
                  background: "linear-gradient(90deg,#2563eb,#60a5fa)",
                  color: "#fff",
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "2px 10px",
                  marginLeft: 4,
                  boxShadow: "0 2px 8px #2563eb22",
                }}
              >
                NEW
              </span>
            )}
          </div>
          <div style={{ color: "#666", fontSize: 15, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 500 }}>by @{user}</span>
            {isMobile && (
              <img
                src={avatarUrl || getAvatar(user)}
                alt="ユーザーアバター"
                className="challenge-avatar-mobile"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  boxShadow: "0 1px 4px #2563eb33",
                  marginLeft: 2,
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}
              />
            )}
          </div>
        </div>
        {/* アクション */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, minWidth: 90 }}>
          <span style={{ fontSize: 15, color: '#888', fontWeight: 600 }}>👏 {applauseCnt}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              setReportOpen(true);
            }}
            style={{
              background:  "rgb(255, 77, 79)",
              color: "#fff",
              border: "none",
              padding: "4px 14px",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: 500,
              boxShadow: "0 2px 8px rgba(239,68,68,0.10)",
            }}
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
      </div>
      <style>{`
        @media (max-width: 600px) {
          .challenge-title {
            font-size: 15px !important;
            max-width: 70vw !important;
          }
          .challenge-card {
            gap: 8px !important;
          }
          .challenge-avatar {
            display: none !important;
          }
          .challenge-avatar-mobile {
            display: inline-block !important;
          }
          .challenge-new-badge {
            font-size: 10px !important;
            padding: 1px 3px !important;
            background: #e0e7ef !important;
            color: #2563eb !important;
            border-radius: 8px !important;
            font-weight: 500 !important;
            box-shadow: none !important;
          }
          .applause-btn, .applause-btn * {
            width: 32px !important;
            height: 32px !important;
            min-width: 32px !important;
            min-height: 32px !important;
            font-size: 15px !important;
          }
          .challenge-card button {
            font-size: 11px !important;
            padding: 2px 8px !important;
            // border-radius: 6px !important;
          }
        }
      `}</style>
    </Link>
  );
};

export default ChallengeCard;
