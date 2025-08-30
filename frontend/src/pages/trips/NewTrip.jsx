import { useNewTrip } from "@/hooks/trips/useNewTrip";
import { NewTripOverview } from "@/components/forms/NewTripOverview";
import { PlanCreateButton } from "@/components/ui/PlanCreateButton";
import { BackButton } from "@/components/ui/BackButton"; // BackButtonをインポート

// 旅行名と日付を入力するページ
export function NewTripPage() {
  const { tripData, error, handleTrip, handleCreate } = useNewTrip();

  return (
    <div className="min-h-screen bg-background-secondary dark:bg-gray-900">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-rose-100 to-transparent dark:from-slate-800/50 pointer-events-none"></div>

      <div className="relative z-10">
        <header className="py-8">
          <div className="ui-container">
            <div className="flex items-center mb-6">
              {/* BackButtonコンポーネントを使用 */}
              <BackButton variant="ghost" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                新しい旅行プラン
              </h1>
              <p className="text-text-secondary mt-1">
                旅行の基本情報を入力して、素敵な旅の計画を始めましょう。
              </p>
            </div>
          </div>
        </header>

        <main className="ui-container pb-16">
          <div className="max-w-2xl mx-auto bg-background-primary p-8 rounded-ui-lg shadow-lg">
            <NewTripOverview tripData={tripData} error={error} handleTrip={handleTrip} />
            <div className="mt-8 flex justify-center">
              <PlanCreateButton handleCreate={handleCreate} className="ui-button-primary text-lg">作成</PlanCreateButton>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
