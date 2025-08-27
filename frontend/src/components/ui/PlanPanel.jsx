import React, { useState, useEffect, useRef } from 'react';
import { IoAdd, IoTime, IoReorderFour, IoClose, IoCheckmark } from 'react-icons/io5';
import { Button, IconButton } from './Button';
import { BottomSheet, SNAP_POINTS } from './BottomSheet';

// 強化されたPlanDetailItem
const EnhancedPlanDetailItem = ({ 
  item, 
  index, 
  onPlanDetailChange, 
  onPlanDetailDelete,
  isHighlighted = false,
  isDragging = false
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field, value) => {
    const event = {
      target: {
        name: field,
        value: value
      }
    };
    onPlanDetailChange(index, event);
  };

  return (
    <div
      className={`plan-detail-item ${isHighlighted ? 'plan-detail-item--highlighted' : ''} ${isDragging ? 'plan-detail-item--dragging' : ''}`}
      style={{
        position: 'relative',
        padding: 'var(--space-4)',
        backgroundColor: isHighlighted ? 'var(--primary)' : 'var(--surface)',
        color: isHighlighted ? 'var(--bg)' : 'var(--text)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--outline)',
        marginBottom: 'var(--space-3)',
        transition: 'all var(--duration-normal) var(--ease-out)',
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'rotate(5deg)' : 'none'
      }}
    >
      {/* ドラッグハンドル */}
      <div
        className="drag-handle"
        style={{
          position: 'absolute',
          left: 'var(--space-2)',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
          cursor: 'grab',
          padding: 'var(--space-1)'
        }}
        onMouseDown={(e) => e.stopPropagation()}
        role="button"
        tabIndex={0}
        aria-label={`${item.title || 'アイテム'}を移動`}
      >
        <IoReorderFour size={16} />
      </div>

      <div style={{ marginLeft: 'var(--space-8)', marginRight: 'var(--space-8)' }}>
        {/* 時刻入力 */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <label
            htmlFor={`arrivalTime-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              marginBottom: 'var(--space-2)',
              color: isHighlighted ? 'var(--bg)' : 'var(--text)'
            }}
          >
            <IoTime size={16} aria-hidden="true" />
            到着時刻
          </label>
          <input
            type="time"
            id={`arrivalTime-${index}`}
            name="arrivalTime"
            value={item.arrivalTime || ''}
            onChange={(e) => handleChange('arrivalTime', e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--space-2) var(--space-3)',
              border: `1px solid ${isHighlighted ? 'rgba(255,255,255,0.3)' : 'var(--outline)'}`,
              borderRadius: 'var(--radius)',
              backgroundColor: isHighlighted ? 'rgba(255,255,255,0.1)' : 'var(--bg)',
              color: isHighlighted ? 'var(--bg)' : 'var(--text)',
              fontSize: 'var(--font-size-sm)',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = isHighlighted ? 'rgba(255,255,255,0.6)' : 'var(--outline-focus)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = isHighlighted ? 'rgba(255,255,255,0.3)' : 'var(--outline)';
            }}
          />
        </div>

        {/* タイトル入力 */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <label
            htmlFor={`title-${index}`}
            style={{
              display: 'block',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              marginBottom: 'var(--space-2)',
              color: isHighlighted ? 'var(--bg)' : 'var(--text)'
            }}
          >
            スポット名
          </label>
          <input
            type="text"
            id={`title-${index}`}
            name="title"
            value={item.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="スポット名を入力..."
            style={{
              width: '100%',
              padding: 'var(--space-2) var(--space-3)',
              border: `1px solid ${isHighlighted ? 'rgba(255,255,255,0.3)' : 'var(--outline)'}`,
              borderRadius: 'var(--radius)',
              backgroundColor: isHighlighted ? 'rgba(255,255,255,0.1)' : 'var(--bg)',
              color: isHighlighted ? 'var(--bg)' : 'var(--text)',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-medium)',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = isHighlighted ? 'rgba(255,255,255,0.6)' : 'var(--outline-focus)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = isHighlighted ? 'rgba(255,255,255,0.3)' : 'var(--outline)';
            }}
          />
        </div>

        {/* メモ入力 */}
        <div style={{ marginBottom: 'var(--space-2)' }}>
          <label
            htmlFor={`memo-${index}`}
            style={{
              display: 'block',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              marginBottom: 'var(--space-2)',
              color: isHighlighted ? 'var(--bg)' : 'var(--text)'
            }}
          >
            メモ
          </label>
          <textarea
            id={`memo-${index}`}
            name="memo"
            value={item.memo || ''}
            onChange={(e) => handleChange('memo', e.target.value)}
            placeholder="メモや注意事項..."
            rows={2}
            style={{
              width: '100%',
              padding: 'var(--space-2) var(--space-3)',
              border: `1px solid ${isHighlighted ? 'rgba(255,255,255,0.3)' : 'var(--outline)'}`,
              borderRadius: 'var(--radius)',
              backgroundColor: isHighlighted ? 'rgba(255,255,255,0.1)' : 'var(--bg)',
              color: isHighlighted ? 'var(--bg)' : 'var(--text)',
              fontSize: 'var(--font-size-sm)',
              lineHeight: 'var(--line-height-normal)',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = isHighlighted ? 'rgba(255,255,255,0.6)' : 'var(--outline-focus)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = isHighlighted ? 'rgba(255,255,255,0.3)' : 'var(--outline)';
            }}
          />
        </div>
      </div>

      {/* 削除ボタン */}
      <IconButton
        icon={<IoClose />}
        onClick={() => onPlanDetailDelete(index)}
        variant="ghost"
        size="sm"
        ariaLabel={`${item.title || 'このアイテム'}を削除`}
        style={{
          position: 'absolute',
          top: 'var(--space-2)',
          right: 'var(--space-2)',
          color: isHighlighted ? 'var(--bg)' : 'var(--text-muted)'
        }}
      />

      {/* ハイライト効果のアニメーション */}
      {isHighlighted && (
        <style jsx>{`
          @keyframes highlight-pulse {
            0% { box-shadow: 0 0 0 0 var(--primary); }
            70% { box-shadow: 0 0 0 8px rgba(37, 99, 235, 0); }
            100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
          }
          .plan-detail-item--highlighted {
            animation: highlight-pulse 1.5s ease-in-out;
          }
        `}</style>
      )}

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .plan-detail-item,
          .plan-detail-item--highlighted {
            transition-duration: var(--duration-fast) !important;
            animation-duration: var(--duration-fast) !important;
          }
        }
        
        .drag-handle:active {
          cursor: grabbing !important;
        }
        
        .drag-handle:focus-visible {
          outline: 2px solid var(--outline-focus);
          outline-offset: 2px;
          border-radius: var(--radius-sm);
        }
      `}</style>
    </div>
  );
};

// 日タブコンポーネント
const DayTab = ({ day, isActive, onClick, dayInfo }) => (
  <button
    type="button"
    onClick={() => onClick(day)}
    className={`day-tab ${isActive ? 'day-tab--active' : ''}`}
    style={{
      padding: 'var(--space-3) var(--space-4)',
      border: 'none',
      borderRadius: 'var(--radius)',
      backgroundColor: isActive ? 'var(--primary)' : 'transparent',
      color: isActive ? 'var(--bg)' : 'var(--text)',
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-medium)',
      cursor: 'pointer',
      transition: 'all var(--duration-fast) var(--ease-out)',
      minWidth: '80px',
      textAlign: 'center'
    }}
    onMouseEnter={(e) => {
      if (!isActive) {
        e.target.style.backgroundColor = 'var(--surface)';
      }
    }}
    onMouseLeave={(e) => {
      if (!isActive) {
        e.target.style.backgroundColor = 'transparent';
      }
    }}
    aria-label={`${day}日目 ${dayInfo ? `(${dayInfo.date})` : ''}`}
  >
    <div>Day {day}</div>
    {dayInfo?.date && (
      <div
        style={{
          fontSize: 'var(--font-size-xs)',
          opacity: 0.8,
          marginTop: 'var(--space-1)'
        }}
      >
        {dayInfo.date}
      </div>
    )}
  </button>
);

