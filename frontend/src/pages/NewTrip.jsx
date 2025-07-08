import { useNewTrip } from "@/hooks/tripPlan/useNewTrip";
import { NewTripOverview } from "@/components/planCreate/NewTripOverview";
import { PlanCreateButton } from "@/components/button/PlanCreateButton";
import { BackToManagementButton } from "@/components/button/BackToManagementButton";
import { PageTitle } from "@/components/PageTitle/PageTitle";
import { Link } from "react-router-dom";

// 旅行名と日付を入力するページ
export function NewTripPage() {
  const { tripData, error, handleTrip, handleCreate } = useNewTrip();

  return (
    <div>
      <PageTitle>旅行プラン作成</PageTitle>
      <Link to="/management">
        <BackToManagementButton>
          管理画面へ戻る
        </BackToManagementButton>
      </Link>
      <NewTripOverview tripData={tripData} error={error} handleTrip={handleTrip} />
      <PlanCreateButton handleCreate={handleCreate}>作成</PlanCreateButton>
    </div>
  );
}
