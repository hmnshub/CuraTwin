import React, { useState, useEffect, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import LabScanUpload from '../components/LabScanUpload';

export default function DashboardPage() {
    const { token } = useContext(AuthContext);

    // 1. Set up state for your dynamic data
    const [healthIndex, setHealthIndex] = useState(0);
    const [lipidRisk, setLipidRisk] = useState('Loading...');
    const [riskAdvice, setRiskAdvice] = useState('Fetching latest insights...');
    const [historicalData, setHistoricalData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 2. Fetch data when the dashboard loads
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/vault/summary', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Update state with real data from the backend
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

        if (token) {
            fetchDashboardData();
        } else {
            setIsLoading(false);
        }
    }, [token]);

    // 3. Render a loading state while fetching from the backend
    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50">
                <div className="text-xl font-medium text-blue-600 animate-pulse">Syncing with Twin Engine...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">CuraTwin Biological Dashboard</h1>
                    <p className="text-gray-500">Welcome back! Your health twin is fully synced.</p>
                </header>

                {/* FILE UPLOAD COMPONENT RENDERED HERE */}
                <div className="mb-8">
                    <LabScanUpload />
                </div>

                {/* Top Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    
                    {/* Health Score Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-medium text-gray-700">Biological Twin Index</h3>
                        <div className="mt-4 flex items-baseline text-5xl font-extrabold text-green-500">
                            {healthIndex}
                            <span className="ml-2 text-xl font-medium text-gray-500">/ 100</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            {healthIndex > 80 ? 'Optimal Wellness' : 'Needs Attention'}
                        </p>
                    </div>

                    {/* Lipids Risk Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-medium text-gray-700">Hyperlipidemia Risk</h3>
                        <div className={`mt-4 text-2xl font-bold ${lipidRisk === 'Elevated' || lipidRisk === 'High' ? 'text-yellow-500' : 'text-green-500'}`}>
                            {lipidRisk}
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                            {riskAdvice}
                        </p>
                    </div>
                    
                </div>

                {/* Historical Trend Graph */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-96 flex flex-col">
                    <h3 className="text-lg font-medium text-gray-700 mb-6">Cholesterol Trend (6 Months)</h3>
                    {historicalData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%" className="flex-1">
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
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                            No historical data available. Upload a lab scan to begin tracking.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}