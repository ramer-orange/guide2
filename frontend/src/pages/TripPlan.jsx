import { Link, useParams } from "react-router-dom"
import PlanDetailItem from "@/components/planCreate/PlanDetailItem";
import PlanOverview from "@/components/planCreate/planOverview";
import CurrentDay from "@/components/planCreate/CurrentDay";
import { usePlanDetails } from "@/hooks/tripPlan/usePlanDetails";
import { usePlanOverview } from "@/hooks/tripPlan/usePlanOverview";

// 旅行プラン作成ページ

export default function TripPlan() {
  const { planId } = useParams(); // URLパラメータからplanIdを取得

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
    handlePlanChange,
    handlePlanDelete,
    handleSelectedDay,
    currentDayPlan,
  } = usePlanDetails(planId, totalDays);

  // データがロード中の場合
  if (overviewLoading || detailLoading) {
    return <div>データを読み込み中...</div>;
  }

  return (
    <>
      <div>
        <div>
          <h2>プラン作成</h2>
          <Link to="/management">
            <button>管理画面へ戻る</button>
          </Link>
          <div>
            <p>{overviewError || detailError}</p>
            {/* 旅行概要 */}
            <PlanOverview
              tripData={tripData}
              onPlanOverviewChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <div>
            {/* 日数選択ボタン */}
            {Array.from({length: totalDays}, (_, index) => (
              <CurrentDay
                key={index}
                index={index}
                onSelectedDayChange={handleSelectedDay}
              />
            ))}
          </div>
          <div>
            <p>Day {selectedDay}</p>
            <span>{calculateDay(selectedDay)}</span>
            <div>
                {/* プラン詳細 */}
                {currentDayPlan.map((item, index) => {
                  return (
                    <PlanDetailItem
                      key={index}
                      item={item}
                      index={index}
                      onPlanDetailChange={handlePlanChange}
                      onPlanDetailDelete={handlePlanDelete}
                    />
                  )
                })}
            </div>
          </div>
          <div>
            <button onClick={handleAddPlan}>メモを追加</button>
          </div>
        </div>
      </div>
    </>
  )
}