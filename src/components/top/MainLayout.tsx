import React from "react";
import dynamic from "next/dynamic";
import Sidebar from "./Sidebar";
import type { Challenge } from '@/lib/supabase';

const MapView = dynamic(() => import("./MapView"), { ssr: false });

interface MainLayoutProps {
  challenges: Challenge[];
}

const MainLayout = ({ challenges }: MainLayoutProps) => (
  <div style={{ display: 'flex', gap: 24, margin: '32px 0' }}>
    <div style={{ flex: 2 }}>
      <MapView locations={challenges.filter(c => !!c.location).map(c => ({ ...c.location!, title: c.title, id: c.id }))} />
    </div>
    <div style={{ flex: 1 }}>
      <Sidebar />
    </div>
  </div>
);

export default MainLayout; 