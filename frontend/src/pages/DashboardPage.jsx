import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import LabScanUpload from '../components/LabScanUpload';

// Mock historical data for the trend graph
const historicalData = [
  { month: 'Jan', cholesterol: 245, bp: 135 },
  { month: 'Feb', cholesterol: 230, bp: 130 },
  { month: 'Mar', cholesterol: 210, bp: 125 },
  { month: 'Apr', cholesterol: 195, bp: 118 },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CuraTwin Biological Dashboard</h1>
          <p className="text-gray-500">Welcome back! Your health twin is fully synced.</p>
        </header>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Health Score Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-700">Biological Twin Index</h3>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold text-green-500">
              84
              <span className="ml-2 text-xl font-medium text-gray-500">/ 100</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">Optimal Wellness</p>
          </div>

          {/* Lipids Risk Card (Kriyentika's Domain) */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-700">Hyperlipidemia Risk</h3>
            <div className="mt-4 text-2xl font-bold text-yellow-500">Elevated</div>
            <p className="mt-2 text-sm text-gray-600">
              Consider saturated fat reduction and increased aerobic exercise.
            </p>
          </div>
          
        </div>

        {/* Historical Trend Graph */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-96">
          <h3 className="text-lg font-medium text-gray-700 mb-6">Cholesterol Trend (6 Months)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="cholesterol" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}