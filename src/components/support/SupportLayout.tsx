"use client";

import React, { useState } from "react";
import SupportPageHeader from "./SupportPageHeader";
import UserMiniProfile from "./UserMiniProfile";
import SupporterVoices from "./SupporterVoices";
import SupportPlanSelector from "./SupportPlanSelector";
import MessageInput from "./MessageInput";
import StripePayButton from "./StripePayButton";
import SecurityNotice from "./SecurityNotice";
import { useAuth } from '@/contexts/AuthContext';
import SupporterList from "./SupporterList";
import { useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

type PlanType = "monthly" | "oneTime";

type Supporter = {
  id: string;
  username: string;
  amount: number;
  type: "monthly" | "oneTime";
  comment?: string;
  profileImage?: string;
};

const SupportLayout = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<{ type: PlanType; amount: number }>({
    type: "monthly",
    amount: 500
  });
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [supporters, setSupporters] = useState<Supporter[]>([]);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const fetchSupporters = async () => {
      // supported_user_idはuserData.usernameで仮実装。実際はIDで管理する場合は修正。
      const { data, error } = await supabase
        .from('supporters')
        .select('*')
        .eq('supported_user_id', userData.username);
      if (!error && data) {
        // 必要に応じてユーザー名や画像を取得・マッピング
        setSupporters(data.map((s: any) => ({
          id: s.id,
          username: s.supporter_id, // 本来はユーザー名取得推奨
          amount: s.amount,
          type: s.plan_type,
          comment: '', // メッセージカラムがあればここに
          profileImage: '' // 必要に応じて
        })));
      }
    };
    fetchSupporters();
  }, []);

  // ダミーデータ
  const userData = {
    username: "@ai_traveler",
    profileImage: "https://via.placeholder.com/80x80/87CEEB/FFFFFF?text=👤",
    bio: "世界一周旅行を目指す冒険者です。異文化体験を通じて自分自身の視野を広げたいと思っています。現在は台湾で語学学習中です。",
    supporterCount: 12,
    applauseCount: 130,
    activeChallenges: ["世界一周", "朝5時起き習慣"]
  };

  const supporterVoices = [
    {
      id: "1",
      username: "ken_123",
      message: "応援してます！",
      date: "2025/07/08"
    },
    {
      id: "2",
      username: "miki_77",
      message: "毎日読んでます。元気もらってます！",
      date: "2025/07/07"
    }
  ];

  const handlePlanChange = (type: PlanType, amount: number) => {
    setSelectedPlan({ type, amount });
  };

  const handleMessageChange = (newMessage: string) => {
    setMessage(newMessage);
  };

  const handleGPTSuggest = () => {
    // TODO: GPT APIでメッセージ提案
    const suggestions = [
      "素晴らしい挑戦ですね！応援しています！",
      "世界一周、本当に素敵な目標です。頑張ってください！",
      "異文化体験を通じた成長、とても興味深いです。応援しています！"
    ];
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setMessage(randomSuggestion);
  };

  const handlePayment = async () => {
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
          targetUser: userData.username
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

  return (
    <div style={{ background: '#fafcff', minHeight: '100vh' }}>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
        <SupportPageHeader username={userData.username} />
        <UserMiniProfile {...userData} />
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