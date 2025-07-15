"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { challenges } from "@/lib/database";
import { isMobile, getMobileStyles } from "@/lib/mobile-utils";
import MobileForm from "@/components/common/MobileForm";
import ChallengeFormHeader from "./ChallengeFormHeader";
import CategorySelect from "./CategorySelect";
import TitleInput from "./TitleInput";
import DescriptionInput from "./DescriptionInput";
import GoalDateInput from "./GoalDateInput";
import LocationInput from "./LocationInput";
import PrivacySettings from "./PrivacySettings";
import ImageUploader from "./ImageUploader";
import SubmitButton from "./SubmitButton";
import { supabase } from "@/lib/supabase";

const ChallengeNewLayout = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    categories: [] as string[],
    title: "",
    description: "",
    goalDate: "",
    location: null as { lat: number; lng: number; address: string } | null,
    isPublic: true,
    coverImage: null as File | null
  });

  const isMobileView = isMobile();
  const mobileStyles = getMobileStyles();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 認証チェック - Hooksの呼び出し後に移動
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
  
  const isValid = formData.categories.length > 0 && 
                 formData.title.length > 0 && 
                 formData.description.length > 0 && 
                 formData.goalDate.length > 0;

  const handleSubmit = async () => {
    if (!user || !isValid) return;

    try {
      setIsSubmitting(true);
      setError(null);

      let coverImageUrl = null;

      // 画像がある場合はSupabase Storageにアップロード
      if (formData.coverImage) {
        const fileExt = formData.coverImage.name.split('.').pop();
        const fileName = `challenges/${user.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, formData.coverImage);

        if (uploadError) {
          console.error('画像アップロードエラー:', uploadError);
          setError('画像のアップロードに失敗しました。');
          return;
        }

        // 公開URLを取得
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        coverImageUrl = urlData.publicUrl;
      }

      const challengeData = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.categories[0], // 最初のカテゴリを使用
        goal_date: formData.goalDate,
        location: formData.location || undefined,
        is_public: formData.isPublic,
        status: 'planning' as const,
        cover_image: coverImageUrl || undefined, // nullをundefinedに変更
      };

      // デバッグ: チャレンジデータとcover_imageの値を確認
      console.log('チャレンジ作成データ:', challengeData);
      console.log('coverImageUrl:', coverImageUrl);

      const { data, error } = await challenges.create(challengeData);
      
      if (error) {
        console.error('チャレンジ作成エラー:', error);
        setError('チャレンジの投稿に失敗しました。もう一度お試しください。');
        return;
      }

      console.log('チャレンジ作成成功:', data);
      
      // 成功時はチャレンジ詳細ページにリダイレクト
      router.push(`/challenge/${data.id}`);
      
    } catch (err) {
      console.error('チャレンジ投稿エラー:', err);
      setError('予期しないエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGPTSuggest = () => {
    // TODO: GPT APIでタイトル提案
    const suggestions = [
      "世界一周で自分の価値観を広げる旅",
      "異文化体験を通じた自己成長の挑戦",
      "グローバルな視点を身につける冒険"
    ];
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setFormData(prev => ({ ...prev, title: randomSuggestion }));
  };

  // モバイル表示の検出
  React.useEffect(() => {
    const checkMobile = () => {
      // setIsMobileView(isMobile()); // This line is removed as per the edit hint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // モバイル用のフォームフィールド定義
  const mobileFormFields = [
    {
      name: 'categories',
      label: 'カテゴリ',
      type: 'select' as const,
      required: true,
      placeholder: 'カテゴリを選択',
      options: [
        { value: 'travel', label: '旅行・冒険' },
        { value: 'learning', label: '学習・スキル' },
        { value: 'health', label: '健康・フィットネス' },
        { value: 'career', label: 'キャリア・仕事' },
        { value: 'social', label: '社会貢献' },
        { value: 'creative', label: 'クリエイティブ' },
        { value: 'other', label: 'その他' }
      ]
    },
    {
      name: 'title',
      label: 'チャレンジタイトル',
      type: 'text' as const,
      required: true,
      placeholder: 'あなたのチャレンジを一言で表現してください'
    },
    {
      name: 'description',
      label: '詳細説明',
      type: 'textarea' as const,
      required: true,
      placeholder: 'チャレンジの詳細や目標を説明してください'
    },
    {
      name: 'goalDate',
      label: '目標達成日',
      type: 'date' as const,
      required: true
    },
    {
      name: 'location',
      label: '場所',
      type: 'location' as const,
      placeholder: 'チャレンジに関連する場所'
    }
  ];

  const handleMobileSubmit = (data: Record<string, any>) => {
    setFormData(prev => ({
      ...prev,
      categories: data.categories ? [data.categories] : [],
      title: data.title || '',
      description: data.description || '',
      goalDate: data.goalDate || '',
      location: data.location || '',
      isPublic: true
    }));
    handleSubmit();
  };

  return (
    <div style={{ background: '#fafcff', minHeight: '100vh', position: 'relative' }}>
      {/* 戻るボタン（左上） */}
      {!isMobileView && (
        <div style={{
          position: 'absolute',
          top: 24,
          left: 32,
          zIndex: 10
        }}>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              background: 'none',
              color: '#888',
              border: 'none',
              fontWeight: 500,
              fontSize: 14,
              boxShadow: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              opacity: 0.7,
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.opacity = '1')}
            onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.opacity = '0.7')}
          >← 戻る</button>
        </div>
      )}
      <div className="challenge-new-hero-message">
        <span className="challenge-new-hero-icon">🚀</span>
        新しいチャレンジを投稿する
      </div>
      <main className="challenge-new-main-top">
        <div className="challenge-new-form-card">
          {error && (
            <div className="challenge-new-error">
              <p>{error}</p>
            </div>
          )}
          {isMobileView ? (
            <MobileForm
              title="新しいチャレンジを作成"
              fields={mobileFormFields}
              onSubmit={handleMobileSubmit}
              submitLabel="チャレンジを投稿"
              loading={isSubmitting}
              initialData={{
                categories: formData.categories[0] || '',
                title: formData.title,
                description: formData.description,
                goalDate: formData.goalDate,
                location: formData.location
              }}
            />
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="challenge-new-form-layout">
              <CategorySelect
                selectedCategories={formData.categories}
                onCategoryChange={(categories) => setFormData(prev => ({ ...prev, categories }))}
              />
              <TitleInput
                title={formData.title}
                onTitleChange={(title) => setFormData(prev => ({ ...prev, title }))}
                onGPTSuggest={handleGPTSuggest}
              />
              <DescriptionInput
                description={formData.description}
                onDescriptionChange={(description) => setFormData(prev => ({ ...prev, description }))}
              />
              <GoalDateInput
                goalDate={formData.goalDate}
                onGoalDateChange={(goalDate) => setFormData(prev => ({ ...prev, goalDate }))}
              />
              <LocationInput
                location={formData.location}
                onLocationChange={(location) => setFormData(prev => ({ ...prev, location }))}
              />
              <PrivacySettings
                isPublic={formData.isPublic}
                onPrivacyChange={(isPublic) => setFormData(prev => ({ ...prev, isPublic }))}
              />
              <ImageUploader
                onImageChange={(coverImage) => setFormData(prev => ({ ...prev, coverImage }))}
              />
              <SubmitButton
                onSubmit={handleSubmit}
                isValid={isValid}
                isSubmitting={isSubmitting}
              />
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChallengeNewLayout; 