import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('環境変数読み込み状況:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '設定済み' : '未設定');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '設定済み' : '未設定');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase環境変数が設定されていません:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '設定済み' : '未設定');
  console.error('環境変数ファイル(.env.local)を確認してください。');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// 型定義
export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  interests?: string[];
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  goal_date?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  is_public: boolean;
  status: 'planning' | 'in_progress' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
  cover_image?: string; // 追加
  users?: {
    username: string;
    avatar_url?: string;
    bio?: string;
  };
}

export interface ProgressUpdate {
  id?: string;
  challenge_id: string;
  user_id: string;
  content: string;
  images?: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  created_at?: string;
  progress_type?: string; // 追加
  date?: string; // 追加
}

export interface Comment {
  id: string;
  challenge_id: string;
  user_id?: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  users?: {
    username: string;
    avatar_url?: string;
  };
}

export interface ProgressComment {
  id: string;
  progress_id: string;
  user_id?: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  users?: {
    username: string;
    avatar_url?: string;
  };
}

export interface Supporter {
  id: string;
  supporter_id: string;
  supported_user_id: string;
  amount: number;
  plan_type: 'monthly' | 'one_time';
  stripe_subscription_id?: string;
  created_at: string;
} 