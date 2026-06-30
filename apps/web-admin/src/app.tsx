import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RestaurantProvider } from './context/RestaurantContext';
import { Dashboard } from './pages/Dashboard';
import { RestaurantSettings } from './pages/RestaurantSettings';
import { MenuManager } from './pages/MenuManager';
import { HomeLayout } from './pages/HomeLayout';
import { SuperAdmin } from './pages/SuperAdmin';

function App() {
  return (
    <BrowserRouter>
      <RestaurantProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/menu" element={<MenuManager />} />
          <Route path="/home-layout" element={<HomeLayout />} />
          <Route path="/settings" element={<RestaurantSettings />} />
          <Route path="/super-admin" element={<SuperAdmin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RestaurantProvider>
    </BrowserRouter>
  );
}

export default App;