import React from "react";
import Sidebar from "./Sidebar";
import type { Challenge } from '@/lib/supabase';

interface MainLayoutProps {
  challenges: Challenge[];
}

const MainLayout = ({ challenges }: MainLayoutProps) => (
  <div style={{ display: 'flex', gap: 24, margin: '32px 0' }}>
    {/* 地図(MapView)は削除 */}
    <div style={{ flex: 1 }}>
      <Sidebar />
    </div>
  </div>
);

export default MainLayout; 