"use client";

import { useState } from 'react';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (email: string) => Promise<void>;
  isLoading: boolean;
}

export default function AuthForm({ mode, onSubmit, isLoading }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    try {
      await onSubmit(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="text-green-600 text-6xl mb-4">📧</div>
        <h3 className="text-lg font-semibold mb-2">メールを送信しました！</h3>
        <p className="text-gray-600 text-sm">
          {email} にMagic Linkを送信しました。<br />
          メール内のリンクをクリックしてログインしてください。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          📧 メールアドレス（Magic Link）
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          disabled={isLoading}
        />
      </div>
      
      <button
        type="submit"
        disabled={!email || isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            送信中...
          </>
        ) : (
          `Magic Linkを送信`
        )}
      </button>
    </form>
  );
} 