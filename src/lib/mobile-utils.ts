// モバイル最適化のためのユーティリティ関数

// 画面サイズのブレークポイント
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
} as const;

// デバイスタイプの検出
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
};

// モバイルデバイスの検出
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.mobile;
};

// タッチデバイスの検出
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// モバイル向けスタイルの取得
export const getMobileStyles = () => ({
  // モバイル用のパディング
  mobilePadding: {
    padding: isMobile() ? '16px' : '24px'
  },
  
  // モバイル用のフォントサイズ
  mobileFontSizes: {
    h1: {
      fontSize: isMobile() ? '24px' : '32px'
    },
    h2: {
      fontSize: isMobile() ? '20px' : '24px'
    },
    h3: {
      fontSize: isMobile() ? '18px' : '20px'
    },
    body: {
      fontSize: isMobile() ? '14px' : '16px'
    },
    small: {
      fontSize: isMobile() ? '12px' : '14px'
    }
  },
  
  // モバイル用のボタンスタイル
  mobileButton: {
    padding: isMobile() ? '12px 16px' : '8px 16px',
    fontSize: isMobile() ? '16px' : '14px', // タッチしやすいサイズ
    minHeight: isMobile() ? '44px' : 'auto', // iOS推奨最小サイズ
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s ease'
  },
  
  // モバイル用のカードスタイル
  mobileCard: {
    borderRadius: '12px',
    padding: isMobile() ? '16px' : '20px',
    marginBottom: isMobile() ? '16px' : '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  
  // モバイル用の入力フィールド
  mobileInput: {
    padding: isMobile() ? '12px 16px' : '8px 12px',
    fontSize: isMobile() ? '16px' : '14px', // iOSでズームを防ぐ
    borderRadius: '8px',
    border: '1px solid #ddd',
    width: '100%',
    boxSizing: 'border-box' as const
  },
  
  // モバイル用のナビゲーション
  mobileNav: {
    position: isMobile() ? 'fixed' as const : 'static' as const,
    bottom: isMobile() ? 0 : undefined,
    left: isMobile() ? 0 : undefined,
    right: isMobile() ? 0 : undefined,
    background: '#fff',
    borderTop: isMobile() ? '1px solid #eee' : 'none',
    padding: isMobile() ? '8px 0' : 0,
    zIndex: isMobile() ? 1000 : undefined
  },
  
  // モバイル用のモーダル
  mobileModal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: isMobile() ? '16px' : '24px'
  },
  
  // モバイル用のモーダルコンテンツ
  mobileModalContent: {
    background: '#fff',
    borderRadius: '12px',
    padding: isMobile() ? '20px' : '24px',
    maxWidth: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    ...(isMobile() ? {} : { maxWidth: '500px' })
  }
});

// タッチ操作の最適化
export const touchOptimizations = {
  // タッチターゲットの最小サイズ
  minTouchTarget: '44px',
  
  // タッチフィードバック
  touchFeedback: {
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none' as const,
    cursor: 'pointer'
  },
  
  // スワイプ検出
  detectSwipe: (element: HTMLElement, onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void) => {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      
      const diffX = startX - endX;
      const diffY = startY - endY;
      const minSwipeDistance = 50;
      
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > minSwipeDistance) {
          onSwipe(diffX > 0 ? 'left' : 'right');
        }
      } else {
        if (Math.abs(diffY) > minSwipeDistance) {
          onSwipe(diffY > 0 ? 'up' : 'down');
        }
      }
    };
    
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }
};

// モバイル向けレイアウト
export const mobileLayouts = {
  // モバイル用のグリッド
  mobileGrid: {
    display: 'grid',
    gridTemplateColumns: isMobile() ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: isMobile() ? '16px' : '20px'
  },
  
  // モバイル用のフレックスボックス
  mobileFlex: {
    display: 'flex',
    flexDirection: isMobile() ? 'column' as const : 'row' as const,
    gap: isMobile() ? '16px' : '20px'
  },
  
  // モバイル用のサイドバー
  mobileSidebar: {
    position: isMobile() ? 'fixed' as const : 'static' as const,
    top: isMobile() ? 0 : undefined,
    left: isMobile() ? '-100%' : undefined,
    width: isMobile() ? '80%' : 'auto',
    maxWidth: isMobile() ? '300px' : undefined,
    height: isMobile() ? '100vh' : 'auto',
    background: '#fff',
    zIndex: isMobile() ? 1001 : undefined,
    transition: isMobile() ? 'left 0.3s ease' : undefined,
    boxShadow: isMobile() ? '2px 0 8px rgba(0, 0, 0, 0.1)' : 'none'
  },
  
  // モバイル用のメインコンテンツ
  mobileMain: {
    flex: 1,
    padding: isMobile() ? '16px' : '24px'
  }
};

// モバイル向けの地図操作
export const mobileMapControls = {
  // モバイル用の地図コントロール
  mobileMapContainer: {
    height: isMobile() ? '60vh' : '70vh'
  },
  
  // モバイル用の地図ボタン
  mobileMapButton: {
    position: 'absolute' as const,
    bottom: '20px',
    right: '20px',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#fff',
    border: '1px solid #ddd',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 1000
  },
  
  // モバイル用の地図オーバーレイ
  mobileMapOverlay: {
    position: 'absolute' as const,
    top: '10px',
    left: '10px',
    right: '10px',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000
  }
};

// モバイル向けの投稿フォーム
export const mobileFormStyles = {
  // モバイル用のフォーム
  mobileForm: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: isMobile() ? '16px' : '20px',
    padding: isMobile() ? '16px' : '24px'
  },
  
  // モバイル用のフォームグループ
  mobileFormGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: isMobile() ? '8px' : '12px'
  },
  
  // モバイル用のラベル
  mobileLabel: {
    fontSize: isMobile() ? '14px' : '16px',
    fontWeight: 'bold',
    color: '#333'
  },
  
  // モバイル用のテキストエリア
  mobileTextarea: {
    padding: isMobile() ? '12px 16px' : '8px 12px',
    fontSize: isMobile() ? '16px' : '14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    minHeight: isMobile() ? '100px' : '80px',
    resize: 'vertical' as const,
    fontFamily: 'inherit'
  },
  
  // モバイル用のファイルアップロード
  mobileFileUpload: {
    border: '2px dashed #ddd',
    borderRadius: '8px',
    padding: isMobile() ? '20px' : '16px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

// モバイル向けの通知
export const mobileNotifications = {
  // モバイル用のトースト
  mobileToast: {
    position: 'fixed' as const,
    bottom: isMobile() ? '80px' : '20px', // モバイルナビゲーションの上
    left: isMobile() ? '16px' : 'auto',
    right: isMobile() ? '16px' : '20px',
    background: '#333',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    zIndex: 1002,
    ...(isMobile() ? {} : { width: 'auto', minWidth: '300px' })
  }
}; 