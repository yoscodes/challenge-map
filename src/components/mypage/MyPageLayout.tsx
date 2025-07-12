"use client";

import React, { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import UserStats from "./UserStats";
import TabSwitcher from "./TabSwitcher";
import ChallengeCardList from "./ChallengeCardList";
import SupporterList from "./SupporterList";
import EditLinks from "./EditLinks";
import { getPlaceholderImage, PLACEHOLDER_TYPES } from "@/lib/placeholder-images";

type Tab = "active" | "completed" | "supporters";

const MyPageLayout = () => {
  const [activeTab, setActiveTab] = useState<Tab>("active");

  // ダミーデータ
  const userData = {
    username: "@ai_traveler",
    profileImage: getPlaceholderImage(PLACEHOLDER_TYPES.USER),
    bio: "世界一周旅行を目指す冒険者です。異文化体験を通じて自分自身の視野を広げたいと思っています。",
    location: "東京 → 世界各地",
    website: "https://example.com",
    twitter: "https://twitter.com/ai_traveler",
    instagram: "https://instagram.com/ai_traveler"
  };

  const statsData = {
    supporterCount: 12,
    applauseCount: 132,
    continuousDays: 37,
    completedChallenges: 2
  };

  const challengesData = [
    {
      id: "1",
      title: "世界一周、まずは台湾から",
      status: "active" as const,
      progressDay: 17,
      applauseCount: 32,
      supporterCount: 5,
      coverImage: getPlaceholderImage(PLACEHOLDER_TYPES.CHALLENGE)
    },
    {
      id: "2",
      title: "朝5時起き生活",
      status: "active" as const,
      progressDay: 10,
      applauseCount: 12,
      coverImage: getPlaceholderImage(PLACEHOLDER_TYPES.CHALLENGE)
    },
    {
      id: "3",
      title: "英語100時間勉強",
      status: "completed" as const,
      applauseCount: 42,
      completionComment: "TOEICスコアが100点アップしました！"
    }
  ];

  const supportersData = [
    {
      id: "1",
      username: "kenta_san",
      amount: 500,
      type: "monthly" as const,
      comment: "がんばって！",
      profileImage: getPlaceholderImage(PLACEHOLDER_TYPES.AVATAR)
    },
    {
      id: "2",
      username: "megu123",
      amount: 1000,
      type: "oneTime" as const,
      profileImage: getPlaceholderImage(PLACEHOLDER_TYPES.AVATAR)
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "active":
        return <ChallengeCardList challenges={challengesData} type="active" />;
      case "completed":
        return <ChallengeCardList challenges={challengesData} type="completed" />;
      case "supporters":
        return <SupporterList supporters={supportersData} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ background: '#fafcff', minHeight: '100vh' }}>
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
        <ProfileHeader {...userData} />
        <UserStats {...statsData} />
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTabContent()}
        <EditLinks />
      </main>
    </div>
  );
};

export default MyPageLayout; 