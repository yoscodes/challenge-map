"use client";

import React, { useState } from "react";

type MessageInputProps = {
  onMessageChange: (message: string) => void;
  onGPTSuggest: () => void;
};

const MessageInput = ({ onMessageChange, onGPTSuggest }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMessageChange = (value: string) => {
    setMessage(value);
    onMessageChange(value);
  };

  const handleGPTSuggest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gpt/suggest-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `応援メッセージを日本語で120文字以内で考えてください。` })
      });
      const data = await res.json();
      if (data.message) {
        setMessage(data.message);
        onMessageChange(data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ 
      background: '#fff', 
      borderRadius: 12, 
      padding: 24, 
      marginBottom: 24,
      border: '1px solid #eee'
    }}>
      <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        ✏️ メッセージ（任意）
      </h3>
      
      <div style={{ marginBottom: 16 }}>
        <textarea
          value={message}
          onChange={(e) => handleMessageChange(e.target.value)}
          placeholder="応援してます！"
          style={{
            width: '100%',
            minHeight: 80,
            padding: '12px 16px',
            border: '1px solid #ddd',
            borderRadius: 8,
            fontSize: 16,
            lineHeight: 1.5,
            resize: 'vertical',
            boxSizing: 'border-box'
          }}
        />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 14, color: '#666' }}>
          {message.length}/200文字
        </div>
        
        <button
          onClick={handleGPTSuggest}
          disabled={loading}
          style={{
            padding: '8px 16px',
            background: '#722ed1',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '生成中...' : '🤖 GPT提案'}
        </button>
      </div>
      
      <div style={{ 
        marginTop: 12, 
        padding: '12px', 
        background: '#fff7e6', 
        border: '1px solid #ffd591', 
        borderRadius: 6,
        fontSize: 14,
        color: '#d46b08'
      }}>
        💡 メッセージは任意です。この人の挑戦への応援メッセージを書いてください。
      </div>
    </section>
  );
};

export default MessageInput; 