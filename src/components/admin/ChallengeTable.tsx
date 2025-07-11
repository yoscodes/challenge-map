"use client";

import { useState } from 'react';

interface Challenge {
  id: string;
  title: string;
  author: string;
  status: 'public' | 'private' | 'hidden' | 'deleted';
  reportCount: number;
  createdAt: string;
  category?: string;
}

interface ChallengeTableProps {
  challenges: Challenge[];
  onChallengeAction: (challengeId: string, action: string) => void;
}

export default function ChallengeTable({ challenges, onChallengeAction }: ChallengeTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || challenge.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'public':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">🟢 公開中</span>;
      case 'private':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">🔵 非公開</span>;
      case 'hidden':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">🟡 非表示</span>;
      case 'deleted':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">🔴 削除済み</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">不明</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          📝 チャレンジ管理
        </h2>
        
        {/* 検索・フィルター */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="タイトル・投稿者で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全状態</option>
            <option value="public">公開中</option>
            <option value="private">非公開</option>
            <option value="hidden">非表示</option>
            <option value="deleted">削除済み</option>
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
                タイトル
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                投稿者
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状態
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
            {filteredChallenges.map((challenge) => (
              <tr key={challenge.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {challenge.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  <div className="font-medium">{challenge.title}</div>
                  {challenge.category && (
                    <div className="text-xs text-gray-500">{challenge.category}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {challenge.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(challenge.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {challenge.reportCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => onChallengeAction(challenge.id, 'view')}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    確認
                  </button>
                  <button
                    onClick={() => onChallengeAction(challenge.id, 'hide')}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    非表示
                  </button>
                  <button
                    onClick={() => onChallengeAction(challenge.id, 'delete')}
                    className="text-red-600 hover:text-red-900"
                  >
                    削除
                  </button>
                  <button
                    onClick={() => onChallengeAction(challenge.id, 'moderate')}
                    className="text-purple-600 hover:text-purple-900"
                  >
                    モデレーション
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          該当するチャレンジが見つかりません
        </div>
      )}
    </div>
  );
} 