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
