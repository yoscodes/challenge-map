"use client";

import React from "react";

type GoalDateInputProps = {
  goalDate: string;
  onGoalDateChange: (date: string) => void;
};

const GoalDateInput = ({ goalDate, onGoalDateChange }: GoalDateInputProps) => (
  <section style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
      📅 目標達成日（カレンダー入力）
    </h2>
    <div style={{ marginBottom: 8 }}>
      <input
        type="date"
        value={goalDate}
        onChange={(e) => onGoalDateChange(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
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
      {goalDate && `目標日まで: ${Math.ceil((new Date(goalDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}日`}
    </div>
    {goalDate.length === 0 && (
      <div style={{ color: '#ff4d4f', fontSize: 14, marginTop: 8 }}>
        目標日を設定してください
      </div>
    )}
  </section>
);

export default GoalDateInput; 