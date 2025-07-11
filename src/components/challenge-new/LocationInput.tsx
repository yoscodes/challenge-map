"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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

const LocationInput = ({ location, onLocationChange }: LocationInputProps) => (
  <section style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
      📍 チャレンジの実施場所（任意）
    </h2>
    <div style={{ marginBottom: 8 }}>
      <input
        type="text"
        value={location?.address || ''}
        onChange={(e) => onLocationChange(location ? { ...location, address: e.target.value } : { lat: 35.68, lng: 139.76, address: e.target.value })}
        placeholder="例：「アジア」「東京」「バンコク → チェンマイ」や住所"
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid #ddd',
          borderRadius: 8,
          fontSize: 16,
          boxSizing: 'border-box',
          marginBottom: 8
        }}
      />
      <div style={{ height: 240, borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
        <MapContainer center={location ? [location.lat, location.lng] : [35.68, 139.76]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker location={location} onLocationChange={onLocationChange} />
        </MapContainer>
      </div>
      <div style={{ fontSize: 13, color: '#888' }}>
        地図をクリックしてピンを移動できます。住所欄も自由に編集できます。
      </div>
    </div>
  </section>
);

export default LocationInput; 