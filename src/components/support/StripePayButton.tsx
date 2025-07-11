"use client";

import React from "react";

type StripePayButtonProps = {
  onPayment: () => void;
  amount: number;
  planType: "monthly" | "oneTime";
  isProcessing: boolean;
};

const StripePayButton = ({ onPayment, amount, planType, isProcessing }: StripePayButtonProps) => (
  <section style={{ 
    background: '#fff', 
    borderRadius: 12, 
    padding: 24, 
    marginBottom: 24,
    border: '1px solid #eee',
    textAlign: 'center'
  }}>
    <button
      onClick={onPayment}
      disabled={isProcessing || amount <= 0}
      style={{
        fontSize: 20,
        padding: '20px 48px',
        background: amount > 0 ? 'linear-gradient(135deg, #52c41a, #389e0d)' : '#d9d9d9',
        color: '#fff',
        border: 'none',
        borderRadius: 32,
        fontWeight: 'bold',
        cursor: amount > 0 ? 'pointer' : 'not-allowed',
        boxShadow: amount > 0 ? '0 4px 12px rgba(82,196,26,0.3)' : 'none',
        transition: 'all 0.3s ease',
        minWidth: 300
      }}
    >
      {isProcessing ? '処理中...' : `✅ Stripeで支援する（¥${amount.toLocaleString()}）`}
    </button>
    
    <div style={{ 
      marginTop: 12, 
      fontSize: 14, 
      color: '#666' 
    }}>
      {planType === "monthly" ? "月額継続支援" : "単発支援"}
    </div>
    
    <div style={{ 
      marginTop: 8, 
      fontSize: 12, 
      color: '#999' 
    }}>
      → Stripe Checkout（Client Only or Connect対応）
    </div>
  </section>
);

export default StripePayButton; 