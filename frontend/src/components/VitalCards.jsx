// src/components/VitalCards.jsx
import React from 'react';
import { Activity, Heart, Droplet, ShieldAlert } from 'lucide-react';

export default function VitalCards() {
  const cards = [
    { title: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'Normal', color: '#16a34a', bgColor: '#dcfce7', icon: <Activity color="#16a34a" /> },
    { title: 'Fasting Glucose', value: '95', unit: 'mg/dL', status: 'Optimal', color: '#2563eb', bgColor: '#dbeafe', icon: <Droplet color="#2563eb" /> },
    { title: 'Heart Rate', value: '72', unit: 'bpm', status: 'Stable', color: '#dc2626', bgColor: '#fee2e2', icon: <Heart color="#dc2626" /> },
    { title: 'AI Risk Index', value: '12%', unit: 'Cardio Risk', status: 'Low Risk', color: '#9333ea', bgColor: '#f3e8ff', icon: <ShieldAlert color="#9333ea" /> },
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
      gap: '20px', 
      marginBottom: '30px' 
    }}>
      {cards.map((card, index) => (
        <div key={index} style={{ 
          padding: '20px', 
          backgroundColor: '#ffffff', 
          borderRadius: '12px', 
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>{card.title}</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: card.bgColor }}>
              {card.icon}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>{card.value}</span>
            <span style={{ fontSize: '14px', color: '#64748b' }}>{card.unit}</span>
          </div>

          <span style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: card.color, 
            backgroundColor: card.bgColor, 
            padding: '2px 8px', 
            borderRadius: '4px' 
          }}>
            ● {card.status}
          </span>
        </div>
      ))}
    </div>
  );
}