"use client";

import React, { useState } from "react";

type ProgressImageUploaderProps = {
  images: File[];
  onImagesChange: (images: File[]) => void;
};

const ProgressImageUploader = ({ images, onImagesChange }: ProgressImageUploaderProps) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...images, ...files].slice(0, 3); // 最大3枚
    onImagesChange(newImages);
    
    // プレビューURL生成
    const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    
    const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
  };

  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        📷 画像アップロード（最大3枚）
      </h2>
      
      <div style={{ marginBottom: 16 }}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="progress-image-upload"
          disabled={images.length >= 3}
        />
        <label
          htmlFor="progress-image-upload"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: images.length >= 3 ? '#d9d9d9' : '#1890ff',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: images.length >= 3 ? 'not-allowed' : 'pointer',
            fontSize: 16
          }}
        >
          {images.length >= 3 ? '画像数上限' : '画像をドラッグ＆ドロップ / 選択'}
        </label>
      </div>
      
      {previewUrls.length > 0 && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {previewUrls.map((url, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img
                src={url}
                alt={`プレビュー ${index + 1}`}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: 'cover',
                  borderRadius: 8,
                  border: '1px solid #ddd'
                }}
              />
              <button
                onClick={() => removeImage(index)}
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  width: 24,
                  height: 24,
                  background: '#ff4d4f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: 12
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
        {images.length}/3枚
      </div>
    </section>
  );
};

export default ProgressImageUploader; 