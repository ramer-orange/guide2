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
      <Route path="/" element={<Home />} />
      <Route path="/management" element={
          <ProtectedRoute>
            <Management />
          </ProtectedRoute>
        }/>
        <Route path="/trip-plan/:planId" element={
          <ProtectedRoute>
            <TripPlan />
          </ProtectedRoute>
        }/>
        <Route path="/new-trip" element={
          <ProtectedRoute>
            <NewTripPage />
          </ProtectedRoute>
        }/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </>
  )
);
