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
    padding: '16px',
    '@media (min-width: 768px)': {
      padding: '24px'
    }
  },
  
  // モバイル用のフォントサイズ
  mobileFontSizes: {
    h1: {
      fontSize: '24px',
      '@media (min-width: 768px)': {
        fontSize: '32px'
      }
    },
    h2: {
      fontSize: '20px',
      '@media (min-width: 768px)': {
        fontSize: '24px'
      }
    },
    h3: {
      fontSize: '18px',
      '@media (min-width: 768px)': {
        fontSize: '20px'
      }
    },
    body: {
      fontSize: '14px',
      '@media (min-width: 768px)': {
        fontSize: '16px'
      }
    },
    small: {
      fontSize: '12px',
      '@media (min-width: 768px)': {
        fontSize: '14px'
      }
    }
  },
  
  // モバイル用のボタンスタイル
  mobileButton: {
    padding: '12px 16px',
    fontSize: '16px', // タッチしやすいサイズ
    minHeight: '44px', // iOS推奨最小サイズ
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    '@media (min-width: 768px)': {
      padding: '8px 16px',
      fontSize: '14px',
      minHeight: 'auto'
    }
  },
  
  // モバイル用のカードスタイル
  mobileCard: {
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    '@media (min-width: 768px)': {
      padding: '20px',
      marginBottom: '20px'
    }
  },
  
  // モバイル用の入力フィールド
  mobileInput: {
    padding: '12px 16px',
    fontSize: '16px', // iOSでズームを防ぐ
    borderRadius: '8px',
    border: '1px solid #ddd',
    width: '100%',
    boxSizing: 'border-box' as const,
    '@media (min-width: 768px)': {
      padding: '8px 12px',
      fontSize: '14px'
    }
  },
  
  // モバイル用のナビゲーション
  mobileNav: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    background: '#fff',
    borderTop: '1px solid #eee',
    padding: '8px 0',
    zIndex: 1000,
    '@media (min-width: 768px)': {
      position: 'static' as const,
      borderTop: 'none',
      padding: 0
    }
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
    padding: '16px',
    '@media (min-width: 768px)': {
      padding: '24px'
    }
  },
  
  // モバイル用のモーダルコンテンツ
  mobileModalContent: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    maxWidth: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    '@media (min-width: 768px)': {
      padding: '24px',
      maxWidth: '500px'
    }
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
    gridTemplateColumns: '1fr',
    gap: '16px',
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px'
    }
  },
  
  // モバイル用のフレックスボックス
  mobileFlex: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    '@media (min-width: 768px)': {
      flexDirection: 'row' as const,
      gap: '20px'
    }
  },
  
  // モバイル用のサイドバー
  mobileSidebar: {
    position: 'fixed' as const,
    top: 0,
    left: '-100%',
    width: '80%',
    maxWidth: '300px',
    height: '100vh',
    background: '#fff',
    zIndex: 1001,
    transition: 'left 0.3s ease',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
    '@media (min-width: 768px)': {
      position: 'static' as const,
      width: 'auto',
      height: 'auto',
      boxShadow: 'none'
    }
  },
  
  // モバイル用のメインコンテンツ
  mobileMain: {
    flex: 1,
    padding: '16px',
    '@media (min-width: 768px)': {
      padding: '24px'
    }
  }
};

// モバイル向けの地図操作
export const mobileMapControls = {
  // モバイル用の地図コントロール
  mobileMapContainer: {
    height: '60vh',
    '@media (min-width: 768px)': {
      height: '70vh'
    }
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
    gap: '16px',
    padding: '16px',
    '@media (min-width: 768px)': {
      padding: '24px',
      gap: '20px'
    }
  },
  
  // モバイル用のフォームグループ
  mobileFormGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    '@media (min-width: 768px)': {
      gap: '12px'
    }
  },
  
  // モバイル用のラベル
  mobileLabel: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    '@media (min-width: 768px)': {
      fontSize: '16px'
    }
  },
  
  // モバイル用のテキストエリア
  mobileTextarea: {
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    minHeight: '100px',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
    '@media (min-width: 768px)': {
      padding: '8px 12px',
      fontSize: '14px',
      minHeight: '80px'
    }
  },
  
  // モバイル用のファイルアップロード
  mobileFileUpload: {
    border: '2px dashed #ddd',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '@media (min-width: 768px)': {
      padding: '16px'
    }
  }
};

// モバイル向けの通知
export const mobileNotifications = {
  // モバイル用のトースト
  mobileToast: {
    position: 'fixed' as const,
    bottom: '80px', // モバイルナビゲーションの上
    left: '16px',
    right: '16px',
    background: '#333',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    zIndex: 1002,
    '@media (min-width: 768px)': {
      bottom: '20px',
      left: 'auto',
      right: '20px',
      width: 'auto',
      minWidth: '300px'
    }
  }
}; 