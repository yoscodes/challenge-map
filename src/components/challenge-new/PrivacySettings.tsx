"use client";

import React from "react";

type PrivacySettingsProps = {
  isPublic: boolean;
  onPrivacyChange: (isPublic: boolean) => void;
};

const PrivacySettings = ({
  isPublic,
  onPrivacyChange,
}: PrivacySettingsProps) => (
  <section className="privacy-section">
    <h2 className="privacy-title">
      <span className="privacy-badge">🔓 公開設定</span>
    </h2>
    <div className="privacy-radio-group">
      <label className="privacy-radio">
        <input
          type="radio"
          name="privacy"
          checked={isPublic}
          onChange={() => onPrivacyChange(true)}
        />
        <span>全体に公開</span>
      </label>
      <label className="privacy-radio">
        <input
          type="radio"
          name="privacy"
          checked={!isPublic}
          onChange={() => onPrivacyChange(false)}
        />
        <span>非公開（後から切り替え可）</span>
      </label>
    </div>
    <div className="privacy-hint">
      💡 非公開でも後から公開設定に変更できます。まずは非公開で始めて、慣れてきたら公開するのもおすすめです。
    </div>
  </section>
);

export default PrivacySettings;
