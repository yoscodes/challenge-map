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
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        🏷 カテゴリ選択（必須）
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            style={{
              padding: '12px 20px',
              border: selectedCategories.includes(category.id) 
                ? '2px solid #1890ff' 
                : '2px solid #ddd',
              borderRadius: 8,
              background: selectedCategories.includes(category.id) 
                ? '#e6f7ff' 
                : '#fff',
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: selectedCategories.includes(category.id) ? 'bold' : 'normal',
              transition: 'all 0.2s ease'
            }}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>
      {selectedCategories.length === 0 && (
        <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 8 }}>
          カテゴリを選択してください
        </div>
      )}
    </section>
  );
};

export default CategorySelect; 