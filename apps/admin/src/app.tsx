import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RestaurantProvider } from './context/RestaurantContext';
import { AuthProvider } from './context/AuthContext';
import { TenantThemeProvider } from './context/TenantThemeProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { MenuManager } from './pages/MenuManager';
import { LayoutBuilder } from './pages/LayoutBuilder';
import { SuperAdmin } from './pages/SuperAdmin';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RestaurantProvider>
          <TenantThemeProvider>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/menu" element={<MenuManager />} />
              <Route path="/layout-builder" element={<LayoutBuilder />} />
              <Route
                path="/super-admin"
                element={
                  <ProtectedRoute>
                    <SuperAdmin />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </TenantThemeProvider>
        </RestaurantProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
