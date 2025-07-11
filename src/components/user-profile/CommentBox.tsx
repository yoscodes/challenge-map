"use client";

import React, { useState } from "react";

type CommentBoxProps = {
  onSubmit: (comment: string) => void;
  onGPTSuggest: () => void;
};

const CommentBox = ({ onSubmit, onGPTSuggest }: CommentBoxProps) => {
  const [comment, setComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment);
      setComment("");
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <section style={{ 
        background: '#fff', 
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 24,
        border: '1px solid #eee',
        textAlign: 'center'
      }}>
        <button
          onClick={() => setIsExpanded(true)}
          style={{
            fontSize: 16,
            padding: '12px 24px',
            background: '#1890ff',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          📬 応援コメントを書く
        </button>
      </section>
    );
  }

  return (
    <section style={{ 
      background: '#fff', 
      borderRadius: 12, 
      padding: 20, 
      marginBottom: 24,
      border: '1px solid #eee'
    }}>
      <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        📬 応援コメントを書く
      </h3>
      
      <div style={{ marginBottom: 16 }}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="この人の挑戦への応援メッセージを書いてください..."
          style={{
            width: '100%',
            minHeight: 100,
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
      
      <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleSubmit}
            disabled={!comment.trim()}
            style={{
              padding: '8px 16px',
              background: comment.trim() ? '#52c41a' : '#d9d9d9',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              cursor: comment.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            送信
          </button>
          
          <button
            onClick={onGPTSuggest}
            style={{
              padding: '8px 16px',
              background: '#722ed1',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            🤖 GPT提案
          </button>
        </div>
        
        <button
          onClick={() => setIsExpanded(false)}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            color: '#666',
            border: '1px solid #ddd',
            borderRadius: 6,
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          キャンセル
        </button>
      </div>
      
      <div style={{ 
        marginTop: 12, 
        fontSize: 14, 
        color: '#666' 
      }}>
        {comment.length}/200文字
      </div>
    </section>
  );
};

export default CommentBox; 