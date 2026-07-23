// src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, MessageSquareHeart, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const getLinkStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    color: location.pathname === path ? '#2563eb' : '#64748b',
    backgroundColor: location.pathname === path ? '#eff6ff' : 'transparent',
    transition: 'all 0.2s ease',
  });

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '16px 32px', 
      backgroundColor: '#ffffff', 
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>🧬</span>
        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>CuraTwin</span>
        <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={14} /> AI Active
        </span>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Link to="/" style={getLinkStyle('/')}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link to="/vault" style={getLinkStyle('/vault')}>
          <UploadCloud size={18} /> Medical Vault
        </Link>
        <Link to="/chat" style={getLinkStyle('/chat')}>
          <MessageSquareHeart size={18} /> Twin AI Chat
        </Link>
      </div>
    </nav>
  );
}