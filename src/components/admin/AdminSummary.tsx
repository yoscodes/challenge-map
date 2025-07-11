"use client";

interface AdminSummaryProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalChallenges: number;
    totalProgress: number;
    totalSupport: number;
  };
}

export default function AdminSummary({ stats }: AdminSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        📊 概要パネル
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalUsers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">登録ユーザー数</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {stats.activeUsers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">アクティブユーザー</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {stats.totalChallenges.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">チャレンジ数</div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {stats.totalProgress.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">進捗投稿数</div>
        </div>
        
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {formatCurrency(stats.totalSupport)}
          </div>
          <div className="text-sm text-gray-600">支援総額</div>
        </div>
      </div>
    </div>
  );
} 