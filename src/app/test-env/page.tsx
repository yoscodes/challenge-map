"use client";

import { useEffect, useState } from 'react';

export default function TestEnvPage() {
  const [envStatus, setEnvStatus] = useState({
    supabaseUrl: '',
    supabaseKey: '',
    stripeKey: '',
    appUrl: ''
  });

  useEffect(() => {
    setEnvStatus({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '未設定',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定',
      stripeKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '未設定',
      appUrl: process.env.NEXT_PUBLIC_APP_URL || '未設定'
    });
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>環境変数テスト</h1>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px', 
        marginTop: '20px' 
      }}>
        <h2>環境変数読み込み状況</h2>
        
        <div style={{ marginTop: '16px' }}>
          <div style={{ marginBottom: '12px' }}>
            <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> 
            <span style={{ 
              color: envStatus.supabaseUrl !== '未設定' ? '#52c41a' : '#ff4d4f',
              marginLeft: '8px'
            }}>
              {envStatus.supabaseUrl}
            </span>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> 
            <span style={{ 
              color: envStatus.supabaseKey !== '未設定' ? '#52c41a' : '#ff4d4f',
              marginLeft: '8px'
            }}>
              {envStatus.supabaseKey}
            </span>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <strong>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:</strong> 
            <span style={{ 
              color: envStatus.stripeKey !== '未設定' ? '#52c41a' : '#ff4d4f',
              marginLeft: '8px'
            }}>
              {envStatus.stripeKey}
            </span>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <strong>NEXT_PUBLIC_APP_URL:</strong> 
            <span style={{ 
              color: envStatus.appUrl !== '未設定' ? '#52c41a' : '#ff4d4f',
              marginLeft: '8px'
            }}>
              {envStatus.appUrl}
            </span>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '20px', 
          padding: '12px', 
          background: '#e6f7ff', 
          border: '1px solid #91d5ff',
          borderRadius: '4px'
        }}>
          <h3>トラブルシューティング</h3>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>環境変数が読み込まれない場合は、開発サーバーを再起動してください</li>
            <li>.env.localファイルが正しい場所にあることを確認してください</li>
            <li>環境変数名が正しく記述されていることを確認してください</li>
            <li>NEXT_PUBLIC_プレフィックスが付いていることを確認してください</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 