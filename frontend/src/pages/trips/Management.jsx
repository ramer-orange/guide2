import { useAuth } from "@/store/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { parseError, ERROR_MESSAGES } from '@/utils/errorHandler';
import { usePlanManagement } from "@/hooks/plans/usePlanManagement";
import { PlanList } from "@/components/plans/PlanList";
import { Button, IconButton } from "@/components/ui/Button";
import { useToast, ToastContainer } from "@/components/ui/Toast";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { IoAdd, IoLogOut, IoPerson, IoHome } from "react-icons/io5";

// 管理画面ページ
export function Management() {
  // AuthContextからuser情報を取得
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // プラン管理のロジック
  const { plans, loading, error, handleDeletePlan } = usePlanManagement();
  
  // レスポンシブ対応
  const { isMobile, isDesktop } = useBreakpoint();
  
  // Toast機能
  const { showSuccess, showError, toasts, removeToast } = useToast();

  // ログアウト処理
  const handleLogOut = async () => {
    try {
      await logout();
      showSuccess('ログアウトしました', 'またのご利用をお待ちしております');
      navigate('/');
    } catch (error) {
      const { message } = parseError(error, ERROR_MESSAGES.LOGOUT_FAILED);
      showError('ログアウトに失敗', message);
    }
  }
  
  // プラン削除の処理
  const handleDelete = async (planId) => {
    try {
      await handleDeletePlan(planId);
      showSuccess('プランを削除しました', '削除されたプランは復元できません');
    } catch {
      showError('削除に失敗', 'プランの削除中にエラーが発生しました');
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        {/* ヘッダー */}
        <header className="px-6 py-8 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            {/* 左側：タイトルとウェルカムメッセージ */}
            <div className="flex-1 min-w-0">
              <h1 className={`m-0 ${isDesktop ? 'text-4xl' : 'text-3xl'} font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight mb-3`}>
                旅行プラン管理
              </h1>
              <div className="flex items-center gap-3 text-lg text-gray-600 dark:text-gray-400">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <IoPerson size={20} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <span>こんにちは、<strong className="text-gray-900 dark:text-gray-100">{user?.name || 'ユーザー'}さん</strong></span>
              </div>
            </div>
            
            {/* 右側：アクションボタン */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* ホームボタン */}
              <Link to="/">
                <IconButton
                  icon={<IoHome />}
                  variant="ghost"
                  size="md"
                  ariaLabel="ホームに戻る"
                />
                  </Link>
              
              {/* ログアウトボタン */}
              <IconButton
                icon={<IoLogOut />}
                variant="ghost"
                size="md"
                onClick={handleLogOut}
                ariaLabel="ログアウト"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/10"
              />
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 min-h-[calc(100vh-200px)]">
          {/* 統計サマリー */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-12">
            <div className="group relative p-3 sm:p-6 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl mb-2 sm:mb-4">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {plans?.length || 0}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  作成したプラン
                </div>
              </div>
            </div>
            
            <div className="group relative p-3 sm:p-6 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl mb-4">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {plans?.filter(p => {
                    const today = new Date();
                    const startDate = new Date(p.start_date);
                    return startDate > today;
                  })?.length || 0}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  今後の旅行予定
                </div>
              </div>
            </div>
            
            {/* 実行中のプラン */}
            <div className="group relative p-3 sm:p-6 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl mb-4">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {plans?.filter(p => {
                    const today = new Date();
                    const startDate = new Date(p.start_date);
                    const endDate = new Date(p.end_date);
                    today.setHours(0, 0, 0, 0);
                    startDate.setHours(0, 0, 0, 0);
                    endDate.setHours(0, 0, 0, 0);
                    return today >= startDate && today <= endDate;
                  })?.length || 0}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  旅行中
                </div>
              </div>
            </div>
            
            {/* 完了したプラン */}
            <div className="group relative p-3 sm:p-6 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl mb-4">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {plans?.filter(p => {
                    const today = new Date();
                    const endDate = new Date(p.end_date);
                    today.setHours(0, 0, 0, 0);
                    endDate.setHours(0, 0, 0, 0);
                    return today > endDate;
                  })?.length || 0}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  旅行済み
                </div>
              </div>
            </div>
          </div>
          
          {/* プランリストセクション */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 sm:p-8">
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <div>
                <h2 className="m-0 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  プラン一覧
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-0">
                  旅行プランを管理・編集できます
                </p>
        </div>
              
              {/* 新規作成ボタン */}
        <Link to="/new-trip">
                <Button
                  variant="primary"
                  leftIcon={<IoAdd />}
                  size={isMobile ? "md" : "lg"}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  新規プラン作成
                </Button>
        </Link>
            </div>
            
            {/* プランリスト */}
            <PlanList 
              plans={plans}
              onDelete={handleDelete}
              loading={loading}
              error={error}
            />
          </section>
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
          header {
            padding: 1rem;
          }
          
          main {
            padding: 1rem;
          }
          
          section {
            padding: 1.5rem;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            transition-duration: 0.1s;
            animation: none;
          }
        }
      `}</style>
    </>
  )
}
