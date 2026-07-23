// src/pages/DashboardPage.jsx
import React from 'react';
import VitalCards from '../components/VitalCards';
import VitalChart from '../components/VitalChart';
import { patientProfile } from '../data/mockHealthData';

export default function DashboardPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', color: '#0f172a', margin: '0 0 8px 0' }}>
          Welcome back, {patientProfile.name} 👋
        </h1>
        <p style={{ color: '#64748b', margin: 0 }}>
          Here is your real-time biological twin summary based on reports up to <strong>{patientProfile.lastReportDate}</strong>.
        </p>
      </div>

      <VitalCards />
      <VitalChart />
    </div>
  );
}