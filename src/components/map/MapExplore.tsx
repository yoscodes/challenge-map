"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/lib/supabase';
import { isMobile, getMobileStyles } from '@/lib/mobile-utils';
import MobileMapView from './MobileMapView';

// 型定義
interface ChallengeData {
  id: string;
  title: string;
  description: string;
  category: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  user: {
    username: string;
  };
  created_at: string;
}

interface ProgressData {
  id: string;
  content: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  challenge: {
    title: string;
  };
  user: {
    username: string;
  };
  created_at: string;
}

const MapExplore = () => {
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [progresses, setProgresses] = useState<ProgressData[]>([]);
  const [area, setArea] = useState('');
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const mobileStyles = getMobileStyles();

  // カテゴリ一覧仮
  const categories = ['旅', '学習', '健康', 'その他'];

  // フィルタリング
  const filteredChallenges = challenges.filter(c => {
    const areaMatch = area === '' || (c.location?.address && c.location.address.includes(area));
    const categoryMatch = category === '' || (c.category && c.category === category);
    const keywordMatch = keyword === '' || (c.title && c.title.includes(keyword));
    return areaMatch && categoryMatch && keywordMatch;
  });
  const filteredProgresses = progresses.filter(p => {
    const areaMatch = area === '' || (p.location?.address && p.location.address.includes(area));
    const keywordMatch = keyword === '' || (p.content && p.content.includes(keyword));
    return areaMatch && keywordMatch;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(isMobile());
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: ch, error: chError } = await supabase.from('challenges').select('id, title, description, category, location, created_at, users(username)').not('location', 'is', null);
        const { data: pr, error: prError } = await supabase.from('progress_updates').select('id, content, location, created_at, challenges(title), users(username)').not('location', 'is', null);
        
        if (chError) {
          console.error('チャレンジデータ取得エラー:', chError);
        }
        if (prError) {
          console.error('進捗データ取得エラー:', prError);
        }
        
        // データ構造を整形
        const formattedChallenges = (ch || []).map(challenge => ({
          id: challenge.id,
          title: challenge.title || 'Unknown Challenge',
          description: challenge.description || '',
          category: challenge.category,
          location: challenge.location,
          user: {
            username: (challenge.users as any)?.username || 'Unknown User'
          },
          created_at: challenge.created_at || new Date().toISOString()
        })) as ChallengeData[];
        
        const formattedProgresses = (pr || []).map(progress => ({
          id: progress.id,
          content: progress.content || '',
          location: progress.location,
          challenge: { 
            title: (progress.challenges as any)?.title || 'Unknown Challenge' 
          },
          user: {
            username: (progress.users as any)?.username || 'Unknown User'
          },
          created_at: progress.created_at || new Date().toISOString()
        })) as ProgressData[];
        
        setChallenges(formattedChallenges);
        setProgresses(formattedProgresses);
      } catch (error) {
        console.error('データ取得エラー:', error);
        setChallenges([]);
        setProgresses([]);
      }
    };
    fetchData();
  }, []);

  return (
    <main style={{ 
      maxWidth: isMobileView ? '100%' : 1200, 
      margin: '0 auto', 
      padding: isMobileView ? '16px' : 24,
      ...(isMobileView && { paddingBottom: '80px' })
    }}>
      <h1 style={{ 
        fontSize: isMobileView ? '24px' : '28px', 
        fontWeight: 'bold', 
        marginBottom: '16px' 
      }}>
        🗺 地図から探す
      </h1>
      
      {isMobileView ? (
        <MobileMapView
          challenges={filteredChallenges}
          progressUpdates={filteredProgresses}
          onMarkerClick={(item, type) => {
            console.log(`${type}:`, item);
          }}
        />
      ) : (
        <>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <input
              type="text"
              value={area}
              onChange={e => setArea(e.target.value)}
              placeholder="地域で絞り込み（例：東京、大阪、北海道...）"
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 180 }}
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            >
              <option value="">全カテゴリ</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="キーワード検索"
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', minWidth: 180 }}
            />
          </div>
          <div style={{ height: 600, borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
            <MapContainer center={[35.68, 139.76]} zoom={4} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {filteredChallenges.map((c) => c.location && (
                <Marker key={c.id} position={[c.location.lat, c.location.lng]}>
                  <Popup>
                    <b>チャレンジ</b><br />
                    {c.title}<br />
                    {c.user?.username && <>by @{c.user.username}<br /></>}
                    {c.location.address && <span>{c.location.address}</span>}
                  </Popup>
                </Marker>
              ))}
              {filteredProgresses.map((p) => p.location && (
                <Marker key={p.id} position={[p.location.lat, p.location.lng]}>
                  <Popup>
                    <b>進捗</b><br />
                    {p.content && p.content.slice(0, 40)}<br />
                    {p.user?.username && <>by @{p.user.username}<br /></>}
                    {p.location.address && <span>{p.location.address}</span>}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </>
      )}
    </main>
  );
};

export default MapExplore; 