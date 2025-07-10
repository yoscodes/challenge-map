import React from "react";

type ProgressCardProps = {
  date: string;
  content: string;
  imageUrl?: string;
  applauseCount: number;
  commentCount: number;
};

const ProgressCard = ({ date, content, imageUrl, applauseCount, commentCount }: ProgressCardProps) => (
  <div style={{ 
    border: '1px solid #eee', 
    borderRadius: 8, 
    padding: 16, 
    marginBottom: 16,
    background: '#fff'
  }}>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      marginBottom: 12,
      fontSize: 14,
      color: '#666'
    }}>
      🔽 {date}
    </div>
    
    {imageUrl && (
      <div style={{ marginBottom: 12 }}>
        <img 
          src={imageUrl} 
          alt="進捗画像" 
          style={{ 
            maxWidth: '100%', 
            borderRadius: 8,
            border: '1px solid #eee'
          }} 
        />
      </div>
    )}
    
    <div style={{ 
      marginBottom: 12,
      lineHeight: 1.5,
      fontSize: 16
    }}>
      {content}
    </div>
    
    <div style={{ 
      display: 'flex', 
      gap: 16,
      fontSize: 14,
      color: '#666'
    }}>
      <span>👍 {applauseCount}拍手</span>
      <span>💬 {commentCount}コメント</span>
    </div>
  </div>
);

export default ProgressCard; 