"use client";

import React, { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  value: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onSearch, 
  placeholder = "検索...",
  autoFocus = false
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 外部から渡されたvalueが変更された場合、inputValueを更新
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // 自動フォーカス
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div style={{
      position: 'relative',
      maxWidth: '600px',
      margin: '0 auto',
      width: '100%'
    }}>
      <form onSubmit={handleSubmit}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          border: `2px solid ${isFocused ? '#1890ff' : '#e8e8e8'}`,
          borderRadius: '12px',
          padding: '4px',
          transition: 'all 0.2s ease',
          boxShadow: isFocused ? '0 4px 12px rgba(24, 144, 255, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          {/* 検索アイコン */}
          <div style={{
            padding: '0 12px',
            color: isFocused ? '#1890ff' : '#999',
            fontSize: '18px'
          }}>
            🔍
          </div>

          {/* 入力フィールド */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              padding: '12px 0',
              background: 'transparent',
              color: '#333'
            }}
          />

          {/* クリアボタン */}
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
                color: '#999',
                fontSize: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
                e.currentTarget.style.color = '#666';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#999';
              }}
            >
              ✕
            </button>
          )}

          {/* 検索ボタン */}
          <button
            type="submit"
            disabled={!inputValue.trim()}
            style={{
              background: inputValue.trim() ? '#1890ff' : '#f5f5f5',
              color: inputValue.trim() ? '#fff' : '#999',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              marginLeft: '8px'
            }}
            onMouseEnter={(e) => {
              if (inputValue.trim()) {
                e.currentTarget.style.background = '#096dd9';
              }
            }}
            onMouseLeave={(e) => {
              if (inputValue.trim()) {
                e.currentTarget.style.background = '#1890ff';
              }
            }}
          >
            検索
          </button>
        </div>
      </form>

      {/* 検索のヒント */}
      {!inputValue && (
        <div style={{
          marginTop: '12px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#666'
        }}>
          <div style={{ marginBottom: '4px' }}>
            💡 検索のヒント:
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span>🏃‍♂️ ランニング</span>
            <span>📚 勉強</span>
            <span>🍳 料理</span>
            <span>🎨 アート</span>
            <span>🌍 旅行</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 