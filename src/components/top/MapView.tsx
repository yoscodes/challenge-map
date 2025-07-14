'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React from 'react';

type LocationPin = {
  id: string;
  lat: number;
  lng: number;
  address: string;
  title: string;
};

interface MapViewProps {
  locations: LocationPin[];
}

// デフォルトアイコンの修正（Vite/Next.jsでアイコンが表示されない問題対策）
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapView = ({ locations }: MapViewProps) => (
  <div style={{ background: '#e6f7ff', borderRadius: 12, height: 320, padding: 0, overflow: 'hidden' }}>
    <MapContainer center={[35.681236, 139.767125]} zoom={5} style={{ height: 320, width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations && locations.map(loc => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]}>
          <Popup>
            <b>{loc.title}</b><br />
            {loc.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  </div>
);

export default MapView; 