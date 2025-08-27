import { useState, useEffect } from 'react';

// ブレークポイント定義
export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 1024,
  DESKTOP: 1025
};

export const BREAKPOINT_NAMES = {
  MOBILE: 'mobile',
  TABLET: 'tablet', 
  DESKTOP: 'desktop'
};

// 現在のブレークポイントを取得する関数
const getCurrentBreakpoint = (width) => {
  if (width <= BREAKPOINTS.MOBILE) {
    return BREAKPOINT_NAMES.MOBILE;
  } else if (width <= BREAKPOINTS.TABLET) {
    return BREAKPOINT_NAMES.TABLET;
  } else {
    return BREAKPOINT_NAMES.DESKTOP;
  }
};

// メディアクエリに基づいてブレークポイントを判定するフック
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(() => {
    if (typeof window !== 'undefined') {
      return getCurrentBreakpoint(window.innerWidth);
    }
    return BREAKPOINT_NAMES.DESKTOP; // SSR時のデフォルト
  });

  const [windowSize, setWindowSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    }
    return { width: 1024, height: 768 };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });
      setBreakpoint(getCurrentBreakpoint(width));
    };

    // 初期実行
    handleResize();

    // イベントリスナーの追加（debouncing付き）
    let timeoutId;
    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedHandleResize);
    
    // クリーンアップ
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // 便利な判定関数
  const isMobile = breakpoint === BREAKPOINT_NAMES.MOBILE;
  const isTablet = breakpoint === BREAKPOINT_NAMES.TABLET;
  const isDesktop = breakpoint === BREAKPOINT_NAMES.DESKTOP;
  const isMobileOrTablet = isMobile || isTablet;
  const isTabletOrDesktop = isTablet || isDesktop;

  return {
    breakpoint,
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isMobileOrTablet,
    isTabletOrDesktop,
    // 具体的な幅での判定
    isWidth: (width) => windowSize.width === width,
    isMinWidth: (width) => windowSize.width >= width,
    isMaxWidth: (width) => windowSize.width <= width,
    isBetweenWidth: (minWidth, maxWidth) => 
      windowSize.width >= minWidth && windowSize.width <= maxWidth
  };
};

// CSS-in-JSで使用するためのメディアクエリ文字列を生成
export const mediaQuery = {
  mobile: `@media (max-width: ${BREAKPOINTS.MOBILE}px)`,
  tablet: `@media (min-width: ${BREAKPOINTS.MOBILE + 1}px) and (max-width: ${BREAKPOINTS.TABLET}px)`,
  desktop: `@media (min-width: ${BREAKPOINTS.DESKTOP}px)`,
  mobileOrTablet: `@media (max-width: ${BREAKPOINTS.TABLET}px)`,
  tabletOrDesktop: `@media (min-width: ${BREAKPOINTS.MOBILE + 1}px)`,
  
  // 縦向き・横向き
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
  
  // High DPI対応
  retina: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  
  // アクセシビリティ
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  highContrast: '@media (prefers-contrast: high)',
  darkMode: '@media (prefers-color-scheme: dark)',
  lightMode: '@media (prefers-color-scheme: light)'
};

// CSS変数との連携用（CSS-in-JSライブラリで使用）
export const breakpointVars = {
  mobile: 'var(--breakpoint-mobile)',
  tablet: 'var(--breakpoint-tablet)', 
  desktop: 'var(--breakpoint-desktop)'
};

export default useBreakpoint;