// src/pages/VaultPage.jsx
import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Database, ArrowRight } from 'lucide-react';

export default function VaultPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [isCommitted, setIsCommitted] = useState(false);

  // Handle Drag & Drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) startOcrSimulation(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) startOcrSimulation(selectedFile);
  };

  // Simulate calling your Tesseract/FastAPI endpoint
  const startOcrSimulation = (uploadedFile) => {
    setFile(uploadedFile);
    setIsProcessing(true);
    setExtractedData(null);
    setIsCommitted(false);

    // Simulate a 2.5-second OCR extraction delay
    setTimeout(() => {
      setIsProcessing(false);
      setExtractedData([
        { metric: "Fasting Blood Glucose", value: "95", unit: "mg/dL", status: "Normal", confidence: "98.4%" },
        { metric: "HbA1c (Glycated Hemoglobin)", value: "5.6", unit: "%", status: "Optimal", confidence: "99.1%" },
        { metric: "Total Cholesterol", value: "178", unit: "mg/dL", status: "Normal", confidence: "97.8%" },
        { metric: "Triglycerides", value: "112", unit: "mg/dL", status: "Normal", confidence: "96.5%" },
        { metric: "Systolic BP (Extracted)", value: "118", unit: "mmHg", status: "Optimal", confidence: "95.2%" }
      ]);
    }, 2500);
  };

  const commitToMemory = () => {
    setIsCommitted(true);
    // This is where we will eventually trigger axios.post('/api/vault/save') to MongoDB
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', color: '#0f172a', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Database color="#2563eb" /> Medical Vault & OCR Ingestion
        </h1>
        <p style={{ color: '#64748b', margin: 0 }}>
          Upload lab reports, prescriptions, or blood panels. Our OCR pipeline automatically parses biological metrics to update your Digital Twin.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* LEFT COLUMN: Drag and Drop Zone */}
        <div>
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${isDragging ? '#2563eb' : '#cbd5e1'}`,
              backgroundColor: isDragging ? '#eff6ff' : '#ffffff',
              borderRadius: '16px',
              padding: '40px 20px',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
            }}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <input 
              type="file" 
              id="fileInput" 
              style={{ display: 'none' }} 
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileSelect}
            />
            <UploadCloud size={48} color={isDragging ? '#2563eb' : '#64748b'} style={{ margin: '0 auto 16px' }} />
            <h3 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '18px' }}>
              Drag & Drop your Lab Report here
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 16px' }}>
              Supports PDF, PNG, JPG (Max 10MB)
            </p>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Browse Files
            </button>
          </div>

          {/* Selected File Status */}
          {file && (
            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText color="#2563eb" size={24} />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ margin: 0, fontWeight: '600', color: '#1e293b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {file.name}
                </p>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for OCR
                </span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: OCR Extraction Results View */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          {/* State 1: Nothing uploaded yet */}
          {!file && !isProcessing && (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
              <AlertCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p style={{ margin: 0, fontWeight: '500' }}>No document selected</p>
              <span style={{ fontSize: '13px' }}>Upload a report on the left to view extracted AI insights.</span>
            </div>
          )}

          {/* State 2: Processing OCR Simulation */}
          {isProcessing && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Loader2 size={40} color="#2563eb" style={{ margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
              <h4 style={{ margin: '0 0 8px', color: '#1e293b' }}>Analyzing Medical Document...</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                Running Tesseract OCR & NLP Entity Recognition
              </p>
            </div>
          )}

          {/* State 3: Extracted Data Display */}
          {extractedData && !isProcessing && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>Extracted Biomarkers (NLP)</h3>
                <span style={{ fontSize: '12px', backgroundColor: '#dcfce7', color: '#16a34a', padding: '4px 8px', borderRadius: '12px', fontWeight: '600' }}>
                  ● OCR High Confidence
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', maxHeight: '280px', overflowY: 'auto' }}>
                {extractedData.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155' }}>{item.metric}</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Confidence: {item.confidence}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>{item.value}</span>{' '}
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Commit Button */}
              {!isCommitted ? (
                <button 
                  onClick={commitToMemory}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  Commit to Twin Memory <ArrowRight size={18} />
                </button>
              ) : (
                <div style={{ padding: '12px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '8px', textAlign: 'center', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <CheckCircle2 size={20} /> Successfully Saved to Digital Replica!
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}