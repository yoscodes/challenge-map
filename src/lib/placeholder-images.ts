// プレースホルダー画像のユーティリティ

// プレースホルダー画像のベースURL
const PLACEHOLDER_BASE = '/placeholder';

// プレースホルダー画像の種類
export const PLACEHOLDER_TYPES = {
  USER: 'USER',
  CHALLENGE: 'CHALLENGE',
  AVATAR: 'AVATAR',
  AVATAR_SMALL: 'AVATAR_SMALL',
  IMAGE: 'IMAGE'
} as const;

// プレースホルダー画像を生成する関数
export const getPlaceholderImage = (
  type: keyof typeof PLACEHOLDER_TYPES = 'IMAGE',
  size: number = 80,
  color: string = '87CEEB',
  text: string = '📷'
): string => {
  // ローカルのプレースホルダー画像を使用
  const placeholderMap = {
    [PLACEHOLDER_TYPES.USER]: '/placeholder-user.svg',
    [PLACEHOLDER_TYPES.CHALLENGE]: '/placeholder-challenge.svg',
    [PLACEHOLDER_TYPES.AVATAR]: '/placeholder-avatar.svg',
    [PLACEHOLDER_TYPES.AVATAR_SMALL]: '/placeholder-avatar-small.svg',
    [PLACEHOLDER_TYPES.IMAGE]: '/placeholder-image.svg'
  };

  return placeholderMap[type] || placeholderMap[PLACEHOLDER_TYPES.IMAGE];
};

// エラー時のフォールバック画像
export const getFallbackImage = (type: keyof typeof PLACEHOLDER_TYPES = 'IMAGE'): string => {
  return getPlaceholderImage(type);
};

// 画像読み込みエラー時のハンドラー
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, fallbackType: keyof typeof PLACEHOLDER_TYPES = 'IMAGE') => {
  const img = event.currentTarget;
  img.src = getFallbackImage(fallbackType);
  img.onerror = null; // 無限ループを防ぐ
}; 