"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useMapEvents } from 'react-leaflet';

// 動的インポートでSSR無効化
const MapContainer = dynamic(
  () => import("react-leaflet").then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then(mod => mod.Marker),
  { ssr: false }
);

export type LocationValue = {
  lat: number;
  lng: number;
  address: string;
} | null;

type LocationInputProps = {
  location: LocationValue;
  onLocationChange: (location: LocationValue) => void;
};

const LocationMarker = ({ location, onLocationChange }: { location: LocationValue, onLocationChange: (loc: LocationValue) => void }) => {
  useMapEvents({
    click(e) {
      onLocationChange({ lat: e.latlng.lat, lng: e.latlng.lng, address: location?.address || '' });
    }
  });
  
  if (!location) return null;
  return <Marker position={[location.lat, location.lng]} />;
};

const LocationInput = ({ location, onLocationChange }: LocationInputProps) => {
  // クライアント側でのみCSSを読み込み
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet/dist/leaflet.css');
    }
  }, []);

  return (
    <section className="location-section">
      <h2 className="location-title">
        <span className="location-badge">📍 チャレンジの実施場所（任意）</span>
      </h2>
      <div className="location-field-wrap">
        <input
          type="text"
          value={location?.address || ''}
          onChange={(e) => onLocationChange(location ? { ...location, address: e.target.value } : { lat: 35.68, lng: 139.76, address: e.target.value })}
          placeholder="例：「アジア」「東京」「バンコク → チェンマイ」や住所"
          className="location-field"
        />
        <div className="location-map">
          <MapContainer center={location ? [location.lat, location.lng] : [35.68, 139.76]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker location={location} onLocationChange={onLocationChange} />
          </MapContainer>
        </div>
        <div className="location-desc">
          地図をクリックしてピンを移動できます。住所欄も自由に編集できます。
        </div>
      </div>
    </section>
  );
};

export default LocationInput; 