"use client";

import React, { useState, useEffect } from "react";
import SupportPageHeader from "./SupportPageHeader";
import UserMiniProfile from "./UserMiniProfile";
import SupporterVoices from "./SupporterVoices";
import SupportPlanSelector from "./SupportPlanSelector";
import MessageInput from "./MessageInput";
import StripePayButton from "./StripePayButton";
import SecurityNotice from "./SecurityNotice";
import { useAuth } from '@/contexts/AuthContext';
import SupporterList from "./SupporterList";

type PlanType = "monthly" | "oneTime";

type Supporter = {
  id: string;
  username: string;
  amount: number;
  type: "monthly" | "oneTime";
  comment?: string;
  profileImage?: string;
  supported_at?: string;
};

type UserData = {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
  created_at: string;
};

type StatsData = {
  supporterCount: number;
  totalAmount: number;
  monthlyAmount: number;
  activeChallenges: number;
  completedChallenges: number;
  totalApplauseCount: number;
};

interface SupportLayoutProps {
  username: string;
  challengeId?: string;
}

const SupportLayout = ({ username, challengeId }: SupportLayoutProps) => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<{ type: PlanType; amount: number }>({
    type: "monthly",
    amount: 500
  });
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/support/${username}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('ユーザーが見つかりません');
          } else {
            setError('データの取得に失敗しました');
          }
          return;
        }

        const data = await response.json();
        
        if (data.success) {
          setUserData(data.user);
          setStatsData(data.stats);
          setSupporters(data.supporters.map((s: any) => ({
            id: s.support_id,
            username: s.username,
            amount: s.amount,
            type: s.plan_type === 'monthly' ? 'monthly' : 'oneTime',
            comment: s.message,
            profileImage: s.avatar_url,
            supported_at: s.supported_at
          })));
        } else {
          setError(data.error || 'データの取得に失敗しました');
        }
      } catch (error) {
        console.error('サポートデータ取得エラー:', error);
        setError('ネットワークエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchSupportData();
    }
  }, [username]);

  const handlePlanChange = (type: PlanType, amount: number) => {
    setSelectedPlan({ type, amount });
  };

  const handleMessageChange = (newMessage: string) => {
    setMessage(newMessage);
  };

  const handleGPTSuggest = async () => {
    try {
      const response = await fetch('/api/gpt/suggest-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${userData?.username}さんの挑戦を応援するメッセージを考えてください。`
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        // GPT APIが利用できない場合はデフォルトメッセージを使用
        const suggestions = [
          "素晴らしい挑戦ですね！応援しています！",
          "頑張ってください！応援しています！",
          "あなたの挑戦に感動しています。応援しています！"
        ];
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        setMessage(randomSuggestion);
      }
    } catch (error) {
      console.error('GPT提案エラー:', error);
      // エラーの場合もデフォルトメッセージを使用
      const suggestions = [
        "素晴らしい挑戦ですね！応援しています！",
        "頑張ってください！応援しています！",
        "あなたの挑戦に感動しています。応援しています！"
      ];
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setMessage(randomSuggestion);
    }
  };

  const handlePayment = async () => {
    if (!userData) {
      alert('ユーザー情報が取得できませんでした');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-supporter-id": user?.id || ''
        },
        body: JSON.stringify({
          amount: selectedPlan.amount,
          planType: selectedPlan.type,
          message: message,
          targetUser: userData.id
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Stripeセッションの作成に失敗しました: " + (data.error || "不明なエラー"));
        setIsProcessing(false);
      }
    } catch (e) {
      alert("Stripe決済処理でエラーが発生しました");
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ background: '#fafcff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: '#666', marginBottom: 16 }}>読み込み中...</div>
        </div>
      </div>
    );
  }

  if (error || !userData || !statsData) {
    return (
      <div style={{ background: '#fafcff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: '#ff6b6b', marginBottom: 16 }}>
            {error || 'データの取得に失敗しました'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#fafcff', minHeight: '100vh' }}>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
        <SupportPageHeader username={userData.username} challengeId={challengeId} />
        <UserMiniProfile 
          username={userData.username}
          profileImage={userData.avatar_url}
          bio={userData.bio}
          supporterCount={statsData.supporterCount}
          applauseCount={statsData.totalApplauseCount}
          activeChallenges={statsData.activeChallenges}
        />
        <SupporterList supporters={supporters} />
        <SupportPlanSelector onPlanChange={handlePlanChange} />
        <MessageInput onMessageChange={handleMessageChange} onGPTSuggest={handleGPTSuggest} />
        <StripePayButton 
          onPayment={handlePayment}
          amount={selectedPlan.amount}
          planType={selectedPlan.type}
          isProcessing={isProcessing}
        />
        <SecurityNotice />
      </main>
    </div>
  );
};

export default SupportLayout; 