"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '@/components/search/SearchBar';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';
import SearchLayout from '@/components/search/SearchLayout';
import MobileNavigation from '@/components/common/MobileNavigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchType, setSearchType] = useState<'all' | 'challenges' | 'users' | 'categories' | 'locations'>(
    (searchParams.get('type') as any) || 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  // URLパラメータから初期値を設定
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const type = (searchParams.get('type') as any) || 'all';
    const category = searchParams.get('category') || '';
    const location = searchParams.get('location') || '';

    setSearchQuery(query);
    setSearchType(type);
    setSelectedCategory(category);
    setSelectedLocation(location);

    // 初期検索実行
    if (query || category || location) {
      performSearch(query, type, category, location);
    }
  }, [searchParams]);

  const performSearch = async (
    query: string, 
    type: string, 
    category: string, 
    location: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (type) params.append('type', type);
      if (category) params.append('category', category);
      if (location) params.append('location', location);

      const response = await fetch(`/api/search?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || {});
      } else {
        const errorData = await response.json();
        setError(errorData.error || '検索に失敗しました');
      }
    } catch (error) {
      console.error('検索エラー:', error);
      setError('ネットワークエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateURLAndSearch(query, searchType, selectedCategory, selectedLocation);
  };

  const handleTypeChange = (type: 'all' | 'challenges' | 'users' | 'categories' | 'locations') => {
    setSearchType(type);
    updateURLAndSearch(searchQuery, type, selectedCategory, selectedLocation);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateURLAndSearch(searchQuery, searchType, category, selectedLocation);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    updateURLAndSearch(searchQuery, searchType, selectedCategory, location);
  };

  const updateURLAndSearch = (
    query: string, 
    type: string, 
    category: string, 
    location: string
  ) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (type && type !== 'all') params.append('type', type);
    if (category) params.append('category', category);
    if (location) params.append('location', location);

    const newURL = params.toString() ? `/search?${params.toString()}` : '/search';
    router.push(newURL);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSearchType('all');
    setSelectedCategory('');
    setSelectedLocation('');
    setResults({});
    router.push('/search');
  };

  return (
    <>
      <SearchLayout>
        <SearchBar 
          value={searchQuery}
          onSearch={handleSearch}
          placeholder="チャレンジ、ユーザー、地域を検索..."
        />
        <SearchFilters
          searchType={searchType}
          selectedCategory={selectedCategory}
          selectedLocation={selectedLocation}
          onTypeChange={handleTypeChange}
          onCategoryChange={handleCategoryChange}
          onLocationChange={handleLocationChange}
          onClearFilters={clearFilters}
        />
        <SearchResults
          results={results}
          searchType={searchType}
          isLoading={isLoading}
          error={error}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedLocation={selectedLocation}
        />
      </SearchLayout>
      <MobileNavigation />
    </>
  );
} 