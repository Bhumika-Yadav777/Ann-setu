
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Register from './modules/authentication/Register';
import Login from './modules/authentication/Login';
import Profile from './modules/authentication/Profile';


import ProtectedRoute from './modules/authentication/ProtectedRoute';
import { AuthProvider } from './modules/authentication/AuthContext.jsx';
import DonorDashboard from './modules/donor/pages/DonorDashboard';
import AddDonation from './modules/donor/pages/AddDonation';
import MyDonations from './modules/donor/pages/MyDonations';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/donor-dashboard" element={<DonorDashboard />} />
            <Route path="/donor/add-donation" element={<AddDonation />} />
            <Route path="/donor/my-donations" element={<MyDonations />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
