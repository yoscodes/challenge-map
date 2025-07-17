"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { challenges } from "@/lib/database";
import ChallengeFormHeader from "@/components/challenge-new/ChallengeFormHeader";
import CategorySelect from "@/components/challenge-new/CategorySelect";
import TitleInput from "@/components/challenge-new/TitleInput";
import DescriptionInput from "@/components/challenge-new/DescriptionInput";
import GoalDateInput from "@/components/challenge-new/GoalDateInput";
import LocationInput from "@/components/challenge-new/LocationInput";
import PrivacySettings from "@/components/challenge-new/PrivacySettings";
import ImageUploader from "@/components/challenge-new/ImageUploader";
import { uploadImageToStorage, getImageUrlFromStorage } from "@/lib/storage";

export default function ChallengeEditPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    categories: [] as string[],
    title: "",
    description: "",
    goalDate: "",
    location: null as { lat: number; lng: number; address: string } | null,
    isPublic: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

  const challengeId = params.id as string;

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!challengeId) return;
      setIsLoading(true);
      const { data, error } = await challenges.getById(challengeId);
      setIsLoading(false);
      if (error || !data) {
        setError("チャレンジ情報の取得に失敗しました");
        return;
      }
      setFormData({
        categories: [data.category],
        title: data.title,
        description: data.description,
        goalDate: data.goal_date || "",
        location: data.location || null,
        isPublic: data.is_public,
      });
      setCoverImageUrl(data.cover_image || null);
    };
    fetchChallenge();
  }, [challengeId]);

  if (loading || isLoading) {
    return <div style={{ textAlign: 'center', padding: 40 }}>読み込み中...</div>;
  }
  if (!user) {
    router.push('/auth');
    return null;
  }

  const isValid = formData.categories.length > 0 && 
                 formData.title.length > 0 && 
                 formData.description.length > 0 && 
                 (formData.goalDate.length > 0 || formData.goalDate === 'undecided');

  const handleSubmit = async () => {
    if (!isValid || !user) return;
    setIsSubmitting(true);
    setError(null);
    try {
      let uploadedImageUrl = coverImageUrl;
      if (coverImageFile) {
        const ext = coverImageFile.name.split('.').pop();
        const filePath = `${user.id}_${Date.now()}.${ext}`;
        const { error: uploadError } = await uploadImageToStorage(coverImageFile, filePath, 'avatars');
        if (uploadError) {
          setError('画像のアップロードに失敗しました');
          setIsSubmitting(false);
          return;
        }
        uploadedImageUrl = getImageUrlFromStorage(filePath, 'avatars');
      }
      const updateData = {
        title: formData.title,
        description: formData.description,
        category: formData.categories[0],
        goal_date: formData.goalDate,
        location: formData.location || undefined,
        is_public: formData.isPublic,
        cover_image: uploadedImageUrl || undefined,
      };
      const { error } = await challenges.update(challengeId, updateData);
      if (error) {
        setError('チャレンジの更新に失敗しました。もう一度お試しください。');
        return;
      }
      router.push(`/challenge/${challengeId}`);
    } catch (err) {
      setError('予期しないエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#fafcff', minHeight: '100vh' }}>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
        <ChallengeFormHeader />
        {error && (
          <div style={{ marginBottom: '24px', padding: '16px', background: '#fff1f0', border: '1px solid #ffccc7', borderRadius: '8px' }}>
            <p style={{ color: '#ff4d4f', fontSize: '14px', margin: 0 }}>{error}</p>
          </div>
        )}
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <ImageUploader
            onImageChange={file => {
              setCoverImageFile(file);
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => setCoverImageUrl(e.target?.result as string);
                reader.readAsDataURL(file);
              }
            }}
          />
          {coverImageUrl && (
            <div style={{ marginBottom: 16 }}>
              <img src={coverImageUrl} alt="カバー画像プレビュー" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, border: '1px solid #ddd' }} />
            </div>
          )}
          <CategorySelect
            selectedCategories={formData.categories}
            onCategoryChange={categories => setFormData(prev => ({ ...prev, categories }))}
          />
          <TitleInput
            title={formData.title}
            onTitleChange={title => setFormData(prev => ({ ...prev, title }))}
            onGPTSuggest={() => {}}
          />
          <DescriptionInput
            description={formData.description}
            onDescriptionChange={description => setFormData(prev => ({ ...prev, description }))}
          />
          <GoalDateInput
            goalDate={formData.goalDate}
            onGoalDateChange={goalDate => setFormData(prev => ({ ...prev, goalDate }))}
          />
          <LocationInput
            location={formData.location}
            onLocationChange={location => setFormData(prev => ({ ...prev, location }))}
          />
          <PrivacySettings
            isPublic={formData.isPublic}
            onPrivacyChange={isPublic => setFormData(prev => ({ ...prev, isPublic }))}
          />
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              style={{
                padding: '12px 48px',
                borderRadius: 32,
                background: isValid && !isSubmitting ? '#1890ff' : '#d9d9d9',
                color: '#fff',
                border: 'none',
                fontWeight: 'bold',
                fontSize: 18,
                cursor: isValid && !isSubmitting ? 'pointer' : 'not-allowed',
                boxShadow: '0 2px 8px rgba(24,144,255,0.15)'
              }}
            >
              {isSubmitting ? '保存中...' : '変更を保存'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
} 