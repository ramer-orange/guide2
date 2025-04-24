import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Home from "../pages/Home";
import Management from "../pages/Management";
import TripPlan from "../pages/TripPlan";
import NewTrip from "../pages/NewTrip";
import TestApi from "../componets/TestApi";


const routesBasic = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/management" element={<Management />} />
      <Route path="/trip-plan" element={<TripPlan />} />
      <Route path="/new-trip" element={<NewTrip />} />
      <Route path="/echo" element={<TestApi />} />

    </>
  )
);

export default routesBasic;