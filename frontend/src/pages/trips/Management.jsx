import { useAuth } from "@/store/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { parseError, ERROR_MESSAGES } from '@/utils/errorHandler';
import { usePlanManagement } from "@/hooks/plans/usePlanManagement";
import { PlanList } from "@/components/plans/PlanList";
import { Plus, LogOut } from 'lucide-react';

export function Management() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { plans, loading, error, handleDeletePlan } = usePlanManagement();

  const handleLogOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      const { message } = parseError(error, ERROR_MESSAGES.LOGOUT_FAILED);
      // TODO: alertをToastコンポーネントに置き換える
      alert(message);
    }
  }

  return (
    <div className="min-h-screen bg-background-secondary dark:bg-gray-900">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-rose-100 to-transparent dark:from-slate-800/50 pointer-events-none"></div>

      <div className="relative z-10">
        <header className="py-8">
          <div className="ui-container flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                My Trips
              </h1>
              <p className="text-text-secondary mt-1">
                ようこそ、{user.name}さん！次の冒険を選びましょう。
              </p>
            </div>
            {/* --- Refined Logout Button --- */}
            <button 
              type="button" 
              onClick={handleLogOut}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full font-semibold border-2 border-transparent text-text-primary transition-all duration-200 ease-in-out group"
            >
              <LogOut className="w-5 h-5 text-text-secondary transition-colors group-hover:text-error" />
              <span className="ml-2 text-text-secondary transition-colors group-hover:text-error">ログアウト</span>
            </button>
          </div>
        </header>

        <main className="ui-container pb-16">
          <PlanList 
            plans={plans}
            onDelete={handleDeletePlan}
            loading={loading}
            error={error}
          />
        </main>

        {/* Floating Action Button for Mobile */}
        <div className="lg:hidden fixed bottom-6 right-6 z-20">
          <Link to="/new-trip">
            <button 
              aria-label="新しいプランを作成"
              className="ui-button-primary rounded-full shadow-lg w-16 h-16 flex items-center justify-center"
            >
              <Plus className="w-8 h-8" />
            </button>
          </Link>
        </div>
        
        {/* Footer Action for Desktop */}
        <footer className="hidden lg:flex items-center justify-center py-6">
          <Link to="/new-trip">
            <button className="ui-button-primary text-lg">
              新しい旅行プランを作成する
            </button>
          </Link>
        </footer>
      </div>
    </div>
  )
}
