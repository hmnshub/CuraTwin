import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function VaultPage() {
  const { token: contextToken } = useContext(AuthContext); 

  // BULLETPROOF TOKEN FALLBACK: Checks context first, then browser storage
  const token = contextToken || localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('access_token');

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]); 
  const [error, setError] = useState(null);

  // 1. Fetch historical reports when the page loads
  useEffect(() => {
    const fetchVaultHistory = async () => {
      if (!token) {
        console.warn("⚠️ No auth token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/vault/history', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setReports(response.data.reports || []);
      } catch (err) {
        console.error('Failed to fetch past reports:', err);
      }
    };

    fetchVaultHistory();
  }, [token]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!token) {
      setError('Authentication token missing. Please log out and log back in.');
      return;
    }

    if (!selectedFile) {
      setError('Please select a lab report image or PDF first.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/api/vault/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        },
      });
      
      setReports((prevReports) => [response.data, ...prevReports]);
      setSelectedFile(null);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err.response?.data?.detail || 'Failed to connect to backend server. Make sure FastAPI is running on port 8000!'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-2">
          Medical Vault & OCR Parser
        </h1>
        <p className="text-slate-400 mb-8">
          Upload your clinical lab reports (PNG, JPG, PDF) to automatically extract biomarkers into your Biological Twin.
        </p>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center bg-slate-900/50 hover:border-teal-500 transition-colors mb-8">
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center justify-center gap-3"
          >
            <div className="p-4 bg-slate-800 rounded-full text-teal-400">
              📁
            </div>
            <span className="text-lg font-medium text-slate-200">
              {selectedFile ? selectedFile.name : 'Click to browse or drop your lab report here'}
            </span>
            <span className="text-sm text-slate-500">Supports PNG, JPG, or PDF up to 10MB</span>
          </label>

          {selectedFile && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-6 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 font-semibold rounded-lg shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Running Tesseract OCR...' : 'Process Lab Report'}
            </button>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-900/40 border border-red-500 text-red-300 rounded-lg mb-8">
            ⚠️ {error}
          </div>
        )}

        {/* Dynamic Extracted Results Display (History Loop) */}
        {reports.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-slate-300 border-b border-slate-800 pb-2">Your Extracted Records</h2>
            
            {reports.map((report, index) => (
              <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl animate-fade-in">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-teal-400">Extracted Biomarker Analysis</h2>
                    <p className="text-xs text-slate-500">File: {report.filename} {report.file_size_mb && `(${report.file_size_mb} MB)`}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                    report.status === 'Success - Verified Lab Report' 
                      ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' 
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  }`}>
                    {report.status || "Processed"}
                  </span>
                </div>

                {/* OCR Raw Text Snippet */}
                {report.extracted_text_snippet && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-400 mb-2">Raw OCR Text Sample:</h3>
                    <div className="p-3 bg-slate-950 rounded border border-slate-800/80 text-xs text-slate-400 font-mono italic">
                      "{report.extracted_text_snippet}"
                    </div>
                  </div>
                )}

                {/* Biomarker Table */}
                {report.biomarkers && report.biomarkers.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-sm">
                          <th className="pb-3">Biomarker Metric</th>
                          <th className="pb-3">Value</th>
                          <th className="pb-3">Unit</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Confidence</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-sm">
                        {report.biomarkers.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30">
                            <td className="py-3 font-medium text-slate-200">{item.metric}</td>
                            <td className="py-3 font-bold text-white">{item.value}</td>
                            <td className="py-3 text-slate-400">{item.unit}</td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  item.status === 'Optimal'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3 text-slate-500">{item.confidence}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}