// frontend/src/components/LabScanUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileImage, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function LabScanUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'uploading', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('error');
      setMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setStatus('uploading');
    setMessage('Computer Vision AI analyzing scan quality...');
    
    try {
      const response = await axios.post('http://localhost:8000/api/ocr/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus('success');
      setMessage('Scan processed successfully. Biomarkers extracted.');
    } catch (err) {
      setStatus('error');
      if (err.response && err.response.data) {
        setMessage(err.response.data.detail || 'Upload failed. Please try again.');
      } else {
        setMessage('Backend connection error. Ensure FastAPI is running.');
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 transition-all">
      <div className="flex flex-col md:flex-row items-center gap-8">
        
        {/* Left Side: Drag & Drop Zone */}
        <div className="w-full md:w-1/2 relative group">
          <input 
            type="file" 
            accept="image/*,.pdf" 
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 ${
            file ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 group-hover:border-indigo-400 group-hover:bg-indigo-50/50'
          }`}>
            {file ? (
              <>
                <FileImage className="w-10 h-10 text-indigo-600 mb-3" />
                <p className="text-sm font-bold text-indigo-900 truncate w-full px-4">{file.name}</p>
                <p className="text-xs text-indigo-500 mt-1 font-medium">Ready to analyze</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-10 h-10 text-slate-400 mb-3 group-hover:text-indigo-500 transition-colors" />
                <p className="text-sm font-bold text-slate-700">Click or drag scan here</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">JPEG, PNG, or PDF up to 10MB</p>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Action & Status */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-slate-800 mb-2">Upload Medical Scan</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Our OpenCV engine validates image clarity before pushing to the OCR neural network. Blurry images will be rejected instantly.
          </p>
          
          <button 
            onClick={handleUpload}
            disabled={!file || status === 'uploading'}
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
          >
            {status === 'uploading' ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
            ) : 'Run AI Analysis'}
          </button>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="mt-4 flex items-start gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-semibold">{message}</p>
            </div>
          )}
          {status === 'error' && (
            <div className="mt-4 flex items-start gap-2 text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-semibold">{message}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}