import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RestaurantProvider } from './context/RestaurantContext';
import { Dashboard } from './pages/Dashboard';
import { RestaurantSettings } from './pages/RestaurantSettings';
import { MenuManager } from './pages/MenuManager';
import { HomeLayout } from './pages/HomeLayout';
import { Orders } from './pages/Orders';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { Customers } from './pages/Customers';
import { Promotions } from './pages/Promotions';

function App() {
  return (
    <BrowserRouter>
      <RestaurantProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/menu" element={<MenuManager />} />
          <Route path="/home-layout" element={<HomeLayout />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/settings" element={<RestaurantSettings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RestaurantProvider>
    </BrowserRouter>
  );
}

export default App;
