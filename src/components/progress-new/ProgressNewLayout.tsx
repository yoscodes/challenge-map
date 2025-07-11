"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { progressUpdates, challenges } from "@/lib/database";
import { uploadImageToStorage, getImageUrlFromStorage, deleteImageFromStorage } from "@/lib/storage";
import ProgressFormHeader from "./ProgressFormHeader";
import ContentInput from "./ContentInput";
import ProgressImageUploader from "./ProgressImageUploader";
import LocationInput from "./LocationInput";
import DateInput from "./DateInput";
import GPTAssistButtons from "./GPTAssistButtons";
import ProgressSubmitButton from "./ProgressSubmitButton";

const ProgressNewLayout = () => {
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    content: "",
    images: [] as File[],
    location: "",
    date: "",
  });

  const [challengeTitle, setChallengeTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const challengeId = params.id as string;
  const isValid = formData.content.length > 0;

  // 画像プレビュー生成
  useEffect(() => {
    if (selectedFiles.length === 0) {
      setPreviewUrls([]);
      return;
    }
    const urls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [selectedFiles]);

  // ファイル選択ハンドラ
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  // 画像削除ハンドラ
  const handleDeleteImage = async (imgPath: string, idx: number) => {
    const ok = window.confirm("この画像を本当に削除しますか？");
    if (!ok) return;
    try {
      await deleteImageFromStorage(imgPath);
      const newFiles = [...selectedFiles];
      newFiles.splice(idx, 1);
      setSelectedFiles(newFiles);
      // プレビューURLも更新
      const newPreviews = [...previewUrls];
      newPreviews.splice(idx, 1);
      setPreviewUrls(newPreviews);
    } catch (err) {
      alert("画像の削除に失敗しました");
    }
  };

  const handleSubmit = async () => {
    if (!isValid || !user || !challengeId) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // 画像アップロード
      let imagePaths: string[] = [];
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const { data, error } = await uploadImageToStorage(file, challengeId);
          if (error) throw new Error(error);
          if (data && data.path) imagePaths.push(data.path);
        }
      }

      // 進捗データの作成
      const progressData = {
        challenge_id: challengeId,
        user_id: user.id,
        content: formData.content,
        images: imagePaths.length > 0 ? imagePaths : undefined,
        location: formData.location ? {
          address: formData.location,
          lat: 0, // TODO: 地理的座標の取得
          lng: 0
        } : undefined,
      };

      const { data, error } = await progressUpdates.create(progressData);
      
      if (error) {
        console.error('進捗投稿エラー:', error);
        setError('進捗の投稿に失敗しました。もう一度お試しください。');
        return;
      }

      console.log('進捗投稿成功:', data);
      
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

  return (
    <div style={{ background: '#fafcff', minHeight: '100vh' }}>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
        <ProgressFormHeader challengeTitle={challengeTitle} />
        
        <form onSubmit={(e) => e.preventDefault()}>
          <ContentInput
            content={formData.content}
            onContentChange={(content) => setFormData(prev => ({ ...prev, content }))}
          />
          
          <ProgressImageUploader
            images={selectedFiles}
            onImagesChange={setSelectedFiles}
          />
          
          <LocationInput
            location={formData.location}
            onLocationChange={(location) => setFormData(prev => ({ ...prev, location }))}
          />
          
          <DateInput
            date={formData.date}
            onDateChange={(date) => setFormData(prev => ({ ...prev, date }))}
          />
          
          <GPTAssistButtons
            onSNSFormat={handleSNSFormat}
            onPositiveRewrite={handlePositiveRewrite}
          />
          
          <ProgressSubmitButton
            onSubmit={handleSubmit}
            isValid={isValid}
            isSubmitting={isSubmitting}
          />
        </form>
      </main>
    </div>
  );
};

export default ProgressNewLayout; 