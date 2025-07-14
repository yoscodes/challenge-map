"use client";

import React from "react";

type GoalDateInputProps = {
  goalDate: string;
  onGoalDateChange: (date: string) => void;
};

const GoalDateInput = ({ goalDate, onGoalDateChange }: GoalDateInputProps) => (
  <section className="date-section">
    <h2 className="date-title">
      <span className="date-badge">📅 目標達成日（カレンダー入力）</span>
    </h2>
    <div className="date-field-wrap">
      <input
        type="date"
        value={goalDate}
        onChange={(e) => onGoalDateChange(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
        className="date-field"
      />
    </div>
    <div className="date-info">
      {goalDate && `目標日まで: ${Math.ceil((new Date(goalDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}日`}
    </div>
    {goalDate.length === 0 && (
      <div className="date-error">
        目標日を設定してください
      </div>
    )}
  </section>
);

export default GoalDateInput; 