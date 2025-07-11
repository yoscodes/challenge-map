"use client";
import React, { useState } from "react";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

type ReportModalProps = {
  targetType: 'challenge' | 'progress' | 'comment';
  targetId: string;
  open: boolean;
  onClose: () => void;
};

const ReportModal = ({ targetType, targetId, open, onClose }: ReportModalProps) => {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert("通報理由を入力してください");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('reports').insert([
      {
        reported_by: user?.id,
        target_type: targetType,
        target_id: targetId,
        reason,
        status: 'pending'
      }
    ]);
    setLoading(false);
    if (!error) {
      setDone(true);
      setTimeout(() => {
        setDone(false);
        setReason("");
        onClose();
      }, 1200);
    } else {
      alert('送信に失敗しました');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 340, maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>通報フォーム</h2>
        <div style={{ marginBottom: 16, color: '#888', fontSize: 14 }}>
          対象: {targetType}（ID: {targetId}）
        </div>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="通報理由を具体的にご記入ください"
          style={{ width: '100%', minHeight: 80, borderRadius: 6, border: '1px solid #ddd', padding: 8, marginBottom: 16 }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button onClick={onClose} style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: '#eee', color: '#333', fontWeight: 'bold', cursor: 'pointer' }}>キャンセル</button>
          <button onClick={handleSubmit} disabled={loading} style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: '#ff4d4f', color: '#fff', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? '送信中...' : '通報する'}</button>
        </div>
        {done && <div style={{ color: '#52c41a', marginTop: 16 }}>通報が送信されました</div>}
      </div>
    </div>
  );
};

export default ReportModal; 