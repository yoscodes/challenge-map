"use client";

interface AuthSwitchLinksProps {
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

export default function AuthSwitchLinks({ mode, onModeChange }: AuthSwitchLinksProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        {mode === 'login' ? (
          <>
            <p className="text-sm text-gray-600">
              すでにアカウントをお持ちですか？
              <button
                onClick={() => onModeChange('login')}
                className="text-blue-600 hover:text-blue-700 font-medium ml-1"
              >
                ログイン
              </button>
            </p>
            <p className="text-sm text-gray-600">
              アカウントをお持ちでない方はこちら
              <button
                onClick={() => onModeChange('signup')}
                className="text-blue-600 hover:text-blue-700 font-medium ml-1"
              >
                新規登録
              </button>
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              すでにアカウントをお持ちですか？
              <button
                onClick={() => onModeChange('login')}
                className="text-blue-600 hover:text-blue-700 font-medium ml-1"
              >
                ログイン
              </button>
            </p>
            <p className="text-sm text-gray-600">
              アカウントをお持ちでない方はこちら
              <button
                onClick={() => onModeChange('signup')}
                className="text-blue-600 hover:text-blue-700 font-medium ml-1"
              >
                新規登録
              </button>
            </p>
          </>
        )}
      </div>

      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-gray-600 text-sm">
          🔒 安全な認証です（Supabase / Google OAuth）
        </div>
      </div>
    </div>
  );
} 