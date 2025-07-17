"use client";

import React from "react";

type GoalDateInputProps = {
  goalDate: string;
  onGoalDateChange: (date: string) => void;
};

const GoalDateInput = ({ goalDate, onGoalDateChange }: GoalDateInputProps) => {
  const isUndecided = goalDate === 'undecided';
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onGoalDateChange(e.target.value);
  };

  const handleUndecidedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onGoalDateChange('undecided');
    } else {
      onGoalDateChange('');
    }
  };

  return (
    <section className="date-section">
      <h2 className="date-title">
        <span className="date-badge">📅 目標達成日</span>
      </h2>
      <div className="date-field-wrap">
        {/* 未定オプション */}
        <div className="date-undecided-option">
          <label className="date-undecided-label">
            <input
              type="checkbox"
              checked={isUndecided}
              onChange={handleUndecidedChange}
              className="date-undecided-checkbox"
            />
            <span>未定にする</span>
          </label>
        </div>
        
        {/* 日付入力 */}
        <input
          type="date"
          value={isUndecided ? '' : goalDate}
          onChange={handleDateChange}
          min={new Date().toISOString().split('T')[0]}
          className="date-field"
          disabled={isUndecided}
          style={{
            opacity: isUndecided ? 0.5 : 1,
            cursor: isUndecided ? 'not-allowed' : 'auto'
          }}
        />
      </div>
      <div className="date-info">
        {isUndecided ? (
          <span style={{ color: '#666', fontStyle: 'italic' }}>目標日は未定です</span>
        ) : goalDate && (
          `目標日まで: ${Math.ceil((new Date(goalDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}日`
        )}
      </div>
      {!isUndecided && goalDate.length === 0 && (
        <div className="date-error">
          目標日を設定するか、「未定」にしてください
        </div>
      )}
    </section>
  );
};

export default GoalDateInput; 