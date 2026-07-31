import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, HeartPulse, ShieldAlert, Droplet, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import LabScanUpload from '../components/LabScanUpload';

export default function DashboardPage() {
  const { token: contextToken } = useContext(AuthContext);

  // 1. BULLETPROOF TOKEN FALLBACK
  const token = contextToken || localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('access_token');

  // Your Dynamic Backend State
  const [healthIndex, setHealthIndex] = useState(0);
  const [lipidRisk, setLipidRisk] = useState("Analyzing...");
  const [riskAdvice, setRiskAdvice] = useState("Connecting to neural network...");
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        console.warn("No token found on Dashboard.");
        setIsLoading(false);
        return;
      }

      try {
        // FIXED: Changed 127.0.0.1 to localhost to match the Vault perfectly
        const response = await axios.get('http://localhost:8000/api/vault/summary', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setHealthIndex(response.data.biological_index || 0);
        setLipidRisk(response.data.hyperlipidemia_risk || 'Pending Scan');
        setRiskAdvice(response.data.advice || 'Upload a lab scan to generate insights.');
        setHistoricalData(response.data.cholesterol_trend || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setLipidRisk('Data Unavailable');
        setRiskAdvice('Awaiting document upload or backend connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // 3. Dynamic UI Helper Functions
  const getRiskUI = (risk, loading) => {
    if (loading) return { cardBg: 'bg-white/40 border-slate-100/50 backdrop-blur-sm', badgeColor: 'bg-slate-100/80', badgeText: 'text-slate-500', label: 'Processing...', icon: Loader2, mainTextColor: 'text-slate-800' };
    
    const safeRisk = risk ? risk.toLowerCase() : "";

    const config = {
      alert: { cardBg: 'bg-rose-50/40 border-rose-100/50 backdrop-blur-sm', badgeColor: 'bg-rose-100/80', badgeText: 'text-rose-700', iconColor: 'text-rose-500', label: 'ALERT', icon: ShieldAlert, mainTextColor: 'text-rose-900' },
      elevated: { cardBg: 'bg-amber-50/40 border-amber-100/50 backdrop-blur-sm', badgeColor: 'bg-amber-100/80', badgeText: 'text-amber-700', iconColor: 'text-amber-500', label: 'ELEVATED', icon: AlertTriangle, mainTextColor: 'text-amber-900' },
      optimal: { cardBg: 'bg-emerald-50/40 border-emerald-100/50 backdrop-blur-sm', badgeColor: 'bg-emerald-100/80', badgeText: 'text-emerald-700', iconColor: 'text-emerald-500', label: 'OPTIMAL', icon: CheckCircle, mainTextColor: 'text-emerald-900' },
      default: { cardBg: 'bg-slate-50/40 border-slate-100/50 backdrop-blur-sm', badgeColor: 'bg-slate-100/80', badgeText: 'text-slate-700', iconColor: 'text-slate-500', label: 'PENDING', icon: Activity, mainTextColor: 'text-slate-900' }
    };

    if (safeRisk.includes('elevated') || safeRisk.includes('high')) return config.elevated;
    if (safeRisk.includes('alert')) return config.alert;
    if (safeRisk.includes('optimal')) return config.optimal;

    return config.default;
  };

  const getIndexUI = (index) => {
    if (index >= 80) return { cardBg: 'bg-emerald-50/40 border-emerald-100/50 backdrop-blur-sm', indexColor: 'text-emerald-600', label: 'Optimal Wellness', badgeColor: 'bg-emerald-100/80', badgeText: 'text-emerald-800', icon: HeartPulse };
    if (index > 0 && index < 80) return { cardBg: 'bg-amber-50/40 border-amber-100/50 backdrop-blur-sm', indexColor: 'text-amber-600', label: 'Needs Attention', badgeColor: 'bg-amber-100/80', badgeText: 'text-amber-800', icon: Activity };
    return { cardBg: 'bg-slate-50/40 border-slate-100/50 backdrop-blur-sm', indexColor: 'text-slate-400', label: 'Awaiting Scan', badgeColor: 'bg-slate-100/80', badgeText: 'text-slate-500', icon: Loader2 };
  };

  const riskUI = getRiskUI(lipidRisk, isLoading);
  const RiskIcon = riskUI.icon;
  
  const indexUI = getIndexUI(healthIndex);
  const IndexIcon = indexUI.icon;

  // 4. Render UI layout
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
                <span className={`text-6xl font-black ${indexUI.indexColor}`}>{healthIndex}</span>
                <span className="text-xl font-bold text-slate-400">/ 100</span>
              </div>
              <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${indexUI.badgeColor} ${indexUI.badgeText} text-sm font-semibold`}>
                <div className={`w-2 h-2 rounded-full ${indexUI.indexColor}`} />
                {indexUI.label}
              </div>
            </div>
          </div>

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
              {lipidRisk}
            </div>
            <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
              {riskAdvice}
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
          
          <div className="h-80 w-full flex flex-col">
            {historicalData.length > 0 ? (
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
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                No historical data available. Upload a lab scan to begin tracking.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}