"use client";

import React from "react";

const SecurityNotice = () => (
  <section style={{ 
    background: '#fff', 
    borderRadius: 12, 
    padding: 20, 
    marginBottom: 24,
    border: '1px solid #eee',
    textAlign: 'center'
  }}>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: 12,
      marginBottom: 12
    }}>
      <span style={{ fontSize: 20 }}>🔒</span>
      <span style={{ fontSize: 16, fontWeight: 'bold', color: '#52c41a' }}>
        安全な決済です
      </span>
    </div>
    
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: 16,
      marginBottom: 12
    }}>
      <div style={{ 
        padding: '4px 8px', 
        background: '#f6ffed', 
        border: '1px solid #b7eb8f', 
        borderRadius: 4,
        fontSize: 12,
        color: '#52c41a',
        fontWeight: 'bold'
      }}>
        Stripe
      </div>
      <span style={{ fontSize: 14, color: '#666' }}>SSL暗号化</span>
    </div>
    
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: 8,
      fontSize: 12,
      color: '#999'
    }}>
      <span>💳</span>
      <span>Visa</span>
      <span>💳</span>
      <span>Mastercard</span>
      <span>💳</span>
      <span>American Express</span>
      <span>💳</span>
      <span>JCB</span>
    </div>
    
    <div style={{ 
      marginTop: 12, 
      fontSize: 12, 
      color: '#999',
      lineHeight: 1.4
    }}>
      決済情報はStripeによって安全に処理されます。<br />
      当サイトではクレジットカード情報を保存しません。
    </div>
  </section>
);

export default SecurityNotice; 