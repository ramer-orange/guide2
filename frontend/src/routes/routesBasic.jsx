import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Home from "../pages/Home";
import Management from "../pages/Management";
import TripPlan from "../pages/TripPlan";
import NewTrip from "../pages/NewTrip";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "./../components/ProtectedRoute";


const routesBasic = createBrowserRouter(
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
            <NewTrip />
          </ProtectedRoute>
        }/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </>
  )
);

export default routesBasic;
