
import { Routes, Route } from "react-router-dom";

import NgoLayout from "./components/NgoLayout";

import NgoDashboard from "./pages/NgoDashboard";
import AvailableDonations from "./pages/AvailableDonations";
import DonationDetails from "./pages/DonationDetails";
import MyRequests from "./pages/MyRequests";

function NgoRoutes() {
  return (
    <Routes>
      <Route element={<NgoLayout />}>
        <Route index element={<NgoDashboard />} />

        <Route
          path="donations"
          element={<AvailableDonations />}
        />

        <Route
          path="donations/:id"
          element={<DonationDetails />}
        />

        <Route
          path="requests"
          element={<MyRequests />}
        />
      </Route>
    </Routes>
  );
}

export default NgoRoutes;
