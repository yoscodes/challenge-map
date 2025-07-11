"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('認証エラー:', error);
          setError('認証に失敗しました。もう一度お試しください。');
          return;
        }

        if (data.session) {
          // ユーザープロフィールの確認・作成
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          if (profileError && profileError.code === 'PGRST116') {
            // プロフィールが存在しない場合、作成
            const { error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  id: data.session.user.id,
                  email: data.session.user.email,
                  username: data.session.user.email?.split('@')[0] || 'user',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
              ]);

            if (insertError) {
              console.error('プロフィール作成エラー:', insertError);
              setError('プロフィールの作成に失敗しました。');
              return;
            }
          }

          // 成功時はマイページにリダイレクト
          router.push('/mypage');
        } else {
          setError('セッションが見つかりません。');
        }
      } catch (err) {
        console.error('認証コールバックエラー:', err);
        setError('認証処理中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">認証中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">認証エラー</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/auth')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            認証ページに戻る
          </button>
        </div>
      </div>
    );
  }

  return null;
} 