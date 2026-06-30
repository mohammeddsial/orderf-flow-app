import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RestaurantProvider } from './context/RestaurantContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { RestaurantSettings } from './pages/RestaurantSettings';
import { MenuManager } from './pages/MenuManager';
import { HomeLayout } from './pages/HomeLayout';
import { SuperAdmin } from './pages/SuperAdmin';
import { Orders } from './pages/Orders';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { Customers } from './pages/Customers';
import { Promotions } from './pages/Promotions';

function SuperAdminOnly({ children }: { children: React.ReactNode }) {
  const { isSuperAdmin } = useAuth();
  if (!isSuperAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RestaurantProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/menu" element={<MenuManager />} />
            <Route path="/home-layout" element={<HomeLayout />} />
            <Route path="/settings" element={<RestaurantSettings />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/super-admin" element={<SuperAdminOnly><SuperAdmin /></SuperAdminOnly>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </RestaurantProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
