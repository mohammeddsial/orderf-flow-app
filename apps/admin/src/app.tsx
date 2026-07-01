import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RestaurantProvider } from './context/RestaurantContext';
import { Dashboard } from './pages/Dashboard';
import { MenuManager } from './pages/MenuManager';
import { LayoutBuilder } from './pages/LayoutBuilder';

function App() {
  return (
    <BrowserRouter>
      <RestaurantProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/menu" element={<MenuManager />} />
          <Route path="/layout-builder" element={<LayoutBuilder />} />
          <Route path="/home-layout" element={<LayoutBuilder />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RestaurantProvider>
    </BrowserRouter>
  );
}

export default App;