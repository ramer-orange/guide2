import { Link } from "react-router-dom"

// 管理画面ページ

export default function Management() {
  return (
    <>
      <div>
        <h1>管理画面</h1>
        <Link to="/new-trip">
          <button>新規作成</button>
        </Link>
      </div>
    </>
  )
}