"use client";
import React, { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase';

type Report = {
  id: string;
  reported_by: string;
  target_type: string;
  target_id: string;
  reason: string;
  status: string;
  created_at: string;
  handled_by?: string;
  handled_at?: string;
  memo?: string;
};

const ReportTable = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
      if (!error && data) setReports(data);
      setLoading(false);
    };
    fetchReports();
  }, []);

  if (loading) return <div>読み込み中...</div>;

  return (
    <section style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 24, border: '1px solid #eee' }}>
      <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>通報一覧</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={{ padding: 8, border: '1px solid #eee' }}>ID</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>通報者</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>対象種別</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>対象ID</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>理由</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>ステータス</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>通報日時</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>対応者</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>対応日時</th>
              <th style={{ padding: 8, border: '1px solid #eee' }}>メモ</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id}>
                <td style={{ padding: 8, border: '1px solid #eee', fontSize: 12 }}>{r.id}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{r.reported_by}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{r.target_type}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{r.target_id}</td>
                <td style={{ padding: 8, border: '1px solid #eee', maxWidth: 200, wordBreak: 'break-all' }}>{r.reason}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{r.status}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{r.created_at ? new Date(r.created_at).toLocaleString() : ''}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{r.handled_by || ''}</td>
                <td style={{ padding: 8, border: '1px solid #eee' }}>{r.handled_at ? new Date(r.handled_at).toLocaleString() : ''}</td>
                <td style={{ padding: 8, border: '1px solid #eee', maxWidth: 120, wordBreak: 'break-all' }}>{r.memo || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ReportTable; 