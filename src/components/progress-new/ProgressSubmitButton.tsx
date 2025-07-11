"use client";

import React from "react";

type ProgressSubmitButtonProps = {
  onSubmit: () => void;
  isValid: boolean;
  isSubmitting: boolean;
};

const ProgressSubmitButton = ({ onSubmit, isValid, isSubmitting }: ProgressSubmitButtonProps) => (
  <section style={{ marginBottom: 32 }}>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button
        onClick={onSubmit}
        disabled={!isValid || isSubmitting}
        style={{
          fontSize: 20,
          padding: '20px 48px',
          background: isValid ? '#1890ff' : '#d9d9d9',
          color: '#fff',
          border: 'none',
          borderRadius: 32,
          fontWeight: 'bold',
          cursor: isValid ? 'pointer' : 'not-allowed',
          boxShadow: isValid ? '0 4px 12px rgba(24,144,255,0.3)' : 'none',
          transition: 'all 0.3s ease',
          minWidth: 300
        }}
      >
        {isSubmitting ? '投稿中...' : '✅ この進捗を記録する'}
      </button>
    </div>
    
    {!isValid && (
      <div style={{ 
        textAlign: 'center', 
        marginTop: 16, 
        color: '#ff4d4f', 
        fontSize: 14 
      }}>
        進捗内容を入力してください
      </div>
    )}
  </section>
);

export default ProgressSubmitButton; 