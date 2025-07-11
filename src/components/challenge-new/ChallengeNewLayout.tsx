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

const ChallengeNewLayout = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  
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
  
  const [formData, setFormData] = useState({
    categories: [] as string[],
    title: "",
    description: "",
    goalDate: "",
    location: null as { lat: number; lng: number; address: string } | null,
    isPublic: true,
    coverImage: null as File | null
  });

  const [isMobileView, setIsMobileView] = useState(false);
  const mobileStyles = getMobileStyles();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = formData.categories.length > 0 && 
                 formData.title.length > 0 && 
                 formData.description.length > 0 && 
                 formData.goalDate.length > 0;

  const handleSubmit = async () => {
    if (!isValid || !user) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // チャレンジデータの作成
      const challengeData = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.categories[0], // 最初のカテゴリを使用
        goal_date: formData.goalDate,
        location: formData.location || undefined,
        is_public: formData.isPublic,
        status: 'planning' as const,
      };

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
      setIsMobileView(isMobile());
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
    <div style={{ 
      background: '#fafcff', 
      minHeight: '100vh',
      ...(isMobileView && { paddingBottom: '80px' })
    }}>
      <main style={{ 
        maxWidth: isMobileView ? '100%' : 800, 
        margin: '0 auto', 
        padding: isMobileView ? '16px' : '24px' 
      }}>
        <ChallengeFormHeader />
        
        {error && (
          <div style={{
            marginBottom: '24px',
            padding: '16px',
            background: '#fff1f0',
            border: '1px solid #ffccc7',
            borderRadius: '8px'
          }}>
            <p style={{ color: '#ff4d4f', fontSize: '14px', margin: 0 }}>{error}</p>
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
          <form onSubmit={(e) => e.preventDefault()}>
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
      </main>
    </div>
  );
};

export default ChallengeNewLayout; 