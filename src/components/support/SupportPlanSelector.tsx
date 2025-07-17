"use client";

import React, { useState } from "react";

type PlanType = "monthly" | "oneTime";

type SupportPlanSelectorProps = {
  onPlanChange: (type: PlanType, amount: number) => void;
};

const SupportPlanSelector = ({ onPlanChange }: SupportPlanSelectorProps) => {
  const [planType, setPlanType] = useState<PlanType>("monthly");
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>("");

  const monthlyPlans = [300, 500, 1000];
  const oneTimePlans = [500, 1000];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    onPlanChange(planType, amount);
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const amount = parseInt(value) || 0;
    if (amount > 0) {
      onPlanChange(planType, amount);
    }
  };

  return (
    <section style={{ 
      background: '#fff', 
      borderRadius: 12, 
      padding: 24, 
      marginBottom: 24,
      border: '1px solid #eee',
      color: '#222'
    }}>
      <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
        💖 支援プランを選ぶ
      </h3>
      
      {/* 月額プラン */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="radio"
              name="planType"
              checked={planType === "monthly"}
              onChange={() => {
                setPlanType("monthly");
                onPlanChange("monthly", selectedAmount);
              }}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontSize: 16, fontWeight: 'bold' }}>
              ◉ 月額プラン（継続支援）
            </span>
          </label>
        </div>
        
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {monthlyPlans.map((amount) => (
            <button
              key={amount}
              onClick={() => handleAmountSelect(amount)}
              style={{
                padding: '12px 20px',
                border: planType === "monthly" && selectedAmount === amount 
                  ? '2px solid #1890ff' 
                  : '2px solid #ddd',
                borderRadius: 8,
                background: planType === "monthly" && selectedAmount === amount 
                  ? '#e6f7ff' 
                  : '#fff',
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: planType === "monthly" && selectedAmount === amount ? 'bold' : 'normal'
              }}
            >
              ¥{amount.toLocaleString()}/月
            </button>
          ))}
        </div>
      </div>
      
      {/* 単発支援 */}
      <div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="radio"
              name="planType"
              checked={planType === "oneTime"}
              onChange={() => {
                setPlanType("oneTime");
                onPlanChange("oneTime", selectedAmount);
              }}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontSize: 16, fontWeight: 'bold' }}>
              ◉ 単発支援（スポットで支援）
            </span>
          </label>
        </div>
        
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {oneTimePlans.map((amount) => (
            <button
              key={amount}
              onClick={() => handleAmountSelect(amount)}
              style={{
                padding: '12px 20px',
                border: planType === "oneTime" && selectedAmount === amount 
                  ? '2px solid #1890ff' 
                  : '2px solid #ddd',
                borderRadius: 8,
                background: planType === "oneTime" && selectedAmount === amount 
                  ? '#e6f7ff' 
                  : '#fff',
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: planType === "oneTime" && selectedAmount === amount ? 'bold' : 'normal'
              }}
            >
              ¥{amount.toLocaleString()}
            </button>
          ))}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, color: '#666' }}>自由入力：</span>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              placeholder="例：3000"
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: 6,
                fontSize: 14,
                width: 100
              }}
            />
            <span style={{ fontSize: 14, color: '#666' }}>円</span>
          </div>
        </div>
      </div>
      
      {/* 選択されたプラン表示 */}
      <div style={{ 
        marginTop: 20, 
        padding: '16px', 
        background: '#f6ffed', 
        borderRadius: 8,
        border: '1px solid #b7eb8f'
      }}>
        <div style={{ fontSize: 16, fontWeight: 'bold', color: '#52c41a' }}>
          選択中：{planType === "monthly" ? `月額¥${selectedAmount.toLocaleString()}` : `単発¥${selectedAmount.toLocaleString()}`}
        </div>
      </div>
    </section>
  );
};

export default SupportPlanSelector; 