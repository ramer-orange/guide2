import { useNewTrip } from "@/hooks/trips/useNewTrip";
import { NewTripOverview } from "@/components/forms/NewTripOverview";
import { PlanCreateButton } from "@/components/ui/PlanCreateButton";
import { BackToManagementButton } from "@/components/ui/BackToManagementButton";
import { PageTitle } from "@/components/ui/PageTitle";
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
