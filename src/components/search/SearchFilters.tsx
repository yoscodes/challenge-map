"use client";

import React, { useState, useEffect } from 'react';

interface SearchFiltersProps {
  searchType: 'all' | 'challenges' | 'users' | 'categories' | 'locations';
  selectedCategory: string;
  selectedLocation: string;
  onTypeChange: (type: 'all' | 'challenges' | 'users' | 'categories' | 'locations') => void;
  onCategoryChange: (category: string) => void;
  onLocationChange: (location: string) => void;
  onClearFilters: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchType,
  selectedCategory,
  selectedLocation,
  onTypeChange,
  onCategoryChange,
  onLocationChange,
  onClearFilters
}) => {
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  // カテゴリ一覧取得
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await fetch('/api/search?type=categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.results?.categories || []);
        } else {
          console.error('カテゴリ取得エラー:', response.status, response.statusText);
          setCategories([]);
        }
      } catch (error) {
        console.error('カテゴリ取得エラー:', error);
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // 地域一覧取得
  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const response = await fetch('/api/search?type=locations');
        if (response.ok) {
          const data = await response.json();
          const locationAddresses = (data.results?.locations || [])
            .map((item: any) => item.location?.address)
            .filter((address: any): address is string => Boolean(address));
          setLocations([...new Set(locationAddresses)] as string[]);
        } else {
          console.error('地域取得エラー:', response.status, response.statusText);
          setLocations([]);
        }
      } catch (error) {
        console.error('地域取得エラー:', error);
        setLocations([]);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  const searchTypeOptions = [
    { value: 'all', label: 'すべて', icon: '🔍' },
    { value: 'challenges', label: 'チャレンジ', icon: '🎯' },
    { value: 'users', label: 'ユーザー', icon: '👥' },
    { value: 'categories', label: 'カテゴリ', icon: '📂' },
    { value: 'locations', label: '地域', icon: '📍' }
  ];

  const hasActiveFilters = searchType !== 'all' || selectedCategory || selectedLocation;

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #eee',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>
      {/* ヘッダー */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          🔧 フィルター
        </h3>
        
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            style={{
              background: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              color: '#666',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e8e8e8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f5f5f5';
            }}
          >
            クリア
          </button>
        )}
      </div>

      {/* 検索タイプ */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '8px'
        }}>
          検索タイプ
        </label>
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {searchTypeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onTypeChange(option.value as any)}
              style={{
                background: searchType === option.value ? '#1890ff' : '#f5f5f5',
                color: searchType === option.value ? '#fff' : '#333',
                border: '1px solid',
                borderColor: searchType === option.value ? '#1890ff' : '#ddd',
                borderRadius: '20px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                if (searchType !== option.value) {
                  e.currentTarget.style.background = '#e6f7ff';
                  e.currentTarget.style.borderColor = '#1890ff';
                }
              }}
              onMouseLeave={(e) => {
                if (searchType !== option.value) {
                  e.currentTarget.style.background = '#f5f5f5';
                  e.currentTarget.style.borderColor = '#ddd';
                }
              }}
            >
              <span>{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* カテゴリフィルター */}
      {(searchType === 'all' || searchType === 'challenges') && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '8px'
          }}>
            カテゴリ
          </label>
          {isLoadingCategories ? (
            <div style={{ color: '#666', fontSize: '14px' }}>読み込み中...</div>
          ) : (
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                background: '#fff',
                color: '#333'
              }}
            >
              <option value="">すべてのカテゴリ</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* 地域フィルター */}
      {(searchType === 'all' || searchType === 'locations') && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '8px'
          }}>
            地域
          </label>
          {isLoadingLocations ? (
            <div style={{ color: '#666', fontSize: '14px' }}>読み込み中...</div>
          ) : (
            <select
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                background: '#fff',
                color: '#333'
              }}
            >
              <option value="">すべての地域</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* アクティブフィルター表示 */}
      {hasActiveFilters && (
        <div style={{
          padding: '12px',
          background: '#f0f8ff',
          borderRadius: '6px',
          border: '1px solid #d6e4ff'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#1890ff',
            marginBottom: '8px'
          }}>
            アクティブフィルター:
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            {searchType !== 'all' && (
              <div>• タイプ: {searchTypeOptions.find(opt => opt.value === searchType)?.label}</div>
            )}
            {selectedCategory && (
              <div>• カテゴリ: {selectedCategory}</div>
            )}
            {selectedLocation && (
              <div>• 地域: {selectedLocation}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters; 