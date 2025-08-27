import React from 'react';

// スキップリンクコンポーネント
export const SkipLink = ({ href, children, className = '' }) => (
  <a
    href={href}
    className={`skip-link ${className}`}
    style={{
      position: 'absolute',
      top: '-40px',
      left: '8px',
      backgroundColor: 'var(--bg)',
      color: 'var(--text)',
      padding: 'var(--space-2) var(--space-4)',
      textDecoration: 'none',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--outline)',
      zIndex: 'var(--z-tooltip)',
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-medium)',
      transition: 'all var(--duration-fast) var(--ease-out)',
      outline: 'none'
    }}
    onFocus={(e) => {
      e.target.style.top = '8px';
      e.target.style.outline = '2px solid var(--outline-focus)';
      e.target.style.outlineOffset = '2px';
    }}
    onBlur={(e) => {
      e.target.style.top = '-40px';
      e.target.style.outline = 'none';
      e.target.style.outlineOffset = '0';
    }}
  >
    {children}
  </a>
);

// ライブリージョンコンポーネント（スクリーンリーダー用のアナウンス）
export const LiveRegion = ({ 
  level = 'polite', 
  children, 
  className = '',
  atomic = true,
  relevant = 'additions text',
  ...props 
}) => (
  <div
    className={`live-region ${className}`}
    aria-live={level}
    aria-atomic={atomic}
    aria-relevant={relevant}
    style={{
      position: 'absolute',
      left: '-10000px',
      width: '1px',
      height: '1px',
      overflow: 'hidden'
    }}
    {...props}
  >
    {children}
  </div>
);

// フォーカストラップフック（モーダル等で使用）
export const useFocusTrap = (isActive = false) => {
  const containerRef = React.useRef(null);
  
  React.useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // 初期フォーカス設定
    if (firstElement) {
      firstElement.focus();
    }

    container.addEventListener('keydown', handleTabKey);
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return containerRef;
};

// キーボードナビゲーション用のヘルパーフック
export const useKeyboardNavigation = (
  items = [],
  onItemSelect,
  options = {}
) => {
  const {
    circular = true,
    orientation = 'vertical', // 'horizontal' | 'vertical'
    activeIndex: controlledActiveIndex,
    onActiveIndexChange
  } = options;

  const [activeIndex, setActiveIndex] = React.useState(controlledActiveIndex || 0);
  
  const currentActiveIndex = controlledActiveIndex !== undefined 
    ? controlledActiveIndex 
    : activeIndex;

  const handleKeyDown = (e) => {
    const isHorizontal = orientation === 'horizontal';
    let nextIndex = currentActiveIndex;

    switch (e.key) {
      case isHorizontal ? 'ArrowRight' : 'ArrowDown':
        e.preventDefault();
        nextIndex = circular && currentActiveIndex === items.length - 1 
          ? 0 
          : Math.min(currentActiveIndex + 1, items.length - 1);
        break;
      
      case isHorizontal ? 'ArrowLeft' : 'ArrowUp':
        e.preventDefault();
        nextIndex = circular && currentActiveIndex === 0 
          ? items.length - 1 
          : Math.max(currentActiveIndex - 1, 0);
        break;
      
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      
      case 'End':
        e.preventDefault();
        nextIndex = items.length - 1;
        break;
      
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (onItemSelect && items[currentActiveIndex]) {
          onItemSelect(items[currentActiveIndex], currentActiveIndex);
        }
        return;
      
      default:
        return;
    }

    if (nextIndex !== currentActiveIndex) {
      if (onActiveIndexChange) {
        onActiveIndexChange(nextIndex);
      } else {
        setActiveIndex(nextIndex);
      }
    }
  };

  return {
    activeIndex: currentActiveIndex,
    setActiveIndex: onActiveIndexChange || setActiveIndex,
    handleKeyDown,
    // Helper props for items
    getItemProps: (index) => ({
      tabIndex: index === currentActiveIndex ? 0 : -1,
      'aria-selected': index === currentActiveIndex,
      onFocus: () => {
        if (onActiveIndexChange) {
          onActiveIndexChange(index);
        } else {
          setActiveIndex(index);
        }
      }
    })
  };
};

// ARIAラベル生成ヘルパー
export const generateId = (prefix = 'ui') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// アナウンサーコンポーネント（動的なアナウンス用）
export const Announcer = ({ 
  message, 
  level = 'polite',
  clearDelay = 1000 
}) => {
  const [currentMessage, setCurrentMessage] = React.useState('');

  React.useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      
      const timer = setTimeout(() => {
        setCurrentMessage('');
      }, clearDelay);
      
      return () => clearTimeout(timer);
    }
  }, [message, clearDelay]);

  if (!currentMessage) return null;

  return (
    <LiveRegion level={level}>
      {currentMessage}
    </LiveRegion>
  );
};

// コンテキストメニュー用のARIA属性ヘルパー
export const useMenuAttributes = (isOpen = false) => {
  const menuId = React.useMemo(() => generateId('menu'), []);
  const buttonId = React.useMemo(() => generateId('menu-button'), []);

  return {
    // メニューボタン用の属性
    buttonProps: {
      id: buttonId,
      'aria-haspopup': true,
      'aria-expanded': isOpen,
      'aria-controls': isOpen ? menuId : undefined
    },
    // メニュー用の属性  
    menuProps: {
      id: menuId,
      role: 'menu',
      'aria-labelledby': buttonId
    }
  };
};

// フォームアクセシビリティヘルパー
export const useFieldAttributes = (label, error, description) => {
  const fieldId = React.useMemo(() => generateId('field'), []);
  const errorId = React.useMemo(() => generateId('error'), []);
  const descId = React.useMemo(() => generateId('desc'), []);

  const describedBy = [
    description ? descId : null,
    error ? errorId : null
  ].filter(Boolean).join(' ');

  return {
    fieldProps: {
      id: fieldId,
      'aria-describedby': describedBy || undefined,
      'aria-invalid': error ? true : undefined
    },
    labelProps: {
      htmlFor: fieldId
    },
    errorProps: {
      id: errorId,
      role: 'alert',
      'aria-live': 'polite'
    },
    descProps: {
      id: descId
    }
  };
};

// ロードステート用のアナウンス
export const LoadingAnnouncement = ({ isLoading, loadingText = '読み込み中' }) => (
  <LiveRegion level="polite">
    {isLoading ? loadingText : '読み込みが完了しました'}
  </LiveRegion>
);

// ランドマーク用のコンテナコンポーネント
export const LandmarkRegion = ({ 
  as: Component = 'div',
  landmark,
  label,
  children,
  ...props 
}) => (
  <Component
    role={landmark}
    aria-label={label}
    {...props}
  >
    {children}
  </Component>
);

export default {
  SkipLink,
  LiveRegion,
  useFocusTrap,
  useKeyboardNavigation,
  generateId,
  Announcer,
  useMenuAttributes,
  useFieldAttributes,
  LoadingAnnouncement,
  LandmarkRegion
};