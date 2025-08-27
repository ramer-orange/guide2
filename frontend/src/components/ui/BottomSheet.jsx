import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

// スナップポイント（高さの割合）
export const SNAP_POINTS = {
  COLLAPSED: 0.16,  // 16%
  HALF: 0.5,        // 50% 
  EXPANDED: 0.88    // 88%
};

// BottomSheetコンポーネント
export const BottomSheet = ({
  isOpen = false,
  onClose,
  children,
  initialSnap = SNAP_POINTS.COLLAPSED,
  allowedSnaps = [SNAP_POINTS.COLLAPSED, SNAP_POINTS.HALF, SNAP_POINTS.EXPANDED],
  dragHandle = true,
  title,
  className = '',
  backdropClickClose = true,
  ...props
}) => {
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const sheetRef = useRef(null);
  const contentRef = useRef(null);

  // 現在の高さを計算
  const currentHeight = `${currentSnap * 100}vh`;

  // マウント時の表示アニメーション
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // スナップポイントに移動
  const snapTo = useCallback((snapPoint) => {
    if (allowedSnaps.includes(snapPoint)) {
      setCurrentSnap(snapPoint);
    }
  }, [allowedSnaps]);

  // 最も近いスナップポイントを計算
  const findNearestSnap = useCallback((height) => {
    const viewportHeight = window.innerHeight;
    const ratio = height / viewportHeight;
    
    return allowedSnaps.reduce((prev, curr) => {
      return Math.abs(curr - ratio) < Math.abs(prev - ratio) ? curr : prev;
    });
  }, [allowedSnaps]);

  // ドラッグ開始（タッチ・マウス）
  const handleStart = useCallback((clientY) => {
    setIsDragging(true);
    setStartY(clientY);
    setStartHeight(currentSnap * window.innerHeight);
    
    // 慣性スクロールを無効化
    document.body.style.overflow = 'hidden';
  }, [currentSnap]);

  // ドラッグ中
  const handleMove = useCallback((clientY) => {
    if (!isDragging) return;

    const diff = startY - clientY;
    const newHeight = startHeight + diff;
    const viewportHeight = window.innerHeight;
    const newRatio = Math.max(0.05, Math.min(0.95, newHeight / viewportHeight));
    
    setCurrentSnap(newRatio);
  }, [isDragging, startY, startHeight]);

  // ドラッグ終了
  const handleEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    document.body.style.overflow = '';

    // 最も近いスナップポイントに移動
    const nearestSnap = findNearestSnap(currentSnap * window.innerHeight);
    
    // 下方向へのスワイプで最小値以下の場合は閉じる
    if (currentSnap < allowedSnaps[0] * 0.8) {
      onClose?.();
    } else {
      snapTo(nearestSnap);
    }
  }, [isDragging, currentSnap, findNearestSnap, snapTo, allowedSnaps, onClose]);

  // マウスイベント
  const handleMouseDown = (e) => {
    if (e.target.closest('.bottom-sheet__drag-handle')) {
      e.preventDefault();
      handleStart(e.clientY);
    }
  };

  const handleMouseMove = useCallback((e) => {
    handleMove(e.clientY);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // タッチイベント
  const handleTouchStart = (e) => {
    if (e.target.closest('.bottom-sheet__drag-handle')) {
      const touch = e.touches[0];
      handleStart(touch.clientY);
    }
  };

  const handleTouchMove = useCallback((e) => {
    if (isDragging) {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientY);
    }
  }, [isDragging, handleMove]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    handleEnd();
  }, [handleEnd]);

  // グローバルイベントリスナー
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // バックドロップクリック
  const handleBackdropClick = (e) => {
    if (backdropClickClose && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  // スナップポイント選択用のボタン
  const SnapButton = ({ snapPoint, label, ariaLabel }) => (
    <button
      type="button"
      onClick={() => snapTo(snapPoint)}
      aria-label={ariaLabel}
      className={`snap-button ${currentSnap === snapPoint ? 'snap-button--active' : ''}`}
      style={{
        background: currentSnap === snapPoint ? 'var(--primary)' : 'var(--outline)',
        color: currentSnap === snapPoint ? 'var(--bg)' : 'var(--text-muted)',
        border: 'none',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        cursor: 'pointer',
        transition: 'all var(--duration-fast) var(--ease-out)'
      }}
    >
      <span className="sr-only">{label}</span>
    </button>
  );

  if (!isVisible) return null;

  return createPortal(
    <div
      className={`bottom-sheet-backdrop ${isOpen ? 'bottom-sheet-backdrop--open' : ''}`}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: isDragging ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)',
        zIndex: 'var(--z-modal)',
        opacity: isOpen ? 1 : 0,
        transition: isDragging ? 'none' : 'all var(--duration-normal) var(--ease-out)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)'
      }}
    >
      <div
        ref={sheetRef}
        className={`bottom-sheet ${className}`}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: currentHeight,
          backgroundColor: 'var(--bg)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          boxShadow: 'var(--elev4)',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: isDragging ? 'none' : 'transform var(--duration-normal) var(--ease-out)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'bottom-sheet-title' : undefined}
        {...props}
      >
        {/* ドラッグハンドル */}
        {dragHandle && (
          <div
            className="bottom-sheet__drag-handle"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-3) var(--space-4)',
              cursor: 'grab',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
            aria-label="ドラッグしてシートのサイズを変更"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                const currentIndex = allowedSnaps.indexOf(currentSnap);
                if (currentIndex < allowedSnaps.length - 1) {
                  snapTo(allowedSnaps[currentIndex + 1]);
                }
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const currentIndex = allowedSnaps.indexOf(currentSnap);
                if (currentIndex > 0) {
                  snapTo(allowedSnaps[currentIndex - 1]);
                } else {
                  onClose?.();
                }
              }
            }}
          >
            {/* ドラッグインジケーター */}
            <div
              style={{
                width: '36px',
                height: '4px',
                backgroundColor: 'var(--outline)',
                borderRadius: 'var(--radius-full)',
                marginRight: 'var(--space-3)'
              }}
            />
            
            {/* スナップポイント インジケーター */}
            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
              {allowedSnaps.map((snapPoint) => (
                <SnapButton
                  key={snapPoint}
                  snapPoint={snapPoint}
                  label={`${Math.round(snapPoint * 100)}%の高さ`}
                  ariaLabel={`シートを${Math.round(snapPoint * 100)}%の高さに変更`}
                />
              ))}
            </div>
          </div>
        )}

        {/* タイトル */}
        {title && (
          <div
            id="bottom-sheet-title"
            style={{
              padding: '0 var(--space-4) var(--space-3)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text)',
              borderBottom: '1px solid var(--outline)'
            }}
          >
            {title}
          </div>
        )}

        {/* コンテンツエリア */}
        <div
          ref={contentRef}
          className="bottom-sheet__content"
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 'var(--space-4)',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {children}
        </div>
      </div>

      {/* アクセシビリティとモーション削減対応 */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .bottom-sheet-backdrop,
          .bottom-sheet {
            transition-duration: var(--duration-fast) !important;
          }
        }
        
        .bottom-sheet__drag-handle:active {
          cursor: grabbing !important;
        }
        
        .bottom-sheet__drag-handle:focus-visible {
          outline: 2px solid var(--outline-focus);
          outline-offset: 2px;
          border-radius: var(--radius-sm);
        }
      `}</style>
    </div>,
    document.body
  );
};

export default BottomSheet;