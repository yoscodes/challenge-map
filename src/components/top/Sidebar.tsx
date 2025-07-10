import React from "react";

const Sidebar = () => (
  <aside style={{ background: '#fffbe6', borderRadius: 12, padding: 16, minHeight: 320 }}>
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>🏆 人気チャレンジャー</div>
      <ol style={{ paddingLeft: 20 }}>
        <li>@ai_traveler（10人支援）</li>
        <li>@run_tanaka（7人支援）</li>
      </ol>
    </div>
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>💡 今週の注目チャレンジ</div>
      <ul style={{ paddingLeft: 20 }}>
        <li>「毎朝5時起き生活」</li>
        <li>「カンボジアの学校訪問」</li>
      </ul>
    </div>
  </aside>
);

export default Sidebar; 