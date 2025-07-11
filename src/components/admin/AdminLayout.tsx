"use client";

import { useState } from 'react';
import AdminTabs from './AdminTabs';
import AdminSummary from './AdminSummary';
import UserTable from './UserTable';
import ChallengeTable from './ChallengeTable';
import ReportTable from './ReportTable';

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState('summary');

  // ダミーデータ
  const stats = {
    totalUsers: 1240,
    activeUsers: 312,
    totalChallenges: 420,
    totalProgress: 3912,
    totalSupport: 182000,
  };

  const users = [
    { id: 'u00123', username: 'ai_travel', email: 'ai@example.com', status: 'active' as const, reportCount: 0 },
    { id: 'u00124', username: 'troll_456', email: 'troll@example.com', status: 'suspended' as const, reportCount: 5 },
    { id: 'u00125', username: 'spammer_789', email: 'spam@example.com', status: 'banned' as const, reportCount: 12 },
  ];

  const challenges = [
    { id: 'c0123', title: '世界一周したい', author: 'ai_travel', status: 'public' as const, reportCount: 0, createdAt: '2024-01-15', category: '旅行' },
    { id: 'c0124', title: '変なことをする', author: 'troll_456', status: 'hidden' as const, reportCount: 2, createdAt: '2024-01-10', category: 'その他' },
    { id: 'c0125', title: 'プログラミング学習', author: 'dev_user', status: 'public' as const, reportCount: 0, createdAt: '2024-01-20', category: '学習' },
  ];

  const reports = [
    {
      id: 'r001',
      targetType: 'challenge' as const,
      targetId: 'c0124',
      targetTitle: '変なことをする',
      reportType: 'discrimination' as const,
      reporter: 'user567',
      comment: '不快な発言あり',
      status: 'pending' as const,
      createdAt: '2024-01-12',
    },
    {
      id: 'r002',
      targetType: 'progress' as const,
      targetId: 'p0542',
      targetTitle: '進捗投稿',
      reportType: 'spam' as const,
      reporter: 'user789',
      comment: '意味不明なURLばかり',
      status: 'resolved' as const,
      createdAt: '2024-01-08',
    },
  ];

  const handleUserAction = (userId: string, action: string) => {
    console.log('ユーザー操作:', { userId, action });
    // TODO: 実際のAPI呼び出し
    alert(`${action}操作を実行: ${userId}`);
  };

  const handleChallengeAction = (challengeId: string, action: string) => {
    console.log('チャレンジ操作:', { challengeId, action });
    // TODO: 実際のAPI呼び出し
    alert(`${action}操作を実行: ${challengeId}`);
  };

  const handleReportAction = (reportId: string, action: string) => {
    console.log('通報操作:', { reportId, action });
    // TODO: 実際のAPI呼び出し
    alert(`${action}操作を実行: ${reportId}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return <AdminSummary stats={stats} />;
      case 'users':
        return <UserTable users={users} onUserAction={handleUserAction} />;
      case 'challenges':
        return <ChallengeTable challenges={challenges} onChallengeAction={handleChallengeAction} />;
      case 'reports':
        return <ReportTable />;
      default:
        return <AdminSummary stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTabContent()}
      </div>
    </div>
  );
} 