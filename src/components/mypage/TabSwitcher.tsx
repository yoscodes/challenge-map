"use client";

import React from "react";

type Tab = "active" | "completed" | "supporters";

type TabSwitcherProps = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

const TabSwitcher = ({ activeTab, onTabChange }: TabSwitcherProps) => {
  const tabs = [
    { id: "active" as Tab, label: "挑戦中", icon: "🔽" },
    { id: "completed" as Tab, label: "完了済み", icon: "🏁" },
    { id: "supporters" as Tab, label: "サポーター", icon: "💖" }
  ];

  return (
    <section style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', background: '#e0e7ef', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px #2563eb11' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              padding: '16px 0',
              border: 'none',
              background: activeTab === tab.id ? 'linear-gradient(90deg,#2563eb,#60a5fa)' : 'transparent',
              fontSize: 17,
              fontWeight: activeTab === tab.id ? 800 : 500,
              color: activeTab === tab.id ? '#fff' : '#2563eb',
              borderRadius: 0,
              boxShadow: activeTab === tab.id ? '0 2px 8px #2563eb33' : 'none',
              letterSpacing: '0.02em',
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none',
            }}
          >
            <span style={{ fontSize: 20, marginRight: 6 }}>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>
    </section>
  );
};

export default TabSwitcher; 