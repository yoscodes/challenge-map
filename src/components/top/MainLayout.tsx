import React from "react";
import MapView from "./MapView";
import Sidebar from "./Sidebar";

const MainLayout = () => (
  <div style={{ display: 'flex', gap: 24, margin: '32px 0' }}>
    <div style={{ flex: 2 }}>
      <MapView />
    </div>
    <div style={{ flex: 1 }}>
      <Sidebar />
    </div>
  </div>
);

export default MainLayout; 