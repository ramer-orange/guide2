import { useAuth } from "@/contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { api } from "@/api/api";
import { parseError, ERROR_MESSAGES } from '@/utils/errorHandler';

// 管理画面ページ

export function Management() {
  // AuthContextからuser情報を取得
  const { user, logout } = useAuth();
  const  navigate = useNavigate();
  const [plans, setPlans] = useState([]);

  const handleLogOut = async () => {
    try{
      await logout();

      navigate('/');
    } catch (error) {
      const { message } = parseError(error, ERROR_MESSAGES.LOGOUT_FAILED);
      alert(message);
    }
  }

  // プランの取得
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/plans');
        setPlans(response.data);
      } catch (error) {
        console.error('プランの取得に失敗しました。', error);
      }
    }

    fetchPlans();
  }, []);

  // プランの削除
  const handleDeleteClick = (planId) => {
    if (window.confirm('本当に削除しますか？')) {
      handlePlanDelete(planId);
    }
  }
  const handlePlanDelete = async (planId) => {
    try {
      await api.delete(`/plans/${planId}`);
      setPlans(plans.filter(plan => plan.id !== planId));
      alert('プランを削除しました。');
    }
    catch (error) {
      const { message } = parseError(error, ERROR_MESSAGES.PLAN_DELETE_FAILED);
      alert(message);
    }
  }

  return (
    <>
      <div>
        <h1>管理画面</h1>
        <p>{user.name}さん、ようこそ！！</p>
        <div>
          {
            plans.map(plan => {
              return (
                <div key={plan.id}>
                  <p>{plan.title}</p>
                  <p>{plan.start_date}</p>
                  <p>{plan.end_date}</p>
                  <Link to={`/trip-plan/${plan.id}`}>
                    <button>編集</button>
                  </Link>
                  <button onClick={() => handleDeleteClick(plan.id)}>削除</button>
                </div>
              )
            })
          }
        </div>
        <Link to="/new-trip">
          <button>新規作成</button>
        </Link>
        <button type="button" onClick={handleLogOut}>
          ログアウト
        </button>
      </div>
    </>
  )
}