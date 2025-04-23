import { Link } from "react-router-dom"

// サイトトップページ

export default function Home() {
  return (
    <>
      <div>
        <h1>旅のしおり</h1>
        <Link to="/management">
          <button>管理画面へ</button>
        </Link>
      </div>
    </>
  )
}