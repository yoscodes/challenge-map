"use client";

import { useEffect, useState } from 'react';
import { challenges } from '@/lib/database';
import type { Challenge } from '@/lib/supabase';
import Header from "../components/top/Header";
import HeroMessage from "../components/top/HeroMessage";
import MainLayout from "../components/top/MainLayout";
import ChallengeList from "../components/top/ChallengeList";
import CTAButton from "../components/top/CTAButton";

export default function HomePage() {
  const [challengeList, setChallengeList] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await challenges.getAll(10);
        
        if (error) {
          console.error('チャレンジ取得エラー:', error);
          setError('チャレンジの取得に失敗しました。');
          return;
        }

        setChallengeList(data || []);
      } catch (err) {
        console.error('データ取得エラー:', err);
        setError('データの取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  return (
    <div style={{ background: '#fafcff', minHeight: '100vh' }}>
      <Header />
      <main
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '24px 16px',
          width: '100%',
        }}
      >
        <HeroMessage />
        <MainLayout challenges={challengeList} />
        <ChallengeList 
          challenges={challengeList}
          isLoading={isLoading}
          error={error}
        />
        <CTAButton />
      </main>
    </div>
  );
}
