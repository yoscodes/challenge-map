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
    <section style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', borderBottom: '2px solid #eee' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              padding: '16px 24px',
              border: 'none',
              background: 'transparent',
              fontSize: 16,
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              color: activeTab === tab.id ? '#1890ff' : '#666',
              borderBottom: activeTab === tab.id ? '2px solid #1890ff' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
    </section>
  );
};

export default TabSwitcher; 