import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Home from "../pages/Home";
import Management from "../pages/Management";
import TripPlan from "../pages/TripPlan";
import NewTrip from "../pages/NewTrip";
import Login from "../pages/Login";
import Register from "../pages/Register";


const routesBasic = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/management" element={<Management />} />
      <Route path="/trip-plan" element={<TripPlan />} />
      <Route path="/new-trip" element={<NewTrip />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </>
  )
);

export default routesBasic;