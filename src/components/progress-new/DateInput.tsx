"use client";

import React from "react";

type DateInputProps = {
  date: string;
  onDateChange: (date: string) => void;
};

const DateInput = ({ date, onDateChange }: DateInputProps) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        📅 日付の指定（任意、デフォルトは今日）
      </h2>
      <div style={{ marginBottom: 8 }}>
        <input
          type="date"
          value={date || today}
          onChange={(e) => onDateChange(e.target.value)}
          max={today}
          style={{
            padding: '12px 16px',
            border: '1px solid #ddd',
            borderRadius: 8,
            fontSize: 16,
            minWidth: 200
          }}
        />
      </div>
      <div style={{ fontSize: 14, color: '#666' }}>
        {date || today} の進捗として記録されます
      </div>
    </section>
  );
};

export default DateInput; 