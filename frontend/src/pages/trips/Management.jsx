import { useAuth } from "@/store/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { parseError, ERROR_MESSAGES } from '@/utils/errorHandler';
import { usePlanManagement } from "@/hooks/plans/usePlanManagement";
import { PlanList } from "@/components/plans/PlanList";

// 管理画面ページ
export function Management() {
  // AuthContextからuser情報を取得
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // プラン管理のロジック
  const { plans, loading, error, handleDeletePlan } = usePlanManagement();

  // ログアウト処理
  const handleLogOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      const { message } = parseError(error, ERROR_MESSAGES.LOGOUT_FAILED);
      alert(message);
    }
  }

  return (
    <div className="management-page">
      <header className="page-header">
        <h1>管理画面</h1>
        <p className="welcome-message">{user.name}さん、ようこそ！！</p>
      </header>

      <main className="page-content">
        <PlanList 
          plans={plans}
          onDelete={handleDeletePlan}
          loading={loading}
          error={error}
        />
      </main>

      <footer className="page-actions">
        <Link to="/new-trip">
          <button className="btn btn-primary">新規作成</button>
        </Link>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={handleLogOut}
        >
          ログアウト
        </button>
      </footer>
    </div>
  )
}