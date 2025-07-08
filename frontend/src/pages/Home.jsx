import { Link } from "react-router-dom"

// サイトトップページ

export function Home() {
  return (
    <>
      <div>
        <h1>旅のしおり</h1>
        <Link to="/management">
          <button>管理画面へ</button>
        </Link>
        <Link to="/register">
          <button>新規登録</button>
        </Link>
        <Link to="/login">
          <button>ログイン</button>
        </Link>
      </div>
    </>
  )
}