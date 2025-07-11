"use client";

import React from "react";

type PrivacySettingsProps = {
  isPublic: boolean;
  onPrivacyChange: (isPublic: boolean) => void;
};

const PrivacySettings = ({ isPublic, onPrivacyChange }: PrivacySettingsProps) => (
  <section style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
      🔓 公開設定
    </h2>
    <div style={{ display: 'flex', gap: 16 }}>
      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <input
          type="radio"
          name="privacy"
          checked={isPublic}
          onChange={() => onPrivacyChange(true)}
          style={{ marginRight: 8 }}
        />
        <span style={{ fontSize: 16 }}>◉ 全体に公開</span>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <input
          type="radio"
          name="privacy"
          checked={!isPublic}
          onChange={() => onPrivacyChange(false)}
          style={{ marginRight: 8 }}
        />
        <span style={{ fontSize: 16 }}>◯ 非公開（後から切り替え可）</span>
      </label>
    </div>
    <div style={{ 
      marginTop: 8, 
      padding: '12px', 
      background: '#fff7e6', 
      border: '1px solid #ffd591', 
      borderRadius: 6,
      fontSize: 14,
      color: '#d46b08'
    }}>
      💡 非公開でも後から公開設定に変更できます。まずは非公開で始めて、慣れてきたら公開するのもおすすめです。
    </div>
  </section>
);

export default PrivacySettings; 