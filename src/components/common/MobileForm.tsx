"use client";

import React, { useState, useRef } from 'react';
import { isMobile, isTouchDevice, mobileFormStyles } from '@/lib/mobile-utils';

interface MobileFormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'file' | 'date' | 'location';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: (value: any) => string | null;
}

interface MobileFormProps {
  title: string;
  fields: MobileFormField[];
  onSubmit: (data: Record<string, any>) => void;
  submitLabel?: string;
  loading?: boolean;
  initialData?: Record<string, any>;
}

const MobileForm: React.FC<MobileFormProps> = ({
  title,
  fields,
  onSubmit,
  submitLabel = '送信',
  loading = false,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // バリデーション
    const field = fields.find(f => f.name === name);
    if (field?.validation) {
      const error = field.validation(formData[name]);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      const value = formData[field.name];
      
      // 必須チェック
      if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        newErrors[field.name] = `${field.label}は必須です`;
        return;
      }
      
      // カスタムバリデーション
      if (field.validation) {
        const error = field.validation(value);
        if (error) {
          newErrors[field.name] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, files: Array.from(files) }));
    }
  };

  const renderField = (field: MobileFormField) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    const isTouched = touched[field.name];

    const baseInputStyle = {
      ...mobileFormStyles.mobileInput,
      borderColor: error && isTouched ? '#ff4d4f' : '#ddd',
      ...(isTouchDevice() && {
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none' as const
      })
    };

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            placeholder={field.placeholder}
            style={baseInputStyle}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            placeholder={field.placeholder}
            style={{
              ...mobileFormStyles.mobileTextarea,
              borderColor: error && isTouched ? '#ff4d4f' : '#ddd'
            }}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            style={{
              ...baseInputStyle,
              background: '#fff'
            }}
          >
            <option value="">{field.placeholder || '選択してください'}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            style={baseInputStyle}
          />
        );

      case 'file':
        return (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                ...mobileFormStyles.mobileFileUpload,
                borderColor: error && isTouched ? '#ff4d4f' : '#ddd'
              }}
            >
              {formData.files && formData.files.length > 0 ? (
                <div>
                  <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                    📷 {formData.files.length}個のファイルが選択されました
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    タップして変更
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                    📷
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                    写真を追加
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    タップして選択
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'location':
        return (
          <div>
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              onBlur={() => handleBlur(field.name)}
              placeholder={field.placeholder || '場所を入力'}
              style={baseInputStyle}
            />
            <button
              type="button"
              onClick={() => {
                // 位置情報取得
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      const { latitude, longitude } = position.coords;
                      // 逆ジオコーディング（簡易版）
                      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                        .then(res => res.json())
                        .then(data => {
                          handleInputChange(field.name, data.display_name);
                        })
                        .catch(() => {
                          handleInputChange(field.name, `${latitude}, ${longitude}`);
                        });
                    },
                    (error) => {
                      console.log('位置情報の取得に失敗しました:', error);
                    }
                  );
                }
              }}
              style={{
                ...mobileFormStyles.mobileButton,
                marginTop: '8px',
                background: '#f0f8ff',
                color: '#1890ff',
                border: '1px solid #1890ff'
              }}
            >
              📍 現在地を取得
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      ...mobileFormStyles.mobileForm,
      maxWidth: isMobile() ? '100%' : '600px',
      margin: '0 auto'
    }}>
      <h2 style={{
        ...mobileFormStyles.mobileFontSizes?.h2,
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        {title}
      </h2>

      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name} style={mobileFormStyles.mobileFormGroup}>
            <label style={{
              ...mobileFormStyles.mobileLabel,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {field.label}
              {field.required && <span style={{ color: '#ff4d4f' }}>*</span>}
            </label>
            
            {renderField(field)}
            
            {errors[field.name] && touched[field.name] && (
              <div style={{
                fontSize: '12px',
                color: '#ff4d4f',
                marginTop: '4px'
              }}>
                {errors[field.name]}
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          style={{
            ...mobileFormStyles.mobileButton,
            background: loading ? '#ccc' : '#1890ff',
            color: '#fff',
            width: '100%',
            marginTop: '24px',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? '送信中...' : submitLabel}
        </button>
      </form>

      {/* モバイル用のキーボード回避スペース */}
      {isMobile() && (
        <div style={{ height: '100px' }} />
      )}
    </div>
  );
};

export default MobileForm; 