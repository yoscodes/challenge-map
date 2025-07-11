"use client";

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const tabs = [
    { id: 'summary', label: '📊 概要', icon: '📊' },
    { id: 'users', label: '🧑‍💼 ユーザー管理', icon: '🧑‍💼' },
    { id: 'challenges', label: '📝 チャレンジ管理', icon: '📝' },
    { id: 'reports', label: '🚨 通報 / モデレーション', icon: '🚨' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        🛠 管理者ダッシュボード
      </h1>
      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
} 