import AdminDashboard from "./modules/admin/pages/AdminDashboard";
import AdminProtectedRoute from "./modules/authentication/AdminProtectedRoute";
import { AuthProvider } from './modules/authentication/AuthContext.jsx';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// Authentication

import ProtectedRoute from "./modules/authentication/ProtectedRoute";

// Authentication pages
import Register from "./modules/authentication/Register";
import Login from "./modules/authentication/Login";
import Profile from "./modules/authentication/Profile";

// Donor pages
import DonorDashboard from "./modules/donor/pages/DonorDashboard";
import AddDonation from "./modules/donor/pages/AddDonation";
import MyDonations from "./modules/donor/pages/MyDonations";

// NGO routes
import NgoRoutes from "./modules/ngo/NgoRoutes";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route
            path="/"
            element={<Navigate to="/register" />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/login"
            element={<Login />}
          />


          {/* Protected routes - login required */}
          <Route element={<ProtectedRoute />}>
  <Route element={<AdminProtectedRoute />}>
    <Route
      path="/admin-dashboard"
      element={<AdminDashboard />}
    />
  </Route>

  <Route path="/profile" element={<Profile />} />
  <Route path="/donor-dashboard" element={<DonorDashboard />} />
  <Route path="/donor/add-donation" element={<AddDonation />} />
  <Route path="/donor/my-donations" element={<MyDonations />} />
  <Route path="/ngo-dashboard/*" element={<NgoRoutes />} />
</Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
