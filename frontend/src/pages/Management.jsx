import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"

// 管理画面ページ

export default function Management() {
  // AuthContextからuser情報を取得
  const { user } = useAuth();
  return (
    <>
      <div>
        <h1>管理画面</h1>
        <p>{user.name}さん、ようこそ！！</p>
        <Link to="/new-trip">
          <button>新規作成</button>
        </Link>
      </div>
    </>
  )
}