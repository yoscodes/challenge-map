import React from "react";

const Header = () => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1px solid #eee' }}>
      <div style={{ fontWeight: 'bold', fontSize: 24 }}>ChallengeMap</div>
      <nav style={{ display: 'flex', gap: 24 }}>
        <a href="#map">地図</a>
        <a href="#new">新着</a>
      </nav>
      <div>
        <button>ログイン</button>
        <button style={{ marginLeft: 8 }}>マイページ</button>
      </div>
    </header>
  );
};

export default Header; 