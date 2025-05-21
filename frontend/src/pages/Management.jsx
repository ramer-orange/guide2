import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { api } from "../api/api";

// 管理画面ページ

export default function Management() {
  // AuthContextからuser情報を取得
  const { user, logout } = useAuth();
  const  navigate = useNavigate();
  const [plans, setPlans] = useState([]);

  const handleLogOut = async () => {
    try{
      await logout();

      navigate('/');
    } catch (error) {
      console.error('ログアウトに失敗しました。', error)
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