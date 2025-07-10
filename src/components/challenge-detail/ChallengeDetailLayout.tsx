import React from "react";
import ChallengeHeader from "./ChallengeHeader";
import ChallengeDescription from "./ChallengeDescription";
import ProgressTimeline from "./ProgressTimeline";
import CommentSection from "./CommentSection";
import GPTSupportTools from "./GPTSupportTools";
import SupportButton from "./SupportButton";

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
    imageUrl: "https://via.placeholder.com/400x300/87CEEB/FFFFFF?text=出発写真",
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

const ChallengeDetailLayout = () => (
  <div style={{ background: '#fafcff', minHeight: '100vh' }}>
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <ChallengeHeader {...dummyChallengeData} />
      <ChallengeDescription description={dummyChallengeData.description} />
      <ProgressTimeline progresses={dummyProgresses} />
      <CommentSection comments={dummyComments} />
      <GPTSupportTools />
      <SupportButton />
    </main>
  </div>
);

export default ChallengeDetailLayout; 