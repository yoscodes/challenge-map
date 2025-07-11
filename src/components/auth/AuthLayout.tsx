"use client";

import { useState } from 'react';
import AuthForm from './AuthForm';
import OAuthButtons from './OAuthButtons';
import AuthSwitchLinks from './AuthSwitchLinks';
import { auth } from '@/lib/auth';

export default function AuthLayout() {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await auth.signInWithEmail(email);
      if (error) {
        console.error('Magic Link送信エラー:', error);
        alert('メール送信に失敗しました。もう一度お試しください。');
        throw error;
      }
      console.log('Magic Link送信成功:', email);
    } catch (error) {
      console.error('Magic Link送信エラー:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await auth.signInWithGoogle();
      if (error) {
        console.error('Google OAuth認証エラー:', error);
        alert('Google認証に失敗しました。もう一度お試しください。');
        throw error;
      }
      console.log('Google OAuth認証開始');
    } catch (error) {
      console.error('Google OAuth認証エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* ヘッダー */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              👋 はじめまして！
            </h1>
            <p className="text-gray-600 text-sm">
              挑戦を始めるには、アカウントを作成またはログインしてください。
            </p>
          </div>

          {/* 認証フォーム */}
          <AuthForm
            mode={mode}
            onSubmit={handleEmailSubmit}
            isLoading={isLoading}
          />

          {/* OAuthボタン */}
          <OAuthButtons
            onGoogleSignIn={handleGoogleSignIn}
            isLoading={isLoading}
          />

          {/* 切り替えリンクとセキュリティ説明 */}
          <AuthSwitchLinks
            mode={mode}
            onModeChange={setMode}
          />
        </div>

        {/* 追加の説明文 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            ログインすることで、あなたの挑戦を記録し、<br />
            他の挑戦者とつながることができます。
          </p>
        </div>
      </div>
    </div>
  );
} 