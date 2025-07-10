import React from "react";

const MapView = () => (
  <div style={{ background: '#e6f7ff', borderRadius: 12, height: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 16 }}>
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
      🗺 地図ビュー（ここに地図が入ります）
    </div>
    <div style={{ marginTop: 16 }}>
      <span style={{ fontWeight: 'bold' }}>カテゴリ別フィルター：</span>
      <button style={{ margin: '0 8px' }}>旅</button>
      <button style={{ margin: '0 8px' }}>学習</button>
      <button style={{ margin: '0 8px' }}>健康</button>
    </div>
  </div>
);

export default MapView; 