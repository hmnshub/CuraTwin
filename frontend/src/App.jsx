// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';

// Placeholder components for views we will build next
const VaultPage = () => (
  <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
    <h2>Medical Vault & OCR Dropzone</h2>
    <p>Document upload and Tesseract OCR text extraction viewer coming next...</p>
  </div>
);

const ChatPage = () => (
  <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
    <h2>Closed-Domain RAG AI Assistant</h2>
    <p>Conversational health twin grounded in MongoDB Vector Search coming next...</p>
  </div>
);

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