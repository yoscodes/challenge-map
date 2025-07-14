import React from "react";

const categories = ["旅", "学習", "健康"];

const SearchBar = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 32 }}>
    <input type="text" placeholder="キーワード検索" style={{ padding: '12px 20px', borderRadius: 18, border: '1.5px solid #cbd5e1', minWidth: 220, fontSize: 16, background: '#fff', boxShadow: '0 2px 8px #2563eb11', outline: 'none', transition: 'border 0.2s' }} />
    {categories.map((cat) => (
      <button key={cat} style={{ padding: '10px 22px', borderRadius: 22, border: 'none', background: 'linear-gradient(90deg,#2563eb,#60a5fa)', color: '#fff', fontWeight: 600, fontSize: 15, boxShadow: '0 2px 8px #2563eb11', cursor: 'pointer', letterSpacing: '0.02em', transition: 'filter 0.2s' }}>{cat}</button>
    ))}
  </div>
);

export default SearchBar; 