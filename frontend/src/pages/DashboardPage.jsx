import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, HeartPulse, ShieldAlert, Droplet, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import LabScanUpload from '../components/LabScanUpload';

const historicalData = [
  { month: 'Jan', cholesterol: 245, bp: 135 },
  { month: 'Feb', cholesterol: 230, bp: 130 },
  { month: 'Mar', cholesterol: 210, bp: 125 },
  { month: 'Apr', cholesterol: 195, bp: 118 },
  { month: 'May', cholesterol: 188, bp: 115 },
  { month: 'Jun', cholesterol: 175, bp: 112 },
];

export default function DashboardPage() {
  const [twinIndex, setTwinIndex] = useState(84);
  const [lipidsRisk, setLipidsRisk] = useState("Analyzing...");
  const [lipidsGuidance, setLipidsGuidance] = useState("Connecting to neural network...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/ml/lipids/predict', {
          age: 45,
          bmi: 28.5,
          total_cholesterol: 250,
          triglycerides: 210
        });
        
        setLipidsRisk(response.data.risk_level);
        setLipidsGuidance(response.data.clinical_guidance);
      } catch (error) {
        console.error("Error fetching ML data:", error);
        setLipidsRisk("Connection Error");
        setLipidsGuidance("Unable to reach the ML engine.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRiskData();
  }, []);

  const getRiskUI = (risk, loading) => {
    if (loading) return { cardBg: 'bg-white/40 border-slate-100/50 backdrop-blur-sm', badgeColor: 'bg-slate-100/80', badgeText: 'text-slate-500', label: 'Processing...', icon: Loader2, mainTextColor: 'text-slate-800' };
    
    const safeRisk = risk ? risk.toLowerCase() : "";

    const config = {
      alert: { cardBg: 'bg-rose-50/40 border-rose-100/50 backdrop-blur-sm', badgeColor: 'bg-rose-100/80', badgeText: 'text-rose-700', iconColor: 'text-rose-500', label: 'ALERT', icon: ShieldAlert, mainTextColor: 'text-rose-900' },
      elevated: { cardBg: 'bg-amber-50/40 border-amber-100/50 backdrop-blur-sm', badgeColor: 'bg-amber-100/80', badgeText: 'text-amber-700', iconColor: 'text-amber-500', label: 'ELEVATED', icon: AlertTriangle, mainTextColor: 'text-amber-900' },
      optimal: { cardBg: 'bg-emerald-50/40 border-emerald-100/50 backdrop-blur-sm', badgeColor: 'bg-emerald-100/80', badgeText: 'text-emerald-700', iconColor: 'text-emerald-500', label: 'OPTIMAL', icon: CheckCircle, mainTextColor: 'text-emerald-900' }
    };

    if (safeRisk === 'elevated') return config.elevated;
    if (safeRisk === 'alert') return config.alert;
    if (safeRisk === 'optimal') return config.optimal;

    return config.optimal;
  };

  const getIndexUI = (index) => {
    if (index >= 80) return { cardBg: 'bg-emerald-50/40 border-emerald-100/50 backdrop-blur-sm', indexColor: 'text-emerald-600', label: 'Optimal Wellness', badgeColor: 'bg-emerald-100/80', badgeText: 'text-emerald-800', icon: HeartPulse };
    if (index >= 60) return { cardBg: 'bg-amber-50/40 border-amber-100/50 backdrop-blur-sm', indexColor: 'text-amber-600', label: 'Mild Imbalance', badgeColor: 'bg-amber-100/80', badgeText: 'text-amber-800', icon: Activity };
    return { cardBg: 'bg-rose-50/40 border-rose-100/50 backdrop-blur-sm', indexColor: 'text-rose-600', label: 'Alert Condition', badgeColor: 'bg-rose-100/80', badgeText: 'text-rose-800', icon: ShieldAlert };
  };

  const riskUI = getRiskUI(lipidsRisk, isLoading);
  const RiskIcon = riskUI.icon;
  
  const indexUI = getIndexUI(twinIndex);
  const IndexIcon = indexUI.icon;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-1">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                Biological Twin
              </span> Dashboard
            </h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              Live health synchronization active
            </p>
          </div>
        </header>

        <LabScanUpload />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className={`${indexUI.cardBg} rounded-3xl p-8 border shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <IndexIcon className={`w-24 h-24 ${indexUI.indexColor}`} />
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-2">System Vitality</h3>
              <div className="flex items-baseline gap-2">
                <span className={`text-6xl font-black ${indexUI.indexColor}`}>{twinIndex}</span>
                <span className="text-xl font-bold text-slate-400">/ 100</span>
              </div>
              <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${indexUI.badgeColor} ${indexUI.badgeText} text-sm font-semibold`}>
                <div className={`w-2 h-2 rounded-full ${indexUI.indexColor}`} />
                {indexUI.label}
              </div>
            </div>
          </div>

          {/* I have added lg:col-span-2 back here so it stretches beautifully! */}
          <div className={`${riskUI.cardBg} lg:col-span-2 rounded-3xl p-8 border shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center`}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
                <Droplet className="w-4 h-4 text-blue-500" />
                Lipid Profile Analysis
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${riskUI.badgeColor} ${riskUI.badgeText}`}>
                {riskUI.icon && <RiskIcon className={`w-3 h-3 ${riskUI.iconColor || ''} ${isLoading ? 'animate-spin' : ''}`} />}
                {riskUI.label}
              </span>
            </div>
            
            <div className={`text-2xl md:text-3xl font-bold tracking-tight mb-3 ${riskUI.mainTextColor}`}>
              {isLoading ? "Analyzing biomarkers..." : 
               lipidsRisk?.toLowerCase() === 'elevated' ? "Attention required for lipid levels." : "Your lipid panel looks fantastic."}
            </div>
            <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
              {lipidsGuidance}
            </p>
          </div>
          
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Cholesterol Trend</h3>
              <p className="text-sm text-slate-500 font-medium">6-month historical tracking</p>
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCholesterol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                  itemStyle={{ color: '#4f46e5' }}
                />
                <Area type="monotone" dataKey="cholesterol" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorCholesterol)" activeDot={{ r: 8, strokeWidth: 0, fill: '#4f46e5' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}