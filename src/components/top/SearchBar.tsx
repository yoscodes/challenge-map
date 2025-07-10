import React from "react";

const categories = ["旅", "学習", "健康"];

const SearchBar = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
    <input type="text" placeholder="キーワード検索" style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 200 }} />
    {categories.map((cat) => (
      <button key={cat} style={{ padding: '8px 16px', borderRadius: 16, border: '1px solid #ddd', background: '#f5f5f5' }}>{cat}</button>
    ))}
  </div>
);

export default SearchBar; 