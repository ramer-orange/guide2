import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Management } from "@/pages/trips/Management";
import { TripPlan } from "@/pages/trips/TripPlan";
import { NewTripPage } from "@/pages/trips/NewTrip";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";


export const routesBasic = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* トップページ */}
      <Route path="/" element={<Home />} />

      {/* 管理画面 */}
      <Route path="/management" element={
          <ProtectedRoute>
            <Management />
          </ProtectedRoute>
        }/>

      {/* 旅行プラン詳細 */}
      <Route path="/trip-plan/:planId" element={
        <ProtectedRoute>
          <TripPlan />
        </ProtectedRoute>
      }/>

      {/* 新規旅行プラン作成 */}
      <Route path="/new-trip" element={
        <ProtectedRoute>
          <NewTripPage />
        </ProtectedRoute>
      }/>

      {/* ログインページ */}
      <Route path="/login" element={<Login />} />

      {/* 新規登録ページ */}
      <Route path="/register" element={<Register />} />
    </>
  )
);
