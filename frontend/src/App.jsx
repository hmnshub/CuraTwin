// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import VaultPage from './pages/VaultPage';
import ChatPage from './pages/ChatPage';

export default function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/vault" element={<VaultPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
}