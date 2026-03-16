import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Wallets from './pages/Wallets';
import Markets from './pages/Markets';
import Profile from './pages/Profile';
import Security from './pages/Security';
import Admin from './pages/Admin';
import AdminUsers from './pages/admin/Users';
import AdminInvestments from './pages/admin/Investments';
import AdminRealEstate from './pages/admin/RealEstate';
import AdminBots from './pages/admin/Bots';
import AdminSettings from './pages/admin/Settings';
import TradingBot from './pages/TradingBot';
import RealEstate from './pages/RealEstate';
import { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/wallets" 
          element={
            <ProtectedRoute>
              <Wallets />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/markets" 
          element={
            <ProtectedRoute>
              <Markets />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/security" 
          element={
            <ProtectedRoute>
              <Security />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/bot" 
          element={
            <ProtectedRoute>
              <TradingBot />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/real-estate" 
          element={
            <ProtectedRoute>
              <RealEstate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/investments" 
          element={
            <ProtectedRoute>
              <AdminInvestments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/real-estate" 
          element={
            <ProtectedRoute>
              <AdminRealEstate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/bots" 
          element={
            <ProtectedRoute>
              <AdminBots />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

