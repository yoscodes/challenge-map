import React from "react";

const HeroMessage = () => (
  <div
    className="fade-in"
    style={{
      padding: "48px 0 32px 0",
      textAlign: "center",
      fontSize: 26,
      fontWeight: 900,
      background: 'linear-gradient(90deg,#2563eb,#60a5fa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '0.04em',
      lineHeight: 1.4,
      marginBottom: 12,
      textShadow: '0 2px 12px #2563eb22',
      borderRadius: 18
    }}
  >
    <span style={{ fontSize: 36, marginRight: 8 }}>🌍</span>
    やりたいことを世界に広げ、挑戦者には拍手とサポートを。
    <br />
    <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: '0.03em', color: '#fff', background: 'rgba(37,99,235,0.12)', borderRadius: 12, padding: '4px 16px', marginTop: 12, display: 'inline-block' }}>
      タイムラインでみんなの一歩を見守ろう。
    </span>
  </div>
);

export default HeroMessage;
