// src/pages/ChatPage.jsx
import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, FileText, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello Alex! I am your CuraTwin digital replica. I've analyzed your biological baseline and your uploaded lab reports up to July 2026. How can I assist with your health insights today?",
      citations: ["Baseline Profile", "Lab Report - July 2026"],
      modelUsed: "CuraTwin-Fast (Llama-3-8B)"
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('fast');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedPrompts = [
    "💊 Summarize my active prescriptions",
    "🥗 Suggest a diet based on my latest glucose trend",
    "📈 Compare my blood pressure between March and July"
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    // Add User Message
    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulate RAG AI Reasoning & Vector Search Delay
    setTimeout(() => {
      let replyText = "Based on your latest lipid panel and fasting glucose of 95 mg/dL, your metabolic markers are stabilizing well within optimal ranges. However, I recommend monitoring your sodium intake to support your systolic BP trend.";
      let citations = ["Lab Report - July 2026", "Tesseract OCR Biomarker Vault"];
      
      if (query.includes("prescriptions") || query.includes("💊")) {
        replyText = "You are currently listed on Lisinopril 5mg daily for mild blood pressure management. No negative drug interactions were detected with your reported allergy to Penicillin.";
        citations = ["Clinical Onboarding Context", "Rx Database"];
      } else if (query.includes("diet") || query.includes("🥗")) {
        replyText = "To maintain your HbA1c at optimal levels (currently 5.6%), focus on high-fiber complex carbohydrates and lean proteins. Reducing refined sugars will help sustain your downward blood glucose trend from February (118 mg/dL) to July (95 mg/dL).";
        citations = ["Metabolic Panel - Feb to Jul 2026", "Nutritional RAG Knowledgebase"];
      }

      const aiMsg = {
        sender: 'ai',
        text: replyText,
        citations: citations,
        modelUsed: selectedModel === 'fast' ? "CuraTwin-Fast (Llama-3-8B)" : "CuraTwin-Clinical (BioMistral-70B)"
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1800);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      
      {/* Top Header & Model Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: '#0f172a', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles color="#2563eb" size={24} /> Closed-Domain RAG Assistant
          </h1>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Responses are strictly grounded in your Medical Vault documents. No hallucinations.</span>
        </div>

        {/* Model Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <Cpu size={16} color="#64748b" />
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{ border: 'none', backgroundColor: 'transparent', fontWeight: '600', color: '#1e293b', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="fast">⚡ Fast Twin (Llama-3-8B - Daily Queries)</option>
            <option value="deep">🧠 Deep Reasoning (BioMistral-70B - Complex Trends)</option>
          </select>
        </div>
      </div>

      {/* Chat Messages Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px', marginBottom: '16px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '12px', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            
            {/* Avatar */}
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: msg.sender === 'user' ? '#2563eb' : '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#ffffff' }}>
              {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>

            {/* Bubble Content */}
            <div style={{ backgroundColor: msg.sender === 'user' ? '#2563eb' : '#ffffff', color: msg.sender === 'user' ? '#ffffff' : '#1e293b', padding: '16px', borderRadius: '16px', border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              
              {/* AI Model Metadata */}
              {msg.sender === 'ai' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <ShieldCheck size={14} color="#10b981" /> Grounded Response • {msg.modelUsed}
                </div>
              )}

              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>{msg.text}</p>

              {/* Source Citations */}
              {msg.citations && (
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Sources:</span>
                  {msg.citations.map((cite, cIdx) => (
                    <span key={cIdx} style={{ fontSize: '11px', backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #cbd5e1', cursor: 'pointer' }}>
                      <FileText size={10} /> {cite}
                    </span>
                  ))}
                </div>
              )}

            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start', alignItems: 'center', color: '#64748b', fontSize: '13px', fontStyle: 'italic', padding: '8px' }}>
            <Bot size={18} color="#10b981" /> Querying vector database and generating clinical response...
          </div>
        )}
      </div>

      {/* Suggested Query Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {suggestedPrompts.map((prompt, idx) => (
          <button 
            key={idx}
            onClick={() => handleSend(prompt)}
            style={{ padding: '6px 12px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '20px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Bottom Input Box */}
      <div style={{ display: 'flex', gap: '10px', backgroundColor: '#ffffff', padding: '8px', borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask your digital health twin anything..."
          style={{ flex: 1, border: 'none', padding: '8px 12px', fontSize: '14px', outline: 'none', color: '#1e293b' }}
        />
        <button 
          onClick={() => handleSend()}
          style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          Send <Send size={16} />
        </button>
      </div>

    </div>
  );
}