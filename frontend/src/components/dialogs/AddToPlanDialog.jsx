import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export function AddToPlanDialog({ isOpen, onClose, onSubmit, spotData }) {
  const dialogRef = useRef(null);

  // --- Keyboard Navigation & Focus Trap --- //
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const focusableElements = dialogRef.current.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // ダイアログが開いたら最初の要素にフォーカス
    firstElement?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // --- Prevent background scroll --- //
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      dateTime: e.target.elements['plan-date'].value,
      memo: e.target.elements['plan-memo'].value,
    };
    onSubmit(formData);
    onClose();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-40 flex items-center justify-center animate-fade-in"
    >
      <div className="fixed inset-0 bg-background-overlay" onClick={onClose} />
      <div 
        ref={dialogRef}
        className="relative z-50 w-full max-w-md m-4 bg-background-primary rounded-ui-lg shadow-lg animate-fade-in-down"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-4 border-b border-border-primary">
            <h2 id="dialog-title" className="text-lg font-bold text-text-primary">
              プランに追加
            </h2>
            <button type="button" onClick={onClose} aria-label="閉じる" className="ui-button-icon">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="font-semibold text-text-primary bg-background-secondary p-3 rounded-ui-md">
              {spotData?.name || '選択した場所'}
            </div>
            <div>
              <label htmlFor="plan-date" className="block text-sm font-medium text-text-secondary mb-1">日付 / 開始時刻</label>
              <input type="datetime-local" id="plan-date" name="plan-date" className="ui-input-text w-full" required />
            </div>
            <div>
              <label htmlFor="plan-memo" className="block text-sm font-medium text-text-secondary mb-1">メモ</label>
              <textarea id="plan-memo" name="plan-memo" rows={3} className="ui-input-text w-full resize-none" placeholder="この場所に関するメモ..."></textarea>
            </div>
          </div>
          <div className="flex justify-end space-x-3 p-4 bg-background-secondary rounded-b-ui-lg">
            <button type="button" onClick={onClose} className="ui-button-secondary">
              キャンセル
            </button>
            <button type="submit" className="ui-button-primary">
              追加する
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}