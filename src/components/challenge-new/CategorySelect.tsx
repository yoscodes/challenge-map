"use client";

import React, { useState } from "react";

const categories = [
  { id: "travel", name: "旅", icon: "✈️" },
  { id: "learning", name: "学習", icon: "📚" },
  { id: "health", name: "健康", icon: "💪" },
  { id: "career", name: "キャリア", icon: "💼" },
  { id: "creative", name: "創作", icon: "🎨" },
  { id: "social", name: "社会貢献", icon: "🤝" },
  { id: "finance", name: "お金", icon: "💰" },
  { id: "other", name: "その他", icon: "🌟" }
];

type CategorySelectProps = {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
};

const CategorySelect = ({ selectedCategories, onCategoryChange }: CategorySelectProps) => {
  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };

  return (
    <section className="category-section">
      <h2 className="category-title">
        <span className="category-badge">🏷 カテゴリ選択（必須）</span>
      </h2>
      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`category-btn${selectedCategories.includes(category.id) ? ' selected' : ''}`}
            type="button"
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>
      {selectedCategories.length === 0 && (
        <div className="category-error">
          カテゴリを選択してください
        </div>
      )}
    </section>
  );
};

export default CategorySelect; 