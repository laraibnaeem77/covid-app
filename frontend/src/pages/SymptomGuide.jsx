import React, { useState } from 'react';

const symptoms = [
  { icon: '🌡️', name: 'Fever', severity: 'high', prevalence: 61, desc: 'A temperature of 38°C (100.4°F) or higher. One of the most common COVID-19 signs, often appearing in the first few days. Fever indicates your immune system is fighting infection.', when: 'Appears within 2–14 days of exposure.', action: 'Monitor every 4–6 hours. Seek care if above 39.5°C or lasting more than 3 days.' },
  { icon: '😮‍💨', name: 'Cough', severity: 'medium', prevalence: 68, desc: 'Typically a new, continuous dry cough. May become productive over time. One of the cardinal symptoms used by health authorities for COVID-19 screening worldwide.', when: 'Usually appears early in the illness (days 1–5).', action: 'Stay hydrated. If cough becomes severe or accompanied by chest pain, seek care immediately.' },
  { icon: '😴', name: 'Fatigue', severity: 'medium', prevalence: 72, desc: 'Extreme tiredness not relieved by rest. Fatigue is the most reported symptom in COVID-19 patients and may persist for weeks — a hallmark of Long COVID.', when: 'Can appear at any stage of infection.', action: 'Rest as needed. Avoid strenuous activity. Persistent fatigue beyond 4 weeks warrants medical review.' },
  { icon: '🫁', name: 'Shortness of Breath', severity: 'high', prevalence: 32, desc: 'Difficulty breathing or feeling winded with minimal exertion. This is a serious warning sign indicating potential lung involvement and requires urgent medical evaluation.', when: 'Usually appears later (days 5–10) in moderate-to-severe cases.', action: '🚨 Seek emergency care immediately if breathing is labored, or use of accessory muscles is visible.' },
  { icon: '👃', name: 'Loss of Smell / Taste', severity: 'medium', prevalence: 43, desc: 'Sudden anosmia (loss of smell) or ageusia (loss of taste) without nasal congestion is a highly specific COVID-19 indicator. The SARS-CoV-2 virus directly infects olfactory neurons.', when: 'Often appears early — sometimes before other symptoms.', action: 'Get a PCR test. Isolate immediately. Most cases recover within 4–8 weeks.' },
  { icon: '🤕', name: 'Headache', severity: 'low', prevalence: 55, desc: 'Often described as pressing or tightening, sometimes severe. Likely caused by systemic inflammation, fever, or direct neurological involvement of the virus.', when: 'Can appear any time during illness.', action: 'Over-the-counter pain relief (paracetamol/ibuprofen) may help. Consult a doctor if severe or persistent.' },
];

const comorbidities = [
  { icon: '💉', name: 'Diabetes', risk: 'High', desc: 'Hyperglycemia impairs immune response. Diabetics have significantly higher rates of severe COVID-19, ICU admission, and mortality. Blood sugar control is critical.' },
  { icon: '❤️', name: 'Hypertension', risk: 'High', desc: 'High blood pressure damages blood vessels and impairs cardiac function, making COVID-related cardiovascular complications more likely.' },
  { icon: '🫀', name: 'Heart Disease', risk: 'Very High', desc: 'Pre-existing cardiac conditions dramatically increase risk of myocarditis, arrhythmias, and heart failure if infected with SARS-CoV-2.' },
  { icon: '🌬️', name: 'Asthma', risk: 'Moderate', desc: 'Respiratory conditions increase vulnerability to lung complications. Well-controlled asthma carries lower risk, but exacerbation during COVID-19 is common.' },
  { icon: '🔬', name: 'Cancer', risk: 'Very High', desc: 'Chemotherapy and cancer itself suppress immunity. Cancer patients face elevated risk of severe illness and should be prioritized for vaccination and early treatment.' },
];

const riskMap = { 'Very High': 'severity-high', 'High': 'severity-high', 'Moderate': 'severity-medium', 'Low': 'severity-low' };

export default function SymptomGuide() {
  const [active, setActive] = useState(null);

  return (
    <div className="page">
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Reference Guide</div>
            <h1 className="section-title">COVID-19 Symptom Guide</h1>
            <p className="section-subtitle">Understand each symptom's significance, timeline, and when to seek care</p>
          </div>

          <div className="guide-grid">
            {symptoms.map(s => (
              <div key={s.name} className="guide-card" onClick={() => setActive(active === s.name ? null : s.name)} style={{ cursor: 'pointer' }}>
                <div className="guide-card-header">
                  <span className="guide-card-icon">{s.icon}</span>
                  <span className="guide-card-title">{s.name}</span>
                  <span className={`guide-card-severity severity-${s.severity}`}>
                    {s.severity === 'high' ? 'Serious' : s.severity === 'medium' ? 'Moderate' : 'Mild'}
                  </span>
                </div>
                <p className="guide-card-desc">{s.desc}</p>
                {active === s.name && (
                  <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#c4b5fd' }}>
                      ⏱️ <strong>Timing:</strong> {s.when}
                    </div>
                    <div style={{ background: s.severity === 'high' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${s.severity === 'high' ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: s.severity === 'high' ? '#fca5a5' : 'rgba(200,195,255,0.7)' }}>
                      💊 <strong>Action:</strong> {s.action}
                    </div>
                  </div>
                )}
                <div className="guide-card-prevalence">
                  Reported in {s.prevalence}% of COVID-19 cases
                  <div className="prevalence-bar"><div className="prevalence-fill" style={{ width: `${s.prevalence}%` }} /></div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 60 }}>
            <div className="section-header">
              <div className="section-eyebrow">Risk Factors</div>
              <h2 className="section-title">Pre-existing Conditions</h2>
              <p className="section-subtitle">How underlying health conditions affect COVID-19 severity</p>
            </div>
            <div className="guide-grid">
              {comorbidities.map(c => (
                <div key={c.name} className="guide-card">
                  <div className="guide-card-header">
                    <span className="guide-card-icon">{c.icon}</span>
                    <span className="guide-card-title">{c.name}</span>
                    <span className={`guide-card-severity ${riskMap[c.risk] || 'severity-medium'}`}>{c.risk} Risk</span>
                  </div>
                  <p className="guide-card-desc">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency box */}
          <div style={{ marginTop: 48, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: '28px 32px' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, color: '#f87171', marginBottom: 14 }}>
              🚨 Emergency Warning Signs
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(200,195,255,0.7)', marginBottom: 14 }}>
              Call emergency services immediately if you experience any of the following:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              {['Trouble breathing / gasping', 'Persistent chest pain or pressure', 'Confusion or altered mental status', 'Inability to stay awake', 'Lips or fingernails turning blue', 'High fever unresponsive to medication'].map(w => (
                <div key={w} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#fca5a5' }}>
                  <span>🔴</span> {w}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
