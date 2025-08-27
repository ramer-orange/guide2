import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { IoCheckmarkCircle, IoWarning, IoClose, IoInformationCircle } from 'react-icons/io5';

// Toast種別
export const TOAST_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',  
  ERROR: 'error',
  INFO: 'info'
};

// Toastアイテムコンポーネント
const ToastItem = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // アイコンマッピング
  const getIcon = () => {
    switch (toast.type) {
      case TOAST_TYPES.SUCCESS:
        return <IoCheckmarkCircle aria-hidden="true" />;
      case TOAST_TYPES.WARNING:
        return <IoWarning aria-hidden="true" />;
      case TOAST_TYPES.ERROR:
        return <IoClose aria-hidden="true" />;
      case TOAST_TYPES.INFO:
      default:
        return <IoInformationCircle aria-hidden="true" />;
    }
  };

  // マウント時にフェードイン
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // 自動削除処理
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  // 閉じる処理
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 200); // アニメーション時間と合わせる
  };

  // キーボード操作
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClose();
    }
  };

  const toastClasses = `
    toast-item 
    toast-item--${toast.type}
    ${isVisible && !isExiting ? 'toast-item--visible' : ''}
    ${isExiting ? 'toast-item--exiting' : ''}
  `;

  return (
    <div
      className={toastClasses}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--elev3)',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--outline)',
        minWidth: '300px',
        maxWidth: '420px',
        width: '100%',
        opacity: '0',
        transform: 'translateY(-12px)',
        transition: 'all var(--duration-normal) var(--ease-out)',
        pointerEvents: 'auto',
        cursor: 'pointer',
        color: 'var(--text)'
      }}
      onClick={handleClose}
    >
      {/* アイコン */}
      <div
        style={{
          flexShrink: 0,
          width: '20px',
          height: '20px',
          color: 'var(--primary)'
        }}
        className={`toast-icon toast-icon--${toast.type}`}
      >
        {getIcon()}
      </div>

      {/* メッセージ */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <div
            style={{
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-sm)',
              marginBottom: toast.message ? 'var(--space-1)' : 0
            }}
          >
            {toast.title}
          </div>
        )}
        {toast.message && (
          <div
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-muted)',
              lineHeight: 'var(--line-height-normal)'
            }}
          >
            {toast.message}
          </div>
        )}
      </div>

      {/* 閉じるボタン */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            handleClose();
          }
        }}
        aria-label="通知を閉じる"
        style={{
          flexShrink: 0,
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: 'var(--space-1)',
          borderRadius: 'var(--radius-sm)',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color var(--duration-fast) var(--ease-out)'
        }}
        onMouseEnter={(e) => {
          e.target.style.color = 'var(--text)';
        }}
        onMouseLeave={(e) => {
          e.target.style.color = 'var(--text-muted)';
        }}
      >
        <IoClose size={16} />
      </button>

      {/* インラインスタイル for animations */}
      <style jsx>{`
        .toast-item--visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .toast-item--exiting {
          opacity: 0 !important;
          transform: translateY(-8px) scale(0.98) !important;
        }
        .toast-item--success .toast-icon {
          color: var(--accent) !important;
        }
        .toast-item--warning .toast-icon {
          color: var(--warning) !important;
        }
        .toast-item--error .toast-icon {
          color: var(--danger) !important;
        }
        .toast-item--info .toast-icon {
          color: var(--primary) !important;
        }
        .toast-item:focus-visible {
          outline: 2px solid var(--outline-focus);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

// Toastコンテナコンポーネント
export const ToastContainer = ({ toasts, onRemoveToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return createPortal(
    <div
      className="toast-container"
      style={{
        position: 'fixed',
        top: 'var(--space-6)',
        right: 'var(--space-6)',
        zIndex: 'var(--z-toast)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        pointerEvents: 'none',
        maxWidth: '420px',
        width: '100%'
      }}
      role="region"
      aria-label="通知"
    >
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onRemove={onRemoveToast} 
        />
      ))}

      {/* モバイル対応 */}
      <style jsx>{`
        @media (max-width: 640px) {
          .toast-container {
            top: var(--space-4) !important;
            right: var(--space-4) !important;
            left: var(--space-4) !important;
            max-width: none !important;
          }
        }
      `}</style>
    </div>,
    document.body
  );
};

// Toastフック
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  // Toast追加
  const addToast = ({
    title,
    message,
    type = TOAST_TYPES.INFO,
    duration = 3000,
    id = Date.now() + Math.random()
  }) => {
    const newToast = { id, title, message, type, duration };
    setToasts(prev => [...prev, newToast]);
    return newToast.id;
  };

  // Toast削除
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // 全Toast削除
  const clearToasts = () => {
    setToasts([]);
  };

  // 便利メソッド
  const showSuccess = (title, message) => 
    addToast({ title, message, type: TOAST_TYPES.SUCCESS });
  
  const showWarning = (title, message) => 
    addToast({ title, message, type: TOAST_TYPES.WARNING });
  
  const showError = (title, message) => 
    addToast({ title, message, type: TOAST_TYPES.ERROR, duration: 5000 });
  
  const showInfo = (title, message) => 
    addToast({ title, message, type: TOAST_TYPES.INFO });

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    showSuccess,
    showWarning,
    showError,
    showInfo
  };
};

export default ToastContainer;