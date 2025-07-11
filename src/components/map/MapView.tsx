"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React from "react";

// デフォルトのマーカー画像対策（Leafletの仕様）
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

type MapViewProps = {
  lat: number;
  lng: number;
  zoom?: number;
  showMarker?: boolean;
};

const MapView: React.FC<MapViewProps> = ({
  lat,
  lng,
  zoom = 13,
  showMarker = true,
}) => {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showMarker && (
          <Marker position={[lat, lng]}>
            <Popup>ここが選択された場所です</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView; 