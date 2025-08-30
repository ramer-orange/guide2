import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const toastTypes = {
  success: {
    icon: <CheckCircle className="w-6 h-6 text-green-500" />,
    aria: 'success',
  },
  error: {
    icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
    aria: 'error',
  },
  info: {
    icon: <Info className="w-6 h-6 text-blue-500" />,
    aria: 'info',
  },
};

export function Toast({ message, type = 'info', duration = 3000, onDismiss }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // アニメーションが終わるのを待ってから親コンポーネントから削除
      setTimeout(onDismiss, 400);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const { icon, aria } = toastTypes[type];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`
        flex items-center w-full max-w-sm p-4 bg-background-primary border border-border-primary rounded-ui-lg shadow-lg
        motion-normal
        ${isVisible ? 'animate-fade-in-down' : 'animate-fade-out-up'}
      `}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="ml-3 mr-4 text-sm font-medium text-text-primary">{message}</div>
      <button 
        onClick={onDismiss} 
        aria-label="通知を閉じる"
        className="ui-button-icon ml-auto -mr-1 -my-1"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

// tailwind.config.js にアニメーション定義を追加する必要がある
/**
 * keyframes: {
 *   'fade-in-down': {
 *     '0%': { opacity: '0', transform: 'translateY(-20px)' },
 *     '100%': { opacity: '1', transform: 'translateY(0)' },
 *   },
 *   'fade-out-up': {
 *     '0%': { opacity: '1', transform: 'translateY(0)' },
 *     '100%': { opacity: '0', transform: 'translateY(-20px)' },
 *   },
 * },
 * animation: {
 *   'fade-in-down': 'fade-in-down 0.3s ease-out',
 *   'fade-out-up': 'fade-out-up 0.3s ease-in',
 * }
 */
