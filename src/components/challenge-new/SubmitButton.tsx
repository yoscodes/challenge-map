"use client";

import React from "react";

type SubmitButtonProps = {
  onSubmit: () => void;
  isValid: boolean;
  isSubmitting: boolean;
};

const SubmitButton = ({ onSubmit, isValid, isSubmitting }: SubmitButtonProps) => (
  <section style={{ marginBottom: 32 }}>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button
        onClick={onSubmit}
        disabled={!isValid || isSubmitting}
        style={{
          fontSize: 20,
          padding: '20px 48px',
          background: isValid ? '#52c41a' : '#d9d9d9',
          color: '#fff',
          border: 'none',
          borderRadius: 32,
          fontWeight: 'bold',
          cursor: isValid ? 'pointer' : 'not-allowed',
          boxShadow: isValid ? '0 4px 12px rgba(82,196,26,0.3)' : 'none',
          transition: 'all 0.3s ease',
          minWidth: 300
        }}
      >
        {isSubmitting ? '投稿中...' : '✅ このチャレンジを始める'}
      </button>
    </div>
    
    {!isValid && (
      <div style={{ 
        textAlign: 'center', 
        marginTop: 16, 
        color: '#222', 
        fontSize: 14 
      }}>
        必須項目を入力してください
      </div>
    )}
  </section>
);

export default SubmitButton; 