// メインのPlanPanelコンポーネント
export const PlanPanel = ({
  currentDayPlan = [],
  selectedDay = 1,
  totalDays = 1,
  dayInfos = [],
  onSelectedDayChange,
  onPlanDetailChange,
  onPlanDetailDelete,
  onAddPlan,
  highlightedItemIndex = null,
  className = '',
  isMobile = false
}) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [currentSnap, setCurrentSnap] = useState(SNAP_POINTS.COLLAPSED);
  const scrollRef = useRef(null);

  // ハイライトされたアイテムへのスクロール
  useEffect(() => {
    if (highlightedItemIndex !== null && scrollRef.current) {
      const highlightedElement = scrollRef.current.querySelector(
        `.plan-detail-item:nth-child(${highlightedItemIndex + 1})`
      );
      
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [highlightedItemIndex]);

  // 移動時間計算（仮想的な実装）
  const calculateTotalTime = () => {
    if (!currentDayPlan || currentDayPlan.length === 0) return null;
    
    const firstTime = currentDayPlan[0]?.arrivalTime;
    const lastTime = currentDayPlan[currentDayPlan.length - 1]?.arrivalTime;
    
    if (firstTime && lastTime) {
      return `${firstTime} - ${lastTime}`;
    }
    
    return null;
  };

  const panelContent = (
    <div className="plan-panel-content" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* ヘッダー */}
      <div
        style={{
          padding: 'var(--space-4) var(--space-6)',
          borderBottom: '1px solid var(--outline)',
          flexShrink: 0
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-4)'
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text)'
            }}
          >
            旅行プラン
          </h2>
        </div>

        {/* 日タブ */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-2)',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 'var(--space-2)',
            marginBottom: 'var(--space-3)'
          }}
        >
          {Array.from({ length: totalDays }, (_, index) => {
            const day = index + 1;
            return (
              <DayTab
                key={day}
                day={day}
                isActive={selectedDay === day}
                onClick={onSelectedDayChange}
                dayInfo={dayInfos[index]}
              />
            );
          })}
        </div>

        {/* 現在の日の情報 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-2)'
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--text)'
              }}
            >
              Day {selectedDay}
            </h3>
            {dayInfos[selectedDay - 1]?.date && (
              <p
                style={{
                  margin: '0',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--text-muted)'
                }}
              >
                {dayInfos[selectedDay - 1].date}
              </p>
            )}
          </div>
          
          {calculateTotalTime() && (
            <div
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)'
              }}
            >
              <IoTime size={14} aria-hidden="true" />
              {calculateTotalTime()}
            </div>
          )}
        </div>
      </div>

      {/* コンテンツエリア */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: 'var(--space-4) var(--space-6)',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {currentDayPlan.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: 'var(--space-8) var(--space-4)',
              color: 'var(--text-muted)'
            }}
          >
            <div
              style={{
                fontSize: '48px',
                marginBottom: 'var(--space-4)',
                opacity: 0.5
              }}
            >
              📍
            </div>
            <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2)' }}>
              まだスポットがありません
            </p>
            <p style={{ fontSize: 'var(--font-size-sm)' }}>
              地図からスポットを選択してプランに追加しましょう
            </p>
          </div>
        ) : (
          <>
            {currentDayPlan.map((item, index) => (
              <EnhancedPlanDetailItem
                key={`plan-item-${index}`}
                item={item}
                index={index}
                onPlanDetailChange={onPlanDetailChange}
                onPlanDetailDelete={onPlanDetailDelete}
                isHighlighted={highlightedItemIndex === index}
              />
            ))}
          </>
        )}
      </div>

      {/* フッター */}
      <div
        style={{
          padding: 'var(--space-4) var(--space-6)',
          borderTop: '1px solid var(--outline)',
          flexShrink: 0
        }}
      >
        <Button
          variant="outline"
          leftIcon={<IoAdd />}
          onClick={onAddPlan}
          isFullWidth
          ariaLabel="メモを追加"
        >
          メモを追加
        </Button>
      </div>
    </div>
  );

  // モバイル版（BottomSheet）
  if (isMobile) {
    return (
      <>
        {/* モバイル用トリガーボタン */}
        <Button
          variant="primary"
          onClick={() => setIsBottomSheetOpen(true)}
          style={{
            position: 'fixed',
            bottom: 'var(--space-6)',
            left: 'var(--space-6)',
            right: 'var(--space-6)',
            zIndex: 'var(--z-fixed)'
          }}
        >
          プラン詳細 ({currentDayPlan.length})
        </Button>

        <BottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          title="旅行プラン"
          allowedSnaps={[SNAP_POINTS.COLLAPSED, SNAP_POINTS.HALF, SNAP_POINTS.EXPANDED]}
          initialSnap={SNAP_POINTS.HALF}
        >
          {panelContent}
        </BottomSheet>
      </>
    );
  }

  // デスクトップ版（固定パネル）
  return (
    <div
      className={`plan-panel ${className}`}
      style={{
        height: '100%',
        backgroundColor: 'var(--bg)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--outline)',
        boxShadow: 'var(--elev1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {panelContent}
    </div>
  );
};

export default PlanPanel;