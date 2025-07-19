"use client";

import React, { useState } from "react";

type ImageUploaderProps = {
  onImageChange: (file: File | null) => void;
  initialImageUrl?: string | null;
};

const ImageUploader = ({ onImageChange, initialImageUrl }: ImageUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);

  // initialImageUrlが変更されたときにpreviewUrlを更新
  React.useEffect(() => {
    setPreviewUrl(initialImageUrl || null);
  }, [initialImageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageChange(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <section className="image-section">
      <h2 className="image-title">
        <span className="image-badge">📷 カバー画像アップロード（任意）</span>
      </h2>
      <div className="image-upload-wrap">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="image-upload-label"
        >
          ファイルを選ぶ
        </label>
      </div>
      {previewUrl && (
        <div className="image-preview">
          <img
            src={previewUrl}
            alt="プレビュー"
            style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, border: '1px solid #ddd' }}
          />
        </div>
      )}
    </section>
  );
};

export default ImageUploader; 