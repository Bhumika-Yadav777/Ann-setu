
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Register from './modules/authentication/Register';
import Login from './modules/authentication/Login';
import Profile from './modules/authentication/Profile';

import ProtectedRoute from './modules/authentication/ProtectedRoute';
import { AuthProvider } from './modules/authentication/AuthContext.jsx';

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
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
