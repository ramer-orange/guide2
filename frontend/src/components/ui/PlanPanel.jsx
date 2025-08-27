import React, { useState, useEffect, useRef } from 'react';
import { IoAdd, IoTime, IoReorderFour, IoClose, IoCheckmark } from 'react-icons/io5';
import { Button, IconButton } from './Button';
import { BottomSheet, SNAP_POINTS } from './BottomSheet';

const EnhancedPlanDetailItem = ({ 
  item, 
  index, 
  onPlanDetailChange, 
  onPlanDetailDelete,
  isHighlighted = false,
  isDragging = false
}) => {
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
      className={`relative p-6 mb-4 rounded-xl border transition-all duration-200 ease-out ${
        isHighlighted 
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 shadow-md' 
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600'
      } ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      
      
              {/* ドラッグハンドル */}
        <div
          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => e.stopPropagation()}
          role="button"
          tabIndex={0}
          aria-label={`${item.title || 'アイテム'}を移動`}
        >
          <IoReorderFour size={16} />
        </div>

      <div className="ml-8 mr-8 space-y-4">
        {/* 時刻入力 */}
        <div>
          <label
            htmlFor={`arrivalTime-${index}`}
            className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400"
          />
        </div>

        {/* タイトル入力 */}
        <div>
          <label
            htmlFor={`title-${index}`}
            className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400"
          />
        </div>

        {/* メモ入力 */}
        <div>
          <label
            htmlFor={`memo-${index}`}
            className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-400"
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
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 resize-vertical font-inherit min-h-[80px]"
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
        className="absolute top-2 right-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
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
    className={`day-tab ${isActive ? 'day-tab--active' : ''} px-5 py-4 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 ease-out min-w-[90px] text-center relative overflow-hidden ${
      isActive 
        ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl border-none transform scale-105' 
        : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-600 hover:-translate-y-0.5 hover:shadow-lg'
    }`}
    aria-label={`${day}日目 ${dayInfo ? `(${dayInfo.date})` : ''}`}
  >
    {/* アクティブ時の装飾的な背景 */}
    {isActive && (
      <>
        {/* メインのグラデーション背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-500/10 rounded-xl" />
        
        {/* 微細な光の効果 */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-transparent rounded-xl" />
        
        {/* 下部のアクセント */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400/60 via-indigo-400/60 to-purple-400/60 rounded-b-xl" />
        
        {/* 微細なパターン効果 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-2 right-2 w-2 h-2 bg-white/20 rounded-full" />
          <div className="absolute top-4 right-6 w-1 h-1 bg-white/15 rounded-full" />
          <div className="absolute top-6 right-3 w-1.5 h-1.5 bg-white/25 rounded-full" />
        </div>
      </>
    )}
    
    <div className="relative z-10">
      <div className="text-lg font-bold mb-1 drop-shadow-sm">
        Day {day}
      </div>
      {dayInfo?.date && (
              <div className={`text-xs font-medium ${isActive ? 'text-white/95 drop-shadow-sm' : 'opacity-70'}`}>
        {dayInfo.date}
      </div>
      )}
    </div>
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
  // const [currentSnap, setCurrentSnap] = useState(SNAP_POINTS.COLLAPSED);
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

  const panelContent = (
    <div className="plan-panel-content h-full flex flex-col">
      {/* ヘッダー */}
      <div className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 relative">
        {/* 装飾的な背景要素 */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-600 to-green-500 opacity-5 rounded-full transform translate-x-8 -translate-y-8" />
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div>
            <h2 className="m-0 text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              旅行プラン
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-0">
              日別の詳細なスケジュールを管理
            </p>
          </div>
        </div>

        {/* 日タブ */}
        <div className="flex gap-3 overflow-auto pb-2 mb-4 relative z-10 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
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
      </div>

      {/* コンテンツエリア */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto px-6 py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
      >
        {currentDayPlan.length === 0 ? (
          <div className="text-center py-12 px-6 text-gray-600 dark:text-gray-400 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 my-4">
            <div className="text-6xl mb-6 opacity-60 grayscale-[30%]">
              🗺️
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              まだスポットがありません
            </h3>
            <p className="text-base leading-relaxed max-w-xs mx-auto">
              地図からスポットを選択して、理想の旅行プランを作成しましょう
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
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <Button
          variant="outline"
          leftIcon={<IoAdd />}
          onClick={onAddPlan}
          isFullWidth
          ariaLabel="プランを追加"
          className="rounded-xl p-4 text-base font-semibold border-2 border-blue-600 text-blue-600 bg-white dark:bg-gray-900 transition-all duration-200 ease-out shadow-sm hover:bg-blue-600 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
        >
          プランを追加
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
          className="fixed bottom-6 left-6 right-6 z-30 rounded-2xl px-6 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-green-500 border-none shadow-lg transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl"
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
      className={`plan-panel ${className} h-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col`}
    >
      {panelContent}
    </div>
  );
};

export default PlanPanel;