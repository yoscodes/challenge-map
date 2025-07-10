import React from "react";

type Comment = {
  id: string;
  author: string;
  content: string;
  date: string;
};

type CommentSectionProps = {
  comments: Comment[];
};

const CommentSection = ({ comments }: CommentSectionProps) => (
  <section style={{ marginBottom: 32 }}>
    <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>💬 コメント欄（応援メッセージ投稿）</h3>
    
    <div style={{ marginBottom: 16 }}>
      <textarea 
        placeholder="応援メッセージを入力してください..."
        style={{ 
          width: '100%', 
          minHeight: 80, 
          padding: 12, 
          border: '1px solid #ddd', 
          borderRadius: 8,
          resize: 'vertical'
        }}
      />
      <button style={{ 
        marginTop: 8,
        padding: '8px 16px',
        background: '#1890ff',
        color: '#fff',
        border: 'none',
        borderRadius: 4
      }}>
        コメント投稿
      </button>
    </div>
    
    <div>
      {comments.map((comment) => (
        <div key={comment.id} style={{ 
          border: '1px solid #eee', 
          borderRadius: 8, 
          padding: 12, 
          marginBottom: 8,
          background: '#fafafa'
        }}>
          <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
            {comment.author} - {comment.date}
          </div>
          <div>{comment.content}</div>
        </div>
      ))}
    </div>
  </section>
);

export default CommentSection; 