import { createClient } from '@supabase/supabase-js';

// 環境変数からSupabaseのURLとKeyを取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 画像アップロード
export async function uploadImageToStorage(
  file: File,
  path: string,
  bucket: string = 'images'
): Promise<{ data: any; error: string | null }> {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });
  if (error) {
    return { data: null, error: error.message };
  }
  return { data, error: null };
}

// 画像URL取得
export function getImageUrlFromStorage(
  path: string,
  bucket: string = 'images'
): string {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

// 画像削除
export async function deleteImageFromStorage(
  path: string,
  bucket: string = 'images'
): Promise<{ data: any; error: string | null }> {
  const { data, error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    return { data: null, error: error.message };
  }
  return { data, error: null };
} 