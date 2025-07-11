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
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        📷 カバー画像アップロード（任意）
      </h2>
      <div style={{ marginBottom: 8 }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#1890ff',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 16
          }}
        >
          ファイルを選ぶ
        </label>
      </div>
      
      {previewUrl && (
        <div style={{ marginTop: 16 }}>
          <img
            src={previewUrl}
            alt="プレビュー"
            style={{
              maxWidth: '100%',
              maxHeight: 200,
              borderRadius: 8,
              border: '1px solid #ddd'
            }}
          />
        </div>
      )}
      
      <div style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
        ※ Supabase Storageに保存されます
      </div>
    </section>
  );
};

export default ImageUploader; 