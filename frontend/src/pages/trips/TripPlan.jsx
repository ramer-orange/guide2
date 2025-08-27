import React, { useRef, useState } from "react";
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

  // スポット追加時のハイライト処理
  const handleAddSpotToPlan = (spotData) => {
    addSpotToPlan(spotData);
    
    // 追加されたアイテムをハイライト
    const newIndex = currentDayPlan.length;
    setHighlightedItemIndex(newIndex);
    
    // 1秒後にハイライトを解除
    setTimeout(() => {
      setHighlightedItemIndex(null);
    }, 1000);
    
    // 成功トースト
    showSuccess('スポットを追加', `${spotData.name || 'スポット'}をDay ${selectedDay}に追加しました`);
  };

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
      <div className="trip-plan-page" style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg)',
        overflow: 'hidden'
      }}>
        {/* ヘッダー（共通） */}
        <header style={{
          padding: 'var(--space-4) var(--space-6)',
          borderBottom: '1px solid var(--outline)',
          backgroundColor: 'var(--bg)',
          flexShrink: 0,
          zIndex: 'var(--z-sticky)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Link to="/management">
                <Button variant="ghost" leftIcon={<IoArrowBack />} size="sm">
                  {isDesktop ? '管理画面へ戻る' : '戻る'}
                </Button>
              </Link>
              <h1 style={{
                margin: 0,
                fontSize: isDesktop ? 'var(--font-size-2xl)' : 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--text)'
              }}>
                プラン作成
              </h1>
            </div>
            

          </div>
          
          {/* 旅行概要（デスクトップのみ表示） */}
          {isDesktop && (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <PlanOverview
                tripData={tripData}
                onPlanOverviewChange={handleInputChange}
              />
            </div>
          )}
        </header>

        {/* メインコンテンツ */}
        <main style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* モバイル レイアウト */}
          {isMobile && (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* 地図（全画面） */}
              <div style={{
                flex: 1,
                position: 'relative'
              }}>
                <GoogleMap 
                  onAddSpot={handleAddSpotToPlan} 
                  planId={planId} 
                  onSpotDeleted={onSpotDeletedRef}
                  className="mobile-map"
                />
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
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              padding: 'var(--space-4)'
            }}>
              {/* 上段: 地図 */}
              <div style={{
                height: '60%',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden'
              }}>
                <GoogleMap 
                  onAddSpot={handleAddSpotToPlan} 
                  planId={planId} 
                  onSpotDeleted={onSpotDeletedRef}
                />
              </div>
              
              {/* 下段: プラン */}
              <div style={{ height: '40%' }}>
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
            <div style={{
              height: '100%',
              display: 'flex',
              gap: 'var(--space-6)',
              padding: 'var(--space-6)'
            }}>
              {/* 左側: 地図（2/3） */}
              <div style={{
                flex: '2',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden'
              }}>
                <GoogleMap 
                  onAddSpot={handleAddSpotToPlan} 
                  planId={planId} 
                  onSpotDeleted={onSpotDeletedRef}
                />
              </div>
              
              {/* 右側: プラン（1/3） */}
              <div style={{ flex: '1' }}>
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