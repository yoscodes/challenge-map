"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "./ProfileHeader";
import UserStats from "./UserStats";
import TabSwitcher from "./TabSwitcher";
import ChallengeCardList from "./ChallengeCardList";
import SupporterList from "./SupporterList";
import EditLinks from "./EditLinks";
import { useAuth } from "@/contexts/AuthContext";
import { users, challenges as challengesApi, progressUpdates, supporters as supportersApi } from "@/lib/database";
import { getPlaceholderImage, PLACEHOLDER_TYPES } from "@/lib/placeholder-images";

type Tab = "active" | "completed" | "supporters";

const MyPageLayout = () => {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [challengesData, setChallengesData] = useState<any[]>([]);
  const [challengesLoading, setChallengesLoading] = useState(true);
  const [progressLoading, setProgressLoading] = useState(true);
  const [supportersData, setSupportersData] = useState<any[]>([]);
  const [supportersLoading, setSupportersLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setProfileLoading(true);
      const { data, error } = await users.getById(user.id);
      setProfileLoading(false);
      if (error) {
        setProfile(null);
        return;
      }
      setProfile(data);
    };
    if (user) fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchChallengesAndProgress = async () => {
      if (!user) return;
      setChallengesLoading(true);
      setProgressLoading(true);
      const { data: challenges, error } = await challengesApi.getByUserId(user.id);
      setChallengesLoading(false);
      if (error || !challenges) {
        setChallengesData([]);
        setProgressLoading(false);
        return;
      }
      // 各チャレンジの進捗を取得
      const challengesWithProgress = await Promise.all(
        challenges.map(async (challenge: any) => {
          const { data: progresses } = await progressUpdates.getByChallengeId(challenge.id);
          return {
            ...challenge,
            progressDay: progresses ? progresses.length : 0,
            latestProgressDate: progresses && progresses.length > 0 ? progresses[progresses.length - 1].created_at : null
          };
        })
      );
      setChallengesData(challengesWithProgress);
      setProgressLoading(false);
    };
    if (user) fetchChallengesAndProgress();
  }, [user]);

  useEffect(() => {
    const fetchSupporters = async () => {
      if (!user) return;
      setSupportersLoading(true);
      const { data, error } = await supportersApi.getByUserId(user.id);
      setSupportersLoading(false);
      if (error) {
        setSupportersData([]);
        return;
      }
      setSupportersData(data || []);
    };
    if (user) fetchSupporters();
  }, [user]);

  if (loading || profileLoading || challengesLoading || progressLoading || supportersLoading) {
    return <div style={{ textAlign: 'center', padding: 40 }}>読み込み中...</div>;
  }
  if (!user) {
    return <div style={{ textAlign: 'center', padding: 40 }}>ログインしてください</div>;
  }
  if (!profile) {
    return <div style={{ textAlign: 'center', padding: 40 }}>プロフィール情報が取得できませんでした</div>;
  }

  // TODO: statsData, challengesData, supportersDataもAPI連携にする
  const statsData = {
    supporterCount: 0,
    applauseCount: 0,
    continuousDays: 0,
    completedChallenges: 0
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "active":
        return <ChallengeCardList challenges={challengesData.filter(c => c.status !== 'completed')} type="active" />;
      case "completed":
        return <ChallengeCardList challenges={challengesData.filter(c => c.status === 'completed')} type="completed" />;
      case "supporters":
        return <SupporterList supporters={supportersData} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ background: '#fafcff', minHeight: '100vh' }}>
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <button
            style={{
              marginRight: 16,
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: 4,
              background: '#fff',
              cursor: 'pointer',
              fontSize: 18,
              color: "#222"
            }}
            onClick={() => router.back()}
          >
            ← 戻る
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0, color: "#222"}}>
            マイページ
          </h1>
        </div>
        <ProfileHeader
          username={profile.username ? `@${profile.username}` : 'ユーザー'}
          profileImage={profile.avatar_url || getPlaceholderImage(PLACEHOLDER_TYPES.USER)}
          bio={profile.bio || ''}
          location={profile.location || ''}
          website={profile.website || ''}
          twitter={profile.twitter || ''}
          instagram={profile.instagram || ''}
          userId={user.id}
          onAvatarChange={async (url) => {
            await users.update(user.id, { avatar_url: url });
            // プロフィール再取得
            const { data } = await users.getById(user.id);
            setProfile(data);
          }}
          onUsernameChange={async (newUsername) => {
            await users.update(user.id, { username: newUsername });
            const { data } = await users.getById(user.id);
            setProfile(data);
          }}
        />
        <UserStats {...statsData} />
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTabContent()}
        <EditLinks />
      </main>
    </div>
  );
};

export default MyPageLayout; 