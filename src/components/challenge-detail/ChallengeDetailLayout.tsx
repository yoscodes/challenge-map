import React from "react";
import { getPlaceholderImage, PLACEHOLDER_TYPES } from "@/lib/placeholder-images";
import ChallengeHeader from "./ChallengeHeader";
import ChallengeDescription from "./ChallengeDescription";
import ProgressTimeline from "./ProgressTimeline";
import CommentSection from "./CommentSection";
import GPTSupportTools from "./GPTSupportTools";
import SupportButton from "./SupportButton";

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
}

// ダミーデータ
const dummyChallengeData = {
  title: "世界一周、まずは台湾から",
  author: "@ai_traveler",
  category: "旅 ✈️",
  startDate: "2025/07/01",
  targetDate: "2025/09/01",
  location: "東京 → 世界各地",
  description: "長年夢だった世界一周旅行を実現するため、まずは台湾から始めます。語学力向上と異文化体験を通じて、自分自身の視野を広げたいと思います。不安もありますが、多くの方の応援を力に変えて頑張ります！"
};

const dummyProgresses = [
  {
    id: "1",
    date: "2025/07/09",
    content: "羽田から出発！不安もあるけどワクワク！",
    imageUrl: getPlaceholderImage(PLACEHOLDER_TYPES.CHALLENGE),
    applauseCount: 6,
    commentCount: 3
  },
  {
    id: "2",
    date: "2025/07/05",
    content: "パッキング完了！ミニマリスト生活開始！",
    applauseCount: 4,
    commentCount: 2
  },
  {
    id: "3",
    date: "2025/07/02",
    content: "航空券ゲットしました。まずは台湾！",
    applauseCount: 8,
    commentCount: 5
  }
];

const dummyComments = [
  {
    id: "1",
    author: "@travel_lover",
    content: "素晴らしい挑戦ですね！台湾は本当に素敵な場所です。頑張ってください！",
    date: "2025/07/09 15:30"
  },
  {
    id: "2",
    author: "@adventure_seeker",
    content: "応援しています！写真も楽しみにしています。",
    date: "2025/07/08 10:15"
  }
];

// sectionCardStyle, sectionTitleStyleは廃止
const gradientBadgeStyle = {
  display: 'inline-block',
  padding: '4px 16px',
  borderRadius: 16,
  background: 'linear-gradient(90deg,#2563eb,#60a5fa)',
  color: '#fff',
  fontWeight: 700,
  fontSize: 16,
  letterSpacing: '0.02em',
  marginBottom: 18,
  boxShadow: '0 2px 8px #2563eb22',
};
const sectionStyle = {
  marginBottom: 44,
  padding: '0 0 32px 0',
  background: 'none',
  borderRadius: 0,
  boxShadow: 'none',
  border: 'none',
};
const subtleBgStyle = {
  background: 'linear-gradient(90deg,#f8fafc 60%,#e0e7ef 100%)',
  borderRadius: 18,
  padding: '24px 20px',
  marginTop: 12,
  marginBottom: 0,
  boxShadow: '0 2px 12px #2563eb0a',
};

const ChallengeDetailLayout = ({ challenge, progresses, comments, onCommentAdded, onEdit, onDelete, onBack, isOwner }: ChallengeDetailLayoutProps) => (
  <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)', minHeight: '100vh', padding: '0 0 40px 0'}}>
    {/* Heroセクション（カバー画像＋オーバーレイ＋タイトル等） */}
    <section style={{
      position: 'relative',
      width: '100%',
      minHeight: 260,
      maxHeight: 360,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      // marginBottom: 28,
      zIndex: 2
    }}>
      {/* フローティングボタン群 */}
      <div style={{
        position: 'absolute',
        top: 24,
        right: 32,
        zIndex: 10,
        display: 'flex',
        gap: 10
      }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              padding: '7px 18px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.92)',
              color: '#333',
              border: '1px solid #ddd',
              fontWeight: 700,
              fontSize: 15,
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >← 戻る</button>
        )}
        {isOwner && onEdit && (
          <button
            onClick={onEdit}
            style={{
              padding: '7px 18px',
              borderRadius: 8,
              background: '#1890ff',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              fontSize: 15,
              boxShadow: '0 2px 8px rgba(24,144,255,0.13)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >編集</button>
        )}
        {isOwner && onDelete && (
          <button
            onClick={onDelete}
            style={{
              padding: '7px 18px',
              borderRadius: 8,
              background: '#fff',
              color: '#ff4d4f',
              border: '1px solid #ff4d4f',
              fontWeight: 700,
              fontSize: 15,
              boxShadow: '0 2px 8px rgba(255,77,79,0.10)',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >削除</button>
        )}
      </div>
      {/* カバー画像 or グラデ背景 */}
      {challenge.coverImageUrl ? (
        <img
          src={challenge.coverImageUrl}
          alt="cover"
          style={{
            width: '100%',
            height: 320,
            objectFit: 'cover',
            filter: 'brightness(0.85)',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: 320,
          background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }} />
      )}
      {/* オーバーレイ */}
      <div style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: 120,
        background: 'linear-gradient(0deg, rgba(0,0,0,0.38) 60%, rgba(0,0,0,0.08) 100%)',
        zIndex: 2
      }} />
      {/* タイトル・著者・カテゴリ */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        width: '100%',
        maxWidth: 900,
        margin: '0 auto',
        padding: '0 32px 32px 32px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 12
      }}>
        <span style={{
          display: 'inline-block',
          background: 'rgba(0,0,0,0.32)',
          borderRadius: 8,
          padding: '4px 14px',
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: 0.5,
          marginBottom: 4
        }}>{challenge.category}</span>
        <h1 style={{
          fontSize: 32,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          margin: 0,
          textShadow: '0 2px 8px rgba(0,0,0,0.18)'
        }}>{challenge.title}</h1>
        <div style={{
          fontSize: 17,
          fontWeight: 500,
          opacity: 0.92,
          marginTop: 2
        }}>by <span style={{ fontWeight: 700 }}>{challenge.author}</span></div>
      </div>
    </section>
    {/* メインカード部分 */}
    <main className="card fade-in" style={{ maxWidth: 900, margin: '0 auto', padding: '72px 0 40px 0', background: 'none', borderRadius: 24, boxShadow: 'none', border: 'none', position: 'relative', zIndex: 4 }}>
      {/* チャレンジ説明 */}
      <section style={sectionStyle}>
        <div style={gradientBadgeStyle}>📝 チャレンジの詳細説明（なぜ始めたか）</div>
        <div style={subtleBgStyle}>
          <ChallengeDescription description={challenge.description} />
        </div>
      </section>
      {/* 進捗タイムライン */}
      <section style={sectionStyle}>
        <div style={gradientBadgeStyle}>🧭 進捗タイムライン（降順）</div>
        <div style={subtleBgStyle}>
          <ProgressTimeline progresses={progresses} challengeId={challenge.challengeId || ''} />
        </div>
      </section>
      {/* コメント欄 */}
      <section style={sectionStyle}>
        <div style={gradientBadgeStyle}>💬 コメント欄（応援メッセージ投稿）</div>
        <div style={subtleBgStyle}>
          <CommentSection 
            comments={comments} 
            challengeId={challenge.challengeId || ''} 
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
      {/* サポートボタン（下部に目立たせて表示） */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
        <SupportButton author={challenge.author} />
      </div>
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

export default ChallengeDetailLayout; 