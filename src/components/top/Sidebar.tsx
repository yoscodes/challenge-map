import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { challenges } from "@/lib/database";

const Sidebar = () => {
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [topChallenges, setTopChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // 人気チャレンジャー: supportersテーブルを集計
      const { data: supporterData, error: supporterError } = await supabase
        .from("supporters")
        .select(
          "supported_user_id, users:supported_user_id(username, avatar_url)"
        );
      let userSupportCount: Record<
        string,
        { username: string; avatar_url?: string; count: number }
      > = {};
      if (supporterData && Array.isArray(supporterData)) {
        supporterData.forEach((s: any) => {
          const userId = s.supported_user_id;
          if (!userSupportCount[userId]) {
            userSupportCount[userId] = {
              username: s.users?.username || "unknown",
              avatar_url: s.users?.avatar_url,
              count: 0,
            };
          }
          userSupportCount[userId].count += 1;
        });
      }
      // 上位3名を取得
      const sortedUsers = Object.entries(userSupportCount)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 3)
        .map(([id, info]) => ({ id, ...info }));
      setTopUsers(sortedUsers);

      // 注目チャレンジ: 新着上位3件
      const { data: challengeData, error: challengeError } =
        await challenges.getAll(3);
      setTopChallenges(challengeData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <aside
      className="sidebar-card fade-in"
      style={{
        background: "#fffbe6",
        borderRadius: 16,
        padding: 24,
        minHeight: 320,
        color: "#222",
        boxShadow: '0 4px 24px rgba(251,191,36,0.10)',
        marginBottom: 32
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontWeight: "bold", marginBottom: 12, fontSize: 18, letterSpacing: '0.02em' }}>
          🏆 人気チャレンジャー
        </div>
        {loading ? (
          <div>読み込み中...</div>
        ) : (
          <ol style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
            {topUsers.length === 0 && <li>該当者なし</li>}
            {topUsers.map((user, idx) => (
              <li key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, background: '#fef9c3', borderRadius: 12, padding: '10px 16px', boxShadow: idx === 0 ? '0 2px 12px #fbbf24aa' : 'none' }}>
                <span style={{ fontWeight: 700, fontSize: 18, color: ['#fbbf24','#a3e635','#38bdf8'][idx] || '#bbb', minWidth: 28, textAlign: 'center' }}>#{idx+1}</span>
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=fbbf24&color=fff&rounded=true&size=40`} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', boxShadow: '0 1px 4px #fbbf24aa' }} />
                <span style={{ fontWeight: 600, fontSize: 16 }}>@{user.username}</span>
                <span style={{ color: '#b45309', fontWeight: 500, marginLeft: 'auto' }}>{user.count}人支援</span>
              </li>
            ))}
          </ol>
        )}
      </div>
      <div>
        <div style={{ fontWeight: "bold", marginBottom: 12, fontSize: 18, letterSpacing: '0.02em' }}>
          💡 今週の注目チャレンジ
        </div>
        {loading ? (
          <div>読み込み中...</div>
        ) : (
          <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
            {topChallenges.length === 0 && <li>該当なし</li>}
            {topChallenges.map((ch, idx) => (
              <li key={ch.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px' }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: '#2563eb', minWidth: 24 }}>#{idx+1}</span>
                <span style={{ fontWeight: 600, fontSize: 15, color: '#222' }}>「{ch.title}」</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
