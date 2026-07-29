import React, { useState } from 'react';
import axios from 'axios';

export default function LabScanUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setStatus('Uploading and running AI Vision Check...');
    
    try {
      // Sending the file to Himanshu's backend FastAPI router
      const response = await axios.post('http://localhost:8000/api/ocr/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setStatus('Success! Scan processed and biomarkers extracted.');
      console.log(response.data);
      
    } catch (err) {
      // If your OpenCV script rejects it (e.g., too blurry), the error shows here!
      if (err.response && err.response.data) {
        setError(err.response.data.detail || 'Upload failed. Please try again.');
      } else {
        setError('Server connection error. Is the backend running?');
      }
      setStatus('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Upload Medical Scan</h3>
      <p className="text-sm text-gray-500 mb-4">
        Upload your lab checkup report. Our computer vision AI will check image quality before processing.
      </p>
      
      <div className="flex items-center space-x-4">
        <input 
          type="file" 
          accept="image/*,.pdf" 
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button 
          onClick={handleUpload}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Upload
        </button>
      </div>

      {status && <p className="mt-4 text-green-600 font-medium">{status}</p>}
      {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
    </div>
  );
}