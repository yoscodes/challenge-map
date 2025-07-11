"use client";

import { useState } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  status: 'active' | 'suspended' | 'banned';
  reportCount: number;
  lastLogin?: string;
}

interface UserTableProps {
  users: User[];
  onUserAction: (userId: string, action: string) => void;
}

export default function UserTable({ users, onUserAction }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">✅ アクティブ</span>;
      case 'suspended':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">⚠️ 停止中</span>;
      case 'banned':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">🚫 BAN</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">不明</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          🧑‍💼 ユーザー管理
        </h2>
        
        {/* 検索・フィルター */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="名前・メールで検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全ステータス</option>
            <option value="active">アクティブ</option>
            <option value="suspended">停止中</option>
            <option value="banned">BAN</option>
          </select>
        </div>
      </div>

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                名前
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                メールアドレス
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ステータス
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                通報数
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.reportCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => onUserAction(user.id, 'warn')}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    警告
                  </button>
                  <button
                    onClick={() => onUserAction(user.id, 'suspend')}
                    className="text-orange-600 hover:text-orange-900"
                  >
                    停止
                  </button>
                  <button
                    onClick={() => onUserAction(user.id, 'ban')}
                    className="text-red-600 hover:text-red-900"
                  >
                    BAN
                  </button>
                  <button
                    onClick={() => onUserAction(user.id, 'email')}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    メール
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          該当するユーザーが見つかりません
        </div>
      )}
    </div>
  );
} 