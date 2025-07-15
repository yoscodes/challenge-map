import React, { useEffect, useState } from "react";
import {
  getPlaceholderImage,
  PLACEHOLDER_TYPES,
} from "@/lib/placeholder-images";
import ChallengeDescription from "./ChallengeDescription";
import ProgressTimeline from "./ProgressTimeline";
import CommentSection from "./CommentSection";
import GPTSupportTools from "./GPTSupportTools";
import SupportButton from "./SupportButton";
import ApplauseButton from "@/components/common/ApplauseButton";
import { getApplauseCount, isApplaudedByUser } from "@/lib/applause";
import Link from "next/link";

interface ChallengeData {
  title: string;
  author: string;
  category: string;
  startDate: string;
  targetDate: string;
  location: string;
  description: string;
  coverImageUrl?: string; // 追加
  challengeId?: string;
  status?: string; // 追加
}

interface ProgressData {
  id: string;
  date: string;
  content: string;
  imageUrl?: string;
  applauseCount: number;
  commentCount: number;
}

interface CommentData {
  id: string;
  author: string;
  content: string;
  date: string;
  isAnonymous?: boolean;
  canDelete?: boolean;
}

interface ChallengeDetailLayoutProps {
  challenge: ChallengeData;
  progresses: ProgressData[];
  comments: CommentData[];
  onCommentAdded?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
  isOwner?: boolean;
  onComplete?: () => void;
}

// ダミーデータ
const dummyChallengeData = {
  title: "世界一周、まずは台湾から",
  author: "@ai_traveler",
  category: "旅 ✈️",
  startDate: "2025/07/01",
  targetDate: "2025/09/01",
  location: "東京 → 世界各地",
  description:
    "長年夢だった世界一周旅行を実現するため、まずは台湾から始めます。語学力向上と異文化体験を通じて、自分自身の視野を広げたいと思います。不安もありますが、多くの方の応援を力に変えて頑張ります！",
};

const dummyProgresses = [
  {
    id: "1",
    date: "2025/07/09",
    content: "羽田から出発！不安もあるけどワクワク！",
    imageUrl: getPlaceholderImage(PLACEHOLDER_TYPES.CHALLENGE),
    applauseCount: 6,
    commentCount: 3,
  },
  {
    id: "2",
    date: "2025/07/05",
    content: "パッキング完了！ミニマリスト生活開始！",
    applauseCount: 4,
    commentCount: 2,
  },
  {
    id: "3",
    date: "2025/07/02",
    content: "航空券ゲットしました。まずは台湾！",
    applauseCount: 8,
    commentCount: 5,
  },
];

const dummyComments = [
  {
    id: "1",
    author: "@travel_lover",
    content:
      "素晴らしい挑戦ですね！台湾は本当に素敵な場所です。頑張ってください！",
    date: "2025/07/09 15:30",
  },
  {
    id: "2",
    author: "@adventure_seeker",
    content: "応援しています！写真も楽しみにしています。",
    date: "2025/07/08 10:15",
  },
];

// sectionCardStyle, sectionTitleStyleは廃止
const gradientBadgeStyle = {
  display: "inline-block",
  padding: "4px 16px",
  borderRadius: 16,
  background: "linear-gradient(90deg,#2563eb,#60a5fa)",
  color: "#fff",
  fontWeight: 700,
  fontSize: 16,
  letterSpacing: "0.02em",
  marginBottom: 18,
  boxShadow: "0 2px 8px #2563eb22",
};
const sectionStyle = {
  marginBottom: 44,
  padding: "0 0 32px 0",
  background: "none",
  borderRadius: 0,
  boxShadow: "none",
  border: "none",
};
const subtleBgStyle = {
  background: "linear-gradient(90deg,#f8fafc 60%,#e0e7ef 100%)",
  borderRadius: 18,
  padding: "24px 20px",
  marginTop: 12,
  marginBottom: 0,
  boxShadow: "0 2px 12px #2563eb0a",
};

