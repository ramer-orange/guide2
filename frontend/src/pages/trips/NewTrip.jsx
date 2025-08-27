import { useNewTrip } from "@/hooks/trips/useNewTrip";
import { NewTripOverview } from "@/components/forms/NewTripOverview";
import { PlanCreateButton } from "@/components/ui/PlanCreateButton";
import { BackToManagementButton } from "@/components/ui/BackToManagementButton";
import { PageTitle } from "@/components/ui/PageTitle";
import { Link } from "react-router-dom";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { IoArrowBack, IoHome } from "react-icons/io5";

// 旅行名と日付を入力するページ
export function NewTripPage() {
  const { tripData, error, fieldErrors, isLoading, handleTrip, handleCreate } = useNewTrip();
  const { isDesktop } = useBreakpoint();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* ヘッダー */}
      <header className="px-4 sm:px-6 py-6 sm:py-8 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* 左側：タイトル */}
          <div className="flex-1 min-w-0">
            <h1 className={`m-0 ${isDesktop ? 'text-4xl' : 'text-3xl'} font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight mb-3`}>
              旅行プラン作成
            </h1>
          </div>
          
          {/* 右側：ナビゲーションボタン */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/management">
              <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200">
                <IoArrowBack size={16} />
                <span className="hidden sm:inline">管理画面へ戻る</span>
              </button>
            </Link>
            <Link to="/">
              <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200">
                <IoHome size={20} />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12 min-h-[calc(100vh-200px)]">
        <div className="space-y-8">
          {/* フォームセクション */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 sm:p-8">
            <div className="mb-6 sm:mb-8">
              <h2 className="m-0 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                旅行の基本情報
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-0">
                旅行名と日程を入力してください
              </p>
            </div>
            
            <NewTripOverview 
              tripData={tripData} 
              error={error} 
              fieldErrors={fieldErrors}
              handleTrip={handleTrip} 
            />
          </section>
          
          {/* 作成ボタンセクション */}
          <div className="text-center">
            <PlanCreateButton 
              handleCreate={handleCreate} 
              isLoading={isLoading}
            >
              旅行プランを作成する
            </PlanCreateButton>
          </div>
        </div>
      </main>
    </div>
  );
}
