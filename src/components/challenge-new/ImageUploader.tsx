"use client";

import React, { useState } from "react";

type ImageUploaderProps = {
  onImageChange: (file: File | null) => void;
};

const ImageUploader = ({ onImageChange }: ImageUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
          />
        </div>
      )}
      <div className="image-hint">
        ※ Supabase Storageに保存されます
      </div>
    </section>
  );
};

export default ImageUploader; 