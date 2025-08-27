import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IoClose, IoCalendar, IoTime } from 'react-icons/io5';

// AddToPlanDialog コンポーネント
export const AddToPlanDialog = ({
  isOpen = false,
  onClose,
  onConfirm,
  spotData = null,
  planDays = [],
  defaultDay = 1,
  defaultTime = '09:00',
  className = ''
}) => {
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const [startTime, setStartTime] = useState(defaultTime);
  const [memo, setMemo] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const dialogRef = useRef(null);
  const firstInputRef = useRef(null);

  // 表示/非表示のアニメーション制御
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // フォーカストラップ設定
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = '';
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ダイアログ開いた時の初期フォーカス
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      const timer = setTimeout(() => {
        firstInputRef.current.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // フォーカストラップ
  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableElements = dialog.querySelectorAll(
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

    dialog.addEventListener('keydown', handleTabKey);
    return () => dialog.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  // 閉じる処理
  const handleClose = () => {
    onClose();
    // フォーム状態をリセット
    setTimeout(() => {
      setSelectedDay(defaultDay);
      setStartTime(defaultTime);
      setMemo('');
    }, 200);
  };

  // 確定処理
  const handleConfirm = (e) => {
    e.preventDefault();
    
    if (!spotData) return;

    const planData = {
      spotData,
      day: selectedDay,
      startTime,
      memo: memo.trim()
    };

    onConfirm(planData);
    handleClose();
  };

  // バックドロップクリック
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // 日付表示用のフォーマッター
  const formatDayLabel = (dayIndex) => {
    const day = planDays[dayIndex - 1];
    return day ? `Day ${dayIndex} (${day.date})` : `Day ${dayIndex}`;
  };

  if (!isVisible) return null;

  return createPortal(
    <div
      className={`dialog-backdrop ${isOpen ? 'dialog-backdrop--open' : ''}`}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 'var(--z-modal)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
        opacity: isOpen ? 1 : 0,
        transition: 'opacity var(--duration-normal) var(--ease-out)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)'
      }}
    >
      <div
        ref={dialogRef}
        className={`add-to-plan-dialog ${className}`}
        style={{
          backgroundColor: 'var(--bg)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--elev4)',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflow: 'auto',
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-20px)',
          transition: 'transform var(--duration-normal) var(--ease-out)',
          WebkitOverflowScrolling: 'touch'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        {/* ヘッダー */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-6) var(--space-6) 0',
            borderBottom: '1px solid var(--outline)'
          }}
        >
          <h2
            id="dialog-title"
            style={{
              margin: 0,
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text)'
            }}
          >
            プランに追加
          </h2>
          
          <button
            type="button"
            onClick={handleClose}
            aria-label="ダイアログを閉じる"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius)',
              transition: 'color var(--duration-fast) var(--ease-out)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* スポット情報 */}
        {spotData && (
          <div
            id="dialog-description"
            style={{
              padding: 'var(--space-4) var(--space-6)',
              borderBottom: '1px solid var(--outline)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
              {spotData.photo && (
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    backgroundColor: 'var(--surface)'
                  }}
                >
                  <img
                    src={spotData.photo}
                    alt={spotData.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    margin: '0 0 var(--space-1)',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--text)'
                  }}
                >
                  {spotData.name}
                </h3>
                {spotData.rating && (
                  <div
                    style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--text-muted)',
                      marginBottom: 'var(--space-1)'
                    }}
                  >
                    ★ {spotData.rating} / 5
                  </div>
                )}
                {spotData.address && (
                  <div
                    style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--text-muted)',
                      lineHeight: 'var(--line-height-normal)'
                    }}
                  >
                    {spotData.address}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* フォーム */}
        <form onSubmit={handleConfirm}>
          <div style={{ padding: 'var(--space-6)' }}>
            {/* 日付・時刻セクション */}
            <div
              style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius)',
                marginBottom: 'var(--space-4)'
              }}
            >
              <h4
                style={{
                  margin: '0 0 var(--space-3)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}
              >
                <IoCalendar aria-hidden="true" />
                日程と時刻
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                {/* 日付選択 */}
                <div>
                  <label
                    htmlFor="day-select"
                    style={{
                      display: 'block',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--text)',
                      marginBottom: 'var(--space-1)'
                    }}
                  >
                    日程
                  </label>
                  <select
                    ref={firstInputRef}
                    id="day-select"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(Number(e.target.value))}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--space-2) var(--space-3)',
                      border: '1px solid var(--outline)',
                      borderRadius: 'var(--radius)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text)',
                      fontSize: 'var(--font-size-sm)',
                      outline: 'none',
                      transition: 'border-color var(--duration-fast) var(--ease-out)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--outline-focus)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--outline)'}
                  >
                    {Array.from({ length: planDays.length || 7 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        {formatDayLabel(day)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 時刻選択 */}
                <div>
                  <label
                    htmlFor="time-input"
                    style={{
                      display: 'block',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--text)',
                      marginBottom: 'var(--space-1)'
                    }}
                  >
                    開始時刻
                  </label>
                  <input
                    type="time"
                    id="time-input"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--space-2) var(--space-3)',
                      border: '1px solid var(--outline)',
                      borderRadius: 'var(--radius)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text)',
                      fontSize: 'var(--font-size-sm)',
                      outline: 'none',
                      transition: 'border-color var(--duration-fast) var(--ease-out)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--outline-focus)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--outline)'}
                  />
                </div>
              </div>
            </div>

            {/* メモセクション */}
            <div>
              <label
                htmlFor="memo-input"
                style={{
                  display: 'block',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--text)',
                  marginBottom: 'var(--space-2)'
                }}
              >
                メモ（任意）
              </label>
              <textarea
                id="memo-input"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="メモや注意事項があれば入力してください..."
                rows={3}
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  border: '1px solid var(--outline)',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text)',
                  fontSize: 'var(--font-size-sm)',
                  lineHeight: 'var(--line-height-normal)',
                  outline: 'none',
                  transition: 'border-color var(--duration-fast) var(--ease-out)',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--outline-focus)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--outline)'}
              />
            </div>
          </div>

          {/* ボタン */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-3)',
              padding: 'var(--space-6)',
              paddingTop: 0,
              borderTop: '1px solid var(--outline)'
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              style={{
                flex: 1,
                padding: 'var(--space-3) var(--space-4)',
                border: '1px solid var(--outline)',
                borderRadius: 'var(--radius)',
                backgroundColor: 'transparent',
                color: 'var(--text-muted)',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-out)',
                minHeight: 'var(--tap-target-min)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--surface)';
                e.target.style.color = 'var(--text)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-muted)';
              }}
            >
              キャンセル
            </button>
            
            <button
              type="submit"
              style={{
                flex: 1,
                padding: 'var(--space-3) var(--space-4)',
                border: 'none',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--primary)',
                color: 'var(--bg)',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-out)',
                minHeight: 'var(--tap-target-min)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-hover)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary)'}
            >
              追加する
            </button>
          </div>
        </form>

        {/* アクセシビリティとモーション削減対応 */}
        <style jsx>{`
          @media (prefers-reduced-motion: reduce) {
            .dialog-backdrop,
            .add-to-plan-dialog {
              transition-duration: var(--duration-fast) !important;
            }
          }
          
          .add-to-plan-dialog select:focus-visible,
          .add-to-plan-dialog input:focus-visible,
          .add-to-plan-dialog textarea:focus-visible,
          .add-to-plan-dialog button:focus-visible {
            outline: 2px solid var(--outline-focus) !important;
            outline-offset: 2px !important;
          }
          
          @media (max-width: 640px) {
            .add-to-plan-dialog {
              margin: var(--space-4) !important;
              max-height: calc(100vh - var(--space-8)) !important;
            }
          }
        `}</style>
      </div>
    </div>,
    document.body
  );
};

export default AddToPlanDialog;