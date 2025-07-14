"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { progressUpdates, challenges } from "@/lib/database";
import { uploadImageToStorage, getImageUrlFromStorage, deleteImageFromStorage } from "@/lib/storage";
import ProgressFormHeader from "./ProgressFormHeader";
import ContentInput from "./ContentInput";
import DateInput from "./DateInput";
import GPTAssistButtons from "./GPTAssistButtons";
import ProgressSubmitButton from "./ProgressSubmitButton";
import type { LocationValue } from "./LocationInput";

const progressTypeOptions = [
  { value: 'achievement', label: '成果', color: '#36d1c4' },
  { value: 'trouble', label: '悩み', color: '#ff4d4f' },
  { value: 'plan', label: '計画', color: '#1890ff' },
];
const tagPresets = ['#読書', '#筋トレ', '#旅', '#勉強', '#健康', '#挑戦'];

const ProgressNewLayout = () => {
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    content: "",
    date: "",
    progressType: 'achievement',
  });

  const [challengeTitle, setChallengeTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gptMessage, setGptMessage] = useState<string | null>(null);
  const [showThanks, setShowThanks] = useState(false);

  const challengeId = params.id as string;
  const isValid = formData.content.length > 0;

  // 画像プレビュー生成・ファイル選択・削除ハンドラも削除

  // 動画ファイル選択・selectedVideoFiles関連の状態・関数も削除

  // タグ追加・削除関連の関数は削除

  const handleSubmit = async () => {
    if (!isValid || !user || !challengeId) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // 画像アップロード関連削除
      // 進捗データの作成
      const progressData = {
        challenge_id: challengeId,
        user_id: user.id,
        content: formData.content,
        date: formData.date ? formData.date : undefined, // ここを修正
        progress_type: formData.progressType,
      };

      const { data, error } = await progressUpdates.create(progressData);
      
      if (error) {
        console.error('進捗投稿エラー:', error);
        setError('進捗の投稿に失敗しました。もう一度お試しください。');
        return;
      }

      console.log('進捗投稿成功:', data);
      
      // GPT応援コメント取得
      setShowThanks(true);
      const prompt = `ユーザーが以下の進捗を投稿しました。日本語で親しみやすく前向きな応援コメントを80文字以内で返してください。\n\n進捗内容: ${formData.content}`;
      try {
        const res = await fetch("/api/gpt/suggest-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt })
        });
        const json = await res.json();
        setGptMessage(json.message || "AI応援コメントの取得に失敗しました");
      } catch (e) {
        setGptMessage("AI応援コメントの取得に失敗しました");
      }
      
      // 成功時はチャレンジ詳細ページにリダイレクト
      router.push(`/challenge/${challengeId}`);
      
    } catch (err) {
      console.error('進捗投稿エラー:', err);
      setError('予期しないエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSNSFormat = () => {
    // TODO: GPT APIでSNS風に整形
    const snsFormatted = `🚀 ${formData.content}\n\n#挑戦中 #進捗報告`;
    setFormData(prev => ({ ...prev, content: snsFormatted }));
  };

  const handlePositiveRewrite = () => {
    // TODO: GPT APIでポジティブに書き直し
    const positiveContent = formData.content.replace(/大変|辛い|困難/g, "挑戦的でやりがいのある");
    setFormData(prev => ({ ...prev, content: positiveContent }));
  };

  // チャレンジ情報の取得
  useEffect(() => {
    const fetchChallenge = async () => {
      if (!challengeId) return;

      try {
        const { data, error } = await challenges.getById(challengeId);
        
        if (error) {
          console.error('チャレンジ取得エラー:', error);
          setError('チャレンジが見つかりません。');
          return;
        }

        setChallengeTitle(data.title);
      } catch (err) {
        console.error('チャレンジ取得エラー:', err);
        setError('チャレンジの取得に失敗しました。');
      }
    };

    fetchChallenge();
  }, [challengeId]);

  // 認証チェック
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    router.push('/auth');
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">エラー</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push(`/challenge/${challengeId}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            チャレンジ詳細に戻る
          </button>
        </div>
      </div>
    );
  }

  if (showThanks) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #2563eb13', padding: 48, maxWidth: 420, textAlign: 'center' }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', marginBottom: 12 }}>進捗を記録しました！</h2>
          <div style={{ fontSize: 17, color: '#333', marginBottom: 24 }}>あなたの挑戦の一歩が記録されました。</div>
          <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 10, padding: 18, color: '#389e0d', fontSize: 16, fontWeight: 600, marginBottom: 24, minHeight: 48 }}>
            {gptMessage ? gptMessage : 'AI応援コメントを生成中...'}
          </div>
          <button
            onClick={() => router.push(`/challenge/${challengeId}`)}
            style={{ background: '#36d1c4', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 12, padding: '12px 32px', fontSize: 17, cursor: 'pointer', marginTop: 8 }}
          >
            チャレンジ詳細に戻る
          </button>
        </div>
      </div>
    );
  }

  // グラデバッジ・カードスタイルを流用
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
  const subtleBgStyle = {
    background: 'linear-gradient(90deg,#f8fafc 60%,#e0e7ef 100%)',
    borderRadius: 18,
    padding: '24px 20px',
    marginTop: 12,
    marginBottom: 0,
    boxShadow: '0 2px 12px #2563eb0a',
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)', minHeight: '100vh', padding: '0 0 40px 0' }}>
      {/* Heroセクション */}
      <section style={{
        position: 'relative',
        width: '100%',
        minHeight: 180,
        maxHeight: 260,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 2
      }}>
        {/* フローティング戻るボタン */}
        <div style={{
          position: 'absolute',
          top: 24,
          right: 32,
          zIndex: 10,
          display: 'flex',
          gap: 10
        }}>
          <button
            onClick={() => router.push(`/challenge/${challengeId}`)}
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
        </div>
        {/* タイトル・カテゴリ・著者 */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: 900,
          margin: '0 auto',
          padding: '0 32px 32px 32px',
          color: '#2563eb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 12
        }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(37,99,235,0.12)',
            borderRadius: 8,
            padding: '4px 14px',
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: 0.5,
            marginBottom: 4
          }}>進捗を投稿する</span>
          <h1 style={{
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: 0,
            textShadow: '0 2px 8px rgba(37,99,235,0.08)'
          }}>{challengeTitle || 'チャレンジ'}</h1>
        </div>
      </section>
      {/* メインカード部分 */}
      <main className="card fade-in" style={{ maxWidth: 900, margin: '0 auto', padding: '72px 0 40px 0', background: 'none', borderRadius: 24, boxShadow: 'none', border: 'none', position: 'relative', zIndex: 4 }}>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* 進捗タイプ選択 */}
          <section style={{ marginBottom: 44 }}>
            <div style={gradientBadgeStyle}>🎯 進捗タイプ</div>
            <div style={subtleBgStyle}>
              <div style={{ display: 'flex', gap: 12 }}>
                {progressTypeOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, progressType: opt.value }))}
                    style={{
                      background: formData.progressType === opt.value ? opt.color : '#f0f0f0',
                      color: formData.progressType === opt.value ? '#fff' : '#333',
                      fontWeight: 700,
                      border: 'none',
                      borderRadius: 16,
                      padding: '8px 20px',
                      fontSize: 15,
                      cursor: 'pointer',
                      boxShadow: formData.progressType === opt.value ? '0 2px 8px #36d1c422' : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
          {/* テキスト進捗 */}
          <section style={{ marginBottom: 44 }}>
            <div style={gradientBadgeStyle}>✏️ 進捗内容</div>
            <div style={subtleBgStyle}>
              <ContentInput
                content={formData.content}
                onContentChange={(content) => setFormData(prev => ({ ...prev, content }))}
              />
            </div>
          </section>
          {/* 画像アップロード（削除） */}
          {/* 日付 */}
          <section style={{ marginBottom: 44 }}>
            <div style={gradientBadgeStyle}>📅 日付</div>
            <div style={subtleBgStyle}>
              <DateInput
                date={formData.date}
                onDateChange={(date) => setFormData(prev => ({ ...prev, date }))}
              />
            </div>
          </section>
          {/* AI補助ツール */}
          <section style={{ marginBottom: 44 }}>
            <div style={gradientBadgeStyle}>🤖 AI補助ツール</div>
            <div style={subtleBgStyle}>
              <GPTAssistButtons
                onSNSFormat={handleSNSFormat}
                onPositiveRewrite={handlePositiveRewrite}
              />
            </div>
          </section>
          {/* 投稿ボタン */}
          <section style={{ marginBottom: 44 }}>
            <ProgressSubmitButton
              onSubmit={handleSubmit}
              isValid={isValid}
              isSubmitting={isSubmitting}
            />
          </section>
        </form>
      </main>
    </div>
  );
};

export default ProgressNewLayout; 