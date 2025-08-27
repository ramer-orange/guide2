import React, { useRef, useState, useCallback, useMemo } from "react";
import { Link, useParams } from "react-router-dom"
import { PlanDetailItem } from "@/components/forms/PlanDetailItem";
import { PlanOverview } from "@/components/forms/planOverview";
import { CurrentDay } from "@/components/forms/CurrentDay";
import { usePlanDetails } from "@/hooks/trips/usePlanDetails";
import { usePlanOverview } from "@/hooks/trips/usePlanOverview";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { GoogleMap } from "@/components/maps/GoogleMap";
import { PlanPanel } from "@/components/ui/PlanPanel";
import { Button, IconButton } from "@/components/ui/Button";
import { useToast, ToastContainer } from "@/components/ui/Toast";

import { SkipLink, LiveRegion, Announcer } from "@/components/ui/AccessibilityHelpers";
import { IoArrowBack, IoMenu, IoClose } from "react-icons/io5";

// 旅行プラン作成ページ

export function TripPlan() {
  const { planId } = useParams(); // URLパラメータからplanIdを取得
  const onSpotDeletedRef = useRef(null);
  const [highlightedItemIndex, setHighlightedItemIndex] = useState(null);
  
  // レスポンシブ対応
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  
  // Toast機能
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // 旅行概要
  const {
    error: overviewError,
    loading: overviewLoading,
    tripData,
    calculateDay,
    totalDays,
    handleInputChange,
  } = usePlanOverview(planId)

  // 旅行詳細
  const {
    selectedDay,
    error: detailError,
    loading: detailLoading,
    handleAddPlan,
    addSpotToPlan,
    handlePlanChange,
    handlePlanDelete,
    handleSelectedDay,
    currentDayPlan,
  } = usePlanDetails(planId, totalDays, onSpotDeletedRef);

  // スポット追加時のハイライト処理
  const handleAddSpotToPlan = useCallback((spotData) => {
    addSpotToPlan(spotData);
    
    // 追加されたアイテムをハイライト
    const newIndex = currentDayPlan.length;
    setHighlightedItemIndex(newIndex);
    
    // 1秒後にハイライトを解除
    setTimeout(() => {
      setHighlightedItemIndex(null);
    }, 1000);
    
    // 成功トースト
    showSuccess('スポットを追加', `${spotData.name || 'スポット'}をプランに追加しました`);
  }, [addSpotToPlan, currentDayPlan.length, showSuccess]);

  // 地図コンポーネントを安定化（selectedDayの変更で再レンダリングされないように）
  const stableGoogleMap = useMemo(() => (
    <GoogleMap 
      onAddSpot={handleAddSpotToPlan} 
      planId={planId} 
      onSpotDeleted={onSpotDeletedRef}
    />
  ), [handleAddSpotToPlan, planId, onSpotDeletedRef]);

  // モバイル用の地図コンポーネント（クラス名付き）
  const mobileGoogleMap = useMemo(() => (
    <GoogleMap 
      onAddSpot={handleAddSpotToPlan} 
      planId={planId} 
      onSpotDeleted={onSpotDeletedRef}
      className="mobile-map"
    />
  ), [handleAddSpotToPlan, planId, onSpotDeletedRef]);

  // データがロード中の場合
  if (overviewLoading || detailLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg)',
        color: 'var(--text)'
      }}>
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-8)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid var(--outline)',
            borderTop: '3px solid var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto var(--space-4)'
          }} />
          <p style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-medium)',
            margin: 0
          }}>
            データを読み込み中...
          </p>
        </div>
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (prefers-reduced-motion: reduce) {
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(0deg); }
            }
          }
        `}</style>
      </div>
    );
  }

  // エラー表示
  if (overviewError || detailError) {
    showError('エラーが発生しました', overviewError || detailError);
  }

  // 日別情報を整理
  const dayInfos = Array.from({ length: totalDays }, (_, index) => ({
    day: index + 1,
    date: calculateDay(index + 1)
  }));

  return (
    <>
      <div className="trip-plan-page h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
        {/* ヘッダー（共通） */}
        <header className="px-6 py-8 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex-shrink-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            {/* 左側：タイトル */}
            <div className="flex-1 min-w-0">
              <h1 className={`m-0 ${isDesktop ? 'text-4xl' : 'text-3xl'} font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight mb-3`}>
                旅行プラン作成
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                地図からスポットを選択して、理想の旅行プランを作成しましょう
              </p>
            </div>
            
            {/* 右側：ナビゲーションボタン */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to="/management">
                <Button 
                  variant="ghost" 
                  leftIcon={<IoArrowBack />} 
                  size="sm"
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  {isDesktop ? '管理画面へ戻る' : '戻る'}
                </Button>
              </Link>
            </div>
          </div>
          
          {/* 旅行概要（デスクトップのみ表示） */}
          {isDesktop && (
            <div className="max-w-6xl mx-auto mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    旅行の基本情報
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-0">
                    旅行名と日程を入力してください
                  </p>
                </div>
                <PlanOverview
                  tripData={tripData}
                  onPlanOverviewChange={handleInputChange}
                />
              </div>
            </div>
          )}
        </header>

        {/* メインコンテンツ */}
        <main className="flex-1 overflow-hidden relative">
          {/* モバイル レイアウト */}
          {isMobile && (
            <div className="h-full flex flex-col relative">
              {/* 地図（全画面） */}
              <div className="flex-1 relative overflow-hidden">
                {mobileGoogleMap}
              </div>
              
              {/* PlanPanel（BottomSheet） */}
              <PlanPanel
                currentDayPlan={currentDayPlan}
                selectedDay={selectedDay}
                totalDays={totalDays}
                dayInfos={dayInfos}
                onSelectedDayChange={handleSelectedDay}
                onPlanDetailChange={handlePlanChange}
                onPlanDetailDelete={handlePlanDelete}
                onAddPlan={handleAddPlan}
                highlightedItemIndex={highlightedItemIndex}
                isMobile={true}
              />
            </div>
          )}

          {/* タブレット レイアウト（上下分割） */}
          {isTablet && (
            <div className="h-full flex flex-col gap-6 p-6">
              {/* 上段: 地図 */}
              <div className="h-[60%] rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                {stableGoogleMap}
              </div>
              
              {/* 下段: プラン */}
              <div className="h-[40%] rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                <PlanPanel
                  currentDayPlan={currentDayPlan}
                  selectedDay={selectedDay}
                  totalDays={totalDays}
                  dayInfos={dayInfos}
                  onSelectedDayChange={handleSelectedDay}
                  onPlanDetailChange={handlePlanChange}
                  onPlanDetailDelete={handlePlanDelete}
                  onAddPlan={handleAddPlan}
                  highlightedItemIndex={highlightedItemIndex}
                  isMobile={false}
                />
              </div>
            </div>
          )}

          {/* デスクトップ レイアウト（左右分割 2:1） */}
          {isDesktop && (
            <div className="h-full flex gap-8 p-8">
              {/* 左側: 地図（2/3） */}
              <div className="flex-[2] rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                {stableGoogleMap}
              </div>
              
              {/* 右側: プラン（1/3） */}
              <div className="flex-1 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                <PlanPanel
                  currentDayPlan={currentDayPlan}
                  selectedDay={selectedDay}
                  totalDays={totalDays}
                  dayInfos={dayInfos}
                  onSelectedDayChange={handleSelectedDay}
                  onPlanDetailChange={handlePlanChange}
                  onPlanDetailDelete={handlePlanDelete}
                  onAddPlan={handleAddPlan}
                  highlightedItemIndex={highlightedItemIndex}
                  isMobile={false}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Toast通知 */}
      <ToastContainer 
        toasts={toasts} 
        onRemoveToast={removeToast} 
      />

      {/* レスポンシブスタイル */}
      <style jsx>{`
        @media (max-width: 640px) {
          .trip-plan-page {
            position: relative;
            height: 100vh;
            height: 100dvh; /* Dynamic viewport height */
          }
          
          .mobile-map {
            border-radius: 0 !important;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .trip-plan-page * {
            transition-duration: var(--duration-fast) !important;
            animation-duration: var(--duration-fast) !important;
          }
        }
        
        /* Safari対応 */
        @supports (-webkit-appearance: none) {
          .trip-plan-page {
            height: -webkit-fill-available;
          }
        }
      `}</style>
    </>
  )
}