import React from "react";

const SupportButton = () => (
  <section style={{ marginBottom: 32 }}>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center',
      padding: '24px',
      background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
      borderRadius: 12,
      color: '#fff'
    }}>
      <button style={{ 
        fontSize: 18,
        padding: '16px 32px',
        background: 'rgba(255,255,255,0.2)',
        color: '#fff',
        border: '2px solid #fff',
        borderRadius: 32,
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}>
        💖 この人を応援する → Stripeサポートページへ
      </button>
    </div>
  </section>
);

export default SupportButton; 