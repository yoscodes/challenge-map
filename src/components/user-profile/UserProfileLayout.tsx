"use client";

import React, { useState } from "react";
import UserProfileHeader from "./UserProfileHeader";
import UserStats from "./UserStats";
import SupportButton from "./SupportButton";
import CommentBox from "./CommentBox";
import UserTabSwitcher from "./UserTabSwitcher";
import UserChallengeCardList from "./UserChallengeCardList";
import UserTrajectoryMap from "./UserTrajectoryMap";
import { useEffect } from "react";
import { supabase } from '@/lib/supabase';
import UserProfileEditModal from "./UserProfileEditModal";

type Tab = "active" | "completed";

type Progress = {
  id: string;
  title?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  date?: string;
};

const UserProfileLayout = () => {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [isSupported, setIsSupported] = useState(false);
  const [progresses, setProgresses] = useState<Progress[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  // ダミーデータ
  const userData = {
    id: "dummy-user-id-123", // 実際のユーザーID
    username: "@ai_traveler",
    profileImage: "https://via.placeholder.com/120x120/87CEEB/FFFFFF?text=👤",
    bio: "世界一周旅行を目指す冒険者です。異文化体験を通じて自分自身の視野を広げたいと思っています。現在は台湾で語学学習中です。",
    location: "東京 → 世界各地",
    website: "https://example.com",
    twitter: "https://twitter.com/ai_traveler",
    instagram: "https://instagram.com/ai_traveler"
  };

  const [userProfile, setUserProfile] = useState({
    bio: userData.bio,
    website: userData.website || "",
    twitter: userData.twitter || "",
    instagram: userData.instagram || ""
  });

  const statsData = {
    supporterCount: 12,
    totalApplauseCount: 132,
    completedChallenges: 2,
    activeChallenges: 3,
    continuousDays: 37,
    followerCount: 8,
    followingCount: 15,
    userId: userData.id
  };

  const challengesData = [
    {
      id: "1",
      title: "世界一周、まずは台湾から",
      status: "active" as const,
      progressDay: 17,
      applauseCount: 32,
      supporterCount: 5,
      coverImage: "https://via.placeholder.com/80x80/87CEEB/FFFFFF?text=✈️"
    },
    {
      id: "2",
      title: "朝5時起き生活",
      status: "active" as const,
      progressDay: 8,
      applauseCount: 11,
      coverImage: "https://via.placeholder.com/80x80/52c41a/FFFFFF?text=🌅"
    },
    {
      id: "3",
      title: "英語100時間勉強",
      status: "completed" as const,
      applauseCount: 42,
      completionDate: "2025/06/10"
    }
  ];

  useEffect(() => {
    const fetchProgresses = async () => {
      // 本来はuserData.id（ユーザーID）でフィルタ。ここではusernameで仮実装。
      const { data, error } = await supabase
        .from('progress_updates')
        .select('*')
        .eq('user_id', userData.username); // 実際はuser_id: UUID
      if (!error && data) {
        setProgresses(data.map((p: any) => ({
          id: p.id,
          title: p.title || '',
          location: p.location,
          date: p.created_at
        })));
      }
    };
    fetchProgresses();
  }, []);

  const handleSupport = () => {
    // TODO: Stripe連携
    setIsSupported(!isSupported);
    alert(isSupported ? "応援を停止しました" : "応援を開始しました！");
  };

  const handleCommentSubmit = (comment: string) => {
    // TODO: コメント保存
    console.log("応援コメント:", comment);
    alert("応援コメントを送信しました！");
  };

  const handleGPTSuggest = () => {
    // TODO: GPT APIでコメント提案
    const suggestions = [
      "素晴らしい挑戦ですね！応援しています！",
      "世界一周、本当に素敵な目標です。頑張ってください！",
      "異文化体験を通じた成長、とても興味深いです。応援しています！"
    ];
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    alert(`GPT提案: ${randomSuggestion}`);
  };

  const handleEditProfile = () => setEditOpen(true);
  const handleSaveProfile = async (values: { bio: string; website?: string; twitter?: string; instagram?: string }) => {
    const { error } = await supabase
      .from('users')
      .update({
        bio: values.bio,
        website: values.website || "",
        twitter: values.twitter || "",
        instagram: values.instagram || ""
      })
      .eq('username', userData.username); // 仮実装
    if (!error) {
      setUserProfile({
        bio: values.bio,
        website: values.website || "",
        twitter: values.twitter || "",
        instagram: values.instagram || ""
      });
      setEditOpen(false);
    } else {
      alert('保存に失敗しました');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "active":
        return <UserChallengeCardList challenges={challengesData} type="active" />;
      case "completed":
        return <UserChallengeCardList challenges={challengesData} type="completed" />;
      default:
        return null;
    }
  };

  return (
    <div style={{ background: '#fafcff', minHeight: '100vh' }}>
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
        <UserProfileHeader
          {...userData}
          bio={userProfile.bio}
          website={userProfile.website}
          twitter={userProfile.twitter}
          instagram={userProfile.instagram}
          onEditProfile={handleEditProfile}
          targetUserId={userData.id}
        />
        <UserProfileEditModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSave={handleSaveProfile}
          initialBio={userProfile.bio}
          initialWebsite={userProfile.website}
          initialTwitter={userProfile.twitter}
          initialInstagram={userProfile.instagram}
        />
        <UserStats {...statsData} />
        <UserTrajectoryMap progresses={progresses} />
        <SupportButton onSupport={handleSupport} isSupported={isSupported} />
        <CommentBox onSubmit={handleCommentSubmit} onGPTSuggest={handleGPTSuggest} />
        <UserTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTabContent()}
      </main>
    </div>
  );
};

export default UserProfileLayout; 