// src/components/VitalChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { vitalHistory } from '../data/mockHealthData';
import { Activity, Heart, Droplet } from 'lucide-react';

export default function VitalChart() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <Activity color="#2563eb" size={28} />
        <h2 style={{ margin: 0, fontFamily: 'sans-serif', color: '#1e293b' }}>Biological Twin Vitals Trend</h2>
      </div>
      
      <p style={{ color: '#64748b', marginBottom: '20px', fontFamily: 'sans-serif' }}>
        Real-time metrics parsed from your uploaded lab reports over the last 6 months.
      </p>

      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <LineChart data={vitalHistory} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              name="Blood Sugar (mg/dL)" 
              dataKey="bloodSugar" 
              stroke="#2563eb" 
              strokeWidth={3}
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              name="Systolic BP (mmHg)" 
              dataKey="systolicBP" 
              stroke="#16a34a" 
              strokeWidth={3} 
            />
            <Line 
              type="monotone" 
              name="Heart Rate (bpm)" 
              dataKey="heartRate" 
              stroke="#dc2626" 
              strokeWidth={3} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}