import React from "react";

const GPTSupportTools = () => (
  <section style={{ marginBottom: 32 }}>
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <button
        style={{
          padding: "12px 20px",
          background: "#52c41a",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: "bold",
        }}
      >
        💬 GPT「あなたへの応援メッセージを自動生成」
      </button>

      <button
        style={{
          padding: "12px 20px",
          background: "#722ed1",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: "bold",
        }}
      >
        💡 GPT「次の進捗ネタ提案」（開発後期に）
      </button>
    </div>
  </section>
);

export default GPTSupportTools;
