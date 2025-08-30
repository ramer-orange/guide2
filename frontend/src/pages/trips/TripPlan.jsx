import React, { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PlanDetailItem } from "@/components/forms/PlanDetailItem";
import { PlanOverview } from "@/components/forms/planOverview";
import { CurrentDay } from "@/components/forms/CurrentDay";
import { usePlanDetails } from "@/hooks/trips/usePlanDetails";
import { usePlanOverview } from "@/hooks/trips/usePlanOverview";
import { GoogleMap } from "@/components/maps/GoogleMap";
import { useBottomSheet } from "@/hooks/ui/useBottomSheet";
import { Home, ChevronUp, ChevronDown } from 'lucide-react'; // Homeアイコンをインポート

export function TripPlan() {
  const { planId } = useParams();
  const onSpotDeletedRef = useRef(null);
  const previousDayPlanRef = useRef([]);
  const planItemsContainerRef = useRef(null);

  const [highlightedItemId, setHighlightedItemId] = useState(null);

  // useBottomSheetからsetSnapIndexも受け取る
  const { sheetStyle, setSnapIndex } = useBottomSheet({ snapPoints: [16, 50, 88], initialSnap: 0 });
  const { overviewError, overviewLoading, tripData, calculateDay, totalDays, handleInputChange } = usePlanOverview(planId);
  const { selectedDay, detailError, detailLoading, handleAddPlan, addSpotToPlan, handlePlanChange, handlePlanDelete, handleSelectedDay, currentDayPlan, initializePlanContentsForDays } = usePlanDetails(planId, totalDays, onSpotDeletedRef);

  // --- Highlight and Scroll on new item --- //
  useEffect(() => {
    if (currentDayPlan && currentDayPlan.length > previousDayPlanRef.current.length) {
      const newItem = currentDayPlan.find(item => !previousDayPlanRef.current.some(pItem => pItem.id === item.id));
      if (newItem) {
        setHighlightedItemId(newItem.id);
      }
    }
    previousDayPlanRef.current = currentDayPlan;
  }, [currentDayPlan]);

  useEffect(() => {
    if (!highlightedItemId) return;

    const timer = setTimeout(() => {
      const element = document.getElementById(`plan-item-${highlightedItemId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // ハイライトクラスはCSSアニメーションで自動的に消える
      }
      // アニメーション時間後にハイライトを解除
      const animationDuration = 1000; // 1s
      setTimeout(() => setHighlightedItemId(null), animationDuration);
    }, 100); // DOMのレンダリングを待つ

    return () => clearTimeout(timer);
  }, [highlightedItemId]);

  // totalDaysが変更されたときにplanContentsを初期化
  useEffect(() => {
    if (totalDays > 0) {
      initializePlanContentsForDays(totalDays);
    }
  }, [totalDays, initializePlanContentsForDays]);

  if (overviewLoading || detailLoading) {
    return (
      <div className="fixed inset-0 bg-background-primary flex items-center justify-center z-50">
        <p className="text-text-secondary">データを読み込み中...</p>
      </div>
    );
  }

  // ボトムシートの現在の高さに基づいてアイコンを切り替える
  const isBottomSheetExpanded = sheetStyle.height && parseFloat(sheetStyle.height) / window.innerHeight > 0.5; // 50%より高ければ展開状態とみなす

  return (
    <div className="w-full h-screen bg-background-primary lg:flex overflow-hidden">
      <div className="w-full h-full lg:flex-1">
        <GoogleMap onAddSpot={addSpotToPlan} planId={planId} onSpotDeleted={onSpotDeletedRef} />
      </div>

      <div 
        className="lg:flex-1 lg:h-auto lg:border-l lg:border-border-primary lg:flex lg:flex-col fixed bottom-0 left-0 right-0 w-full lg:max-w-[33.3333%] bg-background-primary rounded-t-ui-lg shadow-lg lg:shadow-none lg:rounded-none lg:relative"
        style={sheetStyle}
      >
        {/* --- Draggable Handle (Mobile only) --- */}
        <div 
          className="w-full h-8 items-center justify-center cursor-pointer lg:hidden flex"
          onClick={() => setSnapIndex(isBottomSheetExpanded ? 0 : 2)} // 展開/収納を切り替える
        >
          {isBottomSheetExpanded ? (
            <ChevronDown className="w-6 h-6 text-text-secondary" />
          ) : (
            <ChevronUp className="w-6 h-6 text-text-secondary" />
          )}
        </div>

        <header className="px-4 pt-2 pb-4 lg:px-6 lg:pt-6 border-b border-border-primary shrink-0">
          <div className="flex justify-between items-start">
            <PlanOverview tripData={tripData} onPlanOverviewChange={handleInputChange} />
            <Link to="/management" aria-label="管理画面へ戻る" className="ui-button-icon ml-4 shrink-0">
              <Home className="w-5 h-5" />
            </Link>
          </div>
          {(overviewError || detailError) && <p className="text-sm text-error mt-2">{overviewError || detailError}</p>}
        </header>

        <div ref={planItemsContainerRef} className="flex-grow flex flex-col pb-safe-bottom">
          <nav className="sticky top-0 bg-background-primary/80 backdrop-blur-sm border-b border-border-primary px-4 lg:px-6 shrink-0">
            <div className="flex items-center space-x-2 py-2 overflow-x-auto">
              {Array.from({ length: totalDays }, (_, index) => (
                <CurrentDay key={index} index={index} onSelectedDayChange={handleSelectedDay} isSelected={selectedDay === index + 1} />
              ))}
            </div>
          </nav>

          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-text-primary">Day {selectedDay}</h3>
              <span className="text-sm text-text-secondary">{calculateDay(selectedDay)}</span>
            </div>

            <div className="space-y-3">
              {(currentDayPlan || []).map((item, index) => (
                <PlanDetailItem 
                  key={item.id || index} 
                  item={item} 
                  index={index} 
                  onPlanDetailChange={handlePlanChange} 
                  onPlanDetailDelete={handlePlanDelete} 
                  isHighlighted={item.id === highlightedItemId}
                />
              ))}
            </div>

            <div className="mt-6">
              <button onClick={handleAddPlan} className="ui-button px-4 py-2 rounded-ui-md font-semibold w-full border border-accent-primary text-accent-primary bg-transparent hover:bg-accent-primary/10">プランを追加</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}