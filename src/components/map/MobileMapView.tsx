"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { isMobile, isTouchDevice, mobileMapControls } from '@/lib/mobile-utils';

// Leafletのデフォルトアイコンを修正
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Challenge {
  id: string;
  title: string;
  description: string;
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

interface ProgressUpdate {
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

interface MobileMapViewProps {
  challenges: Challenge[];
  progressUpdates: ProgressUpdate[];
  onMarkerClick?: (item: Challenge | ProgressUpdate, type: 'challenge' | 'progress') => void;
}

// 地図コントロールコンポーネント
const MapControls: React.FC<{ onLocationClick: () => void }> = ({ onLocationClick }) => {
  const map = useMap();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const mapContainer = map.getContainer().parentElement;
    if (!mapContainer) return;

    if (!isFullscreen) {
      if (mapContainer.requestFullscreen) {
        mapContainer.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const zoomIn = () => map.zoomIn();
  const zoomOut = () => map.zoomOut();

  return (
    <>
      {/* ズームコントロール */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <button
          onClick={zoomIn}
          style={{
            width: '40px',
            height: '40px',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            ...(isTouchDevice() && {
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none'
            })
          }}
          onTouchStart={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          +
        </button>
        <button
          onClick={zoomOut}
          style={{
            width: '40px',
            height: '40px',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            ...(isTouchDevice() && {
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none'
            })
          }}
          onTouchStart={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          −
        </button>
      </div>

      {/* 現在地ボタン */}
      <button
        onClick={onLocationClick}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: '#fff',
          border: '1px solid #ddd',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          fontSize: '20px',
          ...(isTouchDevice() && {
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none'
          })
        }}
        onTouchStart={(e) => {
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        📍
      </button>

      {/* フルスクリーンボタン（モバイルのみ） */}
      {isMobile() && (
        <button
          onClick={toggleFullscreen}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            width: '40px',
            height: '40px',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            ...(isTouchDevice() && {
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none'
            })
          }}
          onTouchStart={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isFullscreen ? '⤓' : '⤢'}
        </button>
      )}
    </>
  );
};

// カスタムマーカーアイコン
const createCustomIcon = (type: 'challenge' | 'progress') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 24px;
      height: 24px;
      background: ${type === 'challenge' ? '#1890ff' : '#52c41a'};
      border: 2px solid #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">${type === 'challenge' ? '🎯' : '📝'}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const MobileMapView: React.FC<MobileMapViewProps> = ({
  challenges,
  progressUpdates,
  onMarkerClick
}) => {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [selectedItem, setSelectedItem] = useState<Challenge | ProgressUpdate | null>(null);
  const [selectedType, setSelectedType] = useState<'challenge' | 'progress' | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // 現在地を取得
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
        },
        (error) => {
          console.log('位置情報の取得に失敗しました:', error);
        }
      );
    }
  }, []);

  const handleLocationClick = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.setView(currentLocation, 15);
    }
  };

  const handleMarkerClick = (item: Challenge | ProgressUpdate, type: 'challenge' | 'progress') => {
    setSelectedItem(item);
    setSelectedType(type);
    if (onMarkerClick) {
      onMarkerClick(item, type);
    }
  };

  const closePopup = () => {
    setSelectedItem(null);
    setSelectedType(null);
  };

  // デフォルトの中心位置（東京）
  const defaultCenter: [number, number] = [35.6762, 139.6503];

  return (
    <div style={{
      position: 'relative',
      height: isMobile() ? '60vh' : '70vh',
      width: '100%',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
    }}>
      <MapContainer
        center={currentLocation || defaultCenter}
        zoom={currentLocation ? 15 : 10}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        zoomControl={false} // カスタムコントロールを使用
        doubleClickZoom={false} // モバイルで誤操作を防ぐ
        tap={true} // タッチ操作を有効化
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* チャレンジマーカー */}
        {challenges.map((challenge) => (
          <Marker
            key={`challenge-${challenge.id}`}
            position={[challenge.location.lat, challenge.location.lng]}
            icon={createCustomIcon('challenge')}
            eventHandlers={{
              click: () => handleMarkerClick(challenge, 'challenge')
            }}
          >
            <Popup>
              <div style={{
                padding: '8px',
                minWidth: '200px'
              }}>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {challenge.title}
                </h3>
                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  {challenge.description.substring(0, 100)}...
                </p>
                <div style={{
                  fontSize: '12px',
                  color: '#999'
                }}>
                  by {challenge.user.username}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 進捗マーカー */}
        {progressUpdates.map((progress) => (
          <Marker
            key={`progress-${progress.id}`}
            position={[progress.location.lat, progress.location.lng]}
            icon={createCustomIcon('progress')}
            eventHandlers={{
              click: () => handleMarkerClick(progress, 'progress')
            }}
          >
            <Popup>
              <div style={{
                padding: '8px',
                minWidth: '200px'
              }}>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {progress.challenge.title}
                </h3>
                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  {progress.content.substring(0, 100)}...
                </p>
                <div style={{
                  fontSize: '12px',
                  color: '#999'
                }}>
                  by {progress.user.username}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapControls onLocationClick={handleLocationClick} />
      </MapContainer>

      {/* モバイル用の詳細表示オーバーレイ */}
      {selectedItem && isMobile() && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          padding: '20px',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          maxHeight: '50vh',
          overflow: 'auto'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              {selectedType === 'challenge' 
                ? (selectedItem as Challenge).title
                : (selectedItem as ProgressUpdate).challenge.title
              }
            </h3>
            <button
              onClick={closePopup}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px'
              }}
            >
              ✕
            </button>
          </div>
          
          <div style={{
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#333',
            marginBottom: '12px'
          }}>
            {selectedType === 'challenge' 
              ? (selectedItem as Challenge).description
              : (selectedItem as ProgressUpdate).content
            }
          </div>
          
          <div style={{
            fontSize: '12px',
            color: '#666',
            marginBottom: '16px'
          }}>
            📍 {selectedItem.location.address}
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: '#999'
          }}>
            <span>by {selectedItem.user.username}</span>
            <span>{new Date(selectedItem.created_at).toLocaleDateString('ja-JP')}</span>
          </div>
        </div>
      )}

      {/* マーカー統計表示 */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#666',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        🎯 {challenges.length} チャレンジ | 📝 {progressUpdates.length} 進捗
      </div>
    </div>
  );
};

export default MobileMapView; 