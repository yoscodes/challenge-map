"use client";
import React from "react";
// 地図ライブラリ例: react-leaflet
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type Progress = {
  id: string;
  title?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  date?: string;
};

type UserTrajectoryMapProps = {
  progresses: Progress[];
};

const UserTrajectoryMap = ({ progresses }: UserTrajectoryMapProps) => {
  // 位置情報がある進捗のみ抽出
  const points = progresses.filter(p => p.location && p.location.lat && p.location.lng);
  if (points.length === 0) {
    return <div style={{textAlign:'center',color:'#888',margin:'24px 0'}}>位置情報付き進捗がありません</div>;
  }
  const polyline = points.map(p => [p.location!.lat, p.location!.lng] as [number, number]);
  const center = polyline[0];
  return (
    <section style={{margin:'32px 0'}}>
      <h3 style={{fontSize:18,fontWeight:'bold',marginBottom:12}}>🗺 地図上の軌跡</h3>
      <MapContainer center={center} zoom={5} style={{height:320,width:'100%',borderRadius:12}} scrollWheelZoom={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={polyline} color="#1890ff" />
        {points.map((p,i) => (
          <Marker key={p.id} position={[p.location!.lat, p.location!.lng]}>
            <Popup>
              {p.title && <div><b>{p.title}</b></div>}
              {p.location?.address && <div>{p.location.address}</div>}
              {p.date && <div>{p.date}</div>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </section>
  );
};

export default UserTrajectoryMap; 