const ChallengeDetailLayout = ({
  challenge,
  progresses,
  comments,
  onCommentAdded,
  onEdit,
  onDelete,
  onBack,
  isOwner,
  onComplete,
}: ChallengeDetailLayoutProps) => {
  const [applauseCnt, setApplauseCnt] = useState(0);
  const [applauded, setApplauded] = useState(false);
  const { challengeId } = challenge;
  const { user } = require("@/contexts/AuthContext").useAuth();
  useEffect(() => {
    let ignore = false;
    if (!challengeId) return;
    const fetchApplause = async () => {
      const [{ count }, { applauded }] = await Promise.all([
        getApplauseCount("challenge", challengeId),
        user ? isApplaudedByUser(user.id, "challenge", challengeId) : Promise.resolve({ applauded: false })
      ]);
      if (!ignore) {
        setApplauseCnt(count ?? 0);
        setApplauded(!!applauded);
      }
    };
    fetchApplause();
    return () => { ignore = true; };
  }, [challengeId, user]);
  // challenge.statusを受け取る前提で判定
  const isCompleted = challenge.status === 'completed';
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
        minHeight: "100vh",
        padding: "0 0 40px 0",
      }}
    >
      {/* Heroセクション（カバー画像＋オーバーレイ＋タイトル等） */}
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: 260,
          maxHeight: 360,
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          // marginBottom: 28,
          zIndex: 2,
        }}
      >
        {/* 戻るボタン（左上） */}
        {onBack && (
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 32,
              zIndex: 10,
            }}
          >
            <button
              onClick={onBack}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                background: "none",
                color: "#888",
                border: "none",
                fontWeight: 500,
                fontSize: 14,
                boxShadow: "none",
                cursor: "pointer",
                textDecoration: "underline",
                opacity: 0.7,
                transition: "opacity 0.2s",
              }}
              onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) =>
                (e.currentTarget.style.opacity = "1")
              }
              onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) =>
                (e.currentTarget.style.opacity = "0.7")
              }
            >
              ← 戻る
            </button>
          </div>
        )}
        {/* 編集・削除ボタン（右上） */}
        {isOwner && (onEdit || onDelete) && (
          <div
            style={{
              position: "absolute",
              top: 24,
              right: 32,
              zIndex: 10,
              display: "flex",
              gap: 10,
            }}
          >
            {isOwner && onEdit && (
              <button
                onClick={onEdit}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "none",
                  color: "#888",
                  border: "none",
                  fontWeight: 500,
                  fontSize: 14,
                  boxShadow: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  opacity: 0.7,
                  transition: "opacity 0.2s",
                }}
                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.opacity = "1")
                }
                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.opacity = "0.7")
                }
              >
                編集
              </button>
            )}
            {isOwner && onDelete && (
              <button
                onClick={onDelete}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "none",
                  color: "#c00",
                  border: "none",
                  fontWeight: 500,
                  fontSize: 14,
                  boxShadow: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  opacity: 0.7,
                  transition: "opacity 0.2s",
                }}
                onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.opacity = "1")
                }
                onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.opacity = "0.7")
                }
              >
                削除
              </button>
            )}
          </div>
        )}
        {/* カバー画像 or グラデ背景 */}
        {challenge.coverImageUrl ? (
          <img
            src={challenge.coverImageUrl}
            alt="cover"
            style={{
              width: "100%",
              height: 320,
              objectFit: "cover",
              filter: "brightness(0.85)",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 320,
              background: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />
        )}
        {/* オーバーレイ */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: 120,
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.38) 60%, rgba(0,0,0,0.08) 100%)",
            zIndex: 2,
          }}
        />
        {/* タイトル・著者・カテゴリ */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            width: "100%",
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 32px 32px 32px",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: "rgba(0,0,0,0.32)",
              borderRadius: 8,
              padding: "4px 14px",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: 0.5,
              marginBottom: 4,
            }}
          >
            {challenge.category}
          </span>
      
          <h1
            className="challenge-detail-title"
            style={{
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: 0,
              textShadow: "0 2px 8px rgba(0,0,0,0.18)",
              background: 'rgba(0,0,0,0.55)',
              borderRadius: 10,
              padding: '8px 18px',
              lineHeight: 1.3,
              maxWidth: '100%',
              wordBreak: 'break-word',
            }}
          >
            {challenge.title}
          </h1>
          {/* ユーザーネームと目標達成日を同じ行で左右に配置 */}
          <div
            className="challenge-detail-meta"
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 2,
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 17,
                fontWeight: 500,
                opacity: 0.92,
              }}
            >
              by <Link href={`/mypage?user=${encodeURIComponent(challenge.author.replace(/^@/, ''))}`} style={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>{challenge.author}</Link>
            </div>
            <div
              className="challenge-detail-badge"
              style={{
                fontSize: 16,
                fontWeight: 600,
                background: 'rgba(0,0,0,0.18)',
                borderRadius: 6,
                padding: '2px 12px',
                whiteSpace: 'nowrap',
              }}
            >
              🎯 目標達成日: {challenge.targetDate}
            </div>
          </div>
        </div>
        {/* レスポンシブ用スタイル */}
        <style>{`
          @media (max-width: 600px) {
            .challenge-detail-title {
              font-size: 20px !important;
              padding: 6px 10px !important;
            }
            .challenge-detail-meta {
              font-size: 13px !important;
              gap: 6px !important;
            }
            .challenge-detail-badge {
              font-size: 12px !important;
              padding: 2px 8px !important;
            }
          }
        `}</style>
      </section>
      {/* メインカード部分 */}
      <main
        className="card fade-in"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "72px 0 40px 0",
          background: "none",
          borderRadius: 24,
          boxShadow: "none",
          border: "none",
          position: "relative",
          zIndex: 4,
        }}
      >
        {/* 拍手ボタン・サポートボタン（背景画像と重ならない位置、横並び・目立たない形・レスポンシブ対応） */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
          {challengeId && (
            <ApplauseButton
              targetType="challenge"
              targetId={challengeId}
              initialCount={applauseCnt}
              initialApplauded={applauded}
              onChange={(a, c) => { setApplauded(a); setApplauseCnt(c); }}
            />
          )}
          {/* サポートボタン（目立たない形） */}
          <a
            href={`/support/${challenge.author.replace(/^@/, '')}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 16px',
              background: '#f5f5f5',
              color: '#888',
              border: '1px solid #ddd',
              borderRadius: 20,
              fontWeight: 'bold',
              fontSize: 15,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s',
              minWidth: 64,
              opacity: 0.85,
            }}
            className="support-link-btn"
          >
            <span style={{ fontSize: 18 }}>💖</span>
            <span>この人を応援する</span>
          </a>
          {/* 完了ボタン（オーナーのみ） */}
          {isOwner && (
            <button
              onClick={onComplete}
              disabled={isCompleted}
              style={{
                padding: '6px 16px',
                background: isCompleted ? '#e0e7ef' : '#e0e7ef',
                color: isCompleted ? '#aaa' : '#2563eb',
                border: '1px solid #b6c4e0',
                borderRadius: 20,
                fontWeight: 'bold',
                fontSize: 15,
                cursor: isCompleted ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                minWidth: 64,
                opacity: 0.85,
              }}
            >
              {isCompleted ? '完了済み' : '✅ 完了済みにする'}
            </button>
          )}
        </div>
        <style>{`
          @media (max-width: 600px) {
            .support-link-btn {
              font-size: 12px !important;
              padding: 4px 10px !important;
              min-width: 48px !important;
            }
          }
        `}</style>
        {/* チャレンジ説明 */}
        <section style={sectionStyle}>
          <div style={gradientBadgeStyle}>
            📝 チャレンジの詳細説明（なぜ始めたか）
          </div>
          <div style={subtleBgStyle}>
            <ChallengeDescription description={challenge.description} />
          </div>
        </section>
        {/* 進捗タイムライン */}
        <section style={sectionStyle}>
          <div style={gradientBadgeStyle}>🧭 進捗タイムライン（降順）</div>
          <div style={subtleBgStyle}>
            <ProgressTimeline
              progresses={progresses}
              challengeId={challenge.challengeId || ""}
            />
          </div>
        </section>
        {/* コメント欄 */}
        <section style={sectionStyle}>
          <div style={gradientBadgeStyle}>
            💬 コメント欄（応援メッセージ投稿）
          </div>
          <div style={subtleBgStyle}>
            <CommentSection
              comments={comments}
              challengeId={challenge.challengeId || ""}
              onCommentAdded={onCommentAdded}
            />
          </div>
        </section>
        {/* GPTサポートツール */}
        <section style={sectionStyle}>
          <div style={gradientBadgeStyle}>🤖 GPTサポートツール</div>
          <div style={subtleBgStyle}>
            <GPTSupportTools />
          </div>
        </section>
      </main>
      {/* アニメーション用CSS */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
};

export default ChallengeDetailLayout;
