"use client";

import React from "react";

type SupporterVoice = {
  id: string;
  username: string;
  message: string;
  date: string;
};

type SupporterVoicesProps = {
  voices: SupporterVoice[];
};

const SupporterVoices = ({ voices }: SupporterVoicesProps) => {
  if (voices.length === 0) {
    return null;
  }

  return (
    <section style={{ 
      background: '#fff', 
      borderRadius: 12, 
      padding: 20, 
      marginBottom: 24,
      border: '1px solid #eee'
    }}>
      <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#222' }}>
        💬 支援者の声
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {voices.map((voice) => (
          <div key={voice.id} style={{ 
            padding: '12px 16px', 
            background: '#f8f9fa', 
            borderRadius: 8,
            border: '1px solid #e9ecef'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 4
            }}>
              <span style={{ fontSize: 14, fontWeight: 'bold', color: '#1890ff' }}>
                @{voice.username}
              </span>
              <span style={{ fontSize: 12, color: '#666' }}>
                {voice.date}
              </span>
            </div>
            <div style={{ fontSize: 14, color: '#333', fontStyle: 'italic' }}>
              "{voice.message}"
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SupporterVoices; 