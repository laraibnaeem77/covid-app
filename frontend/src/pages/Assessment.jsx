import React, { useState } from 'react';

const SYMPTOMS = [
  { key: 'fever', label: 'Fever', icon: '🌡️' },
  { key: 'cough', label: 'Cough', icon: '😮‍💨' },
  { key: 'fatigue', label: 'Fatigue', icon: '😴' },
  { key: 'shortness_of_breath', label: 'Shortness of Breath', icon: '🫁' },
  { key: 'loss_of_smell', label: 'Loss of Smell/Taste', icon: '👃' },
  { key: 'headache', label: 'Headache', icon: '🤕' },
];

const COMORBIDITIES = [
  { key: 'diabetes', label: 'Diabetes', icon: '💉' },
  { key: 'hypertension', label: 'Hypertension', icon: '❤️' },
  { key: 'heart_disease', label: 'Heart Disease', icon: '🫀' },
  { key: 'asthma', label: 'Asthma', icon: '🌬️' },
  { key: 'cancer', label: 'Cancer', icon: '🔬' },
];

const RISK_COLORS = {
  'Very Low': '#22c55e',
  'Low': '#84cc16',
  'Moderate': '#f59e0b',
  'High': '#f97316',
  'Very High': '#ef4444',
};

const initialForm = {
  age: '',
  gender: '',
  vaccination_status: '',
  fever: 0, cough: 0, fatigue: 0,
  shortness_of_breath: 0, loss_of_smell: 0, headache: 0,
  diabetes: 0, hypertension: 0, heart_disease: 0, asthma: 0, cancer: 0,
};

export default function Assessment() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggle = (key) => setForm(f => ({ ...f, [key]: f[key] === 1 ? 0 : 1 }));
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.age || !form.gender || !form.vaccination_status) {
      setError('Please fill in age, gender, and vaccination status.');
      return;
    }
    if (form.age < 0 || form.age > 120) {
      setError('Please enter a valid age (0–120).');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, age: parseInt(form.age) }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data);
      setTimeout(() => {
        document.getElementById('results-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (e) {
      setError(`Error: ${e.message}. Make sure the backend API is running on port 8000.`);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setForm(initialForm); setResult(null); setError(null); };

  return (
    <div className="assessment-page">
      <div className="assessment-hero">
        <h1>COVID-19 Risk Assessment</h1>
        <p>Complete the form below for your personalized AI-powered risk evaluation</p>
      </div>

      <div className="assessment-layout">
        {/* LEFT: FORM */}
        <div className="form-card">
          <div className="form-section-title">👤 Personal Information</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Age *</label>
              <input
                className="form-input"
                type="number" min="0" max="120"
                placeholder="e.g. 35"
                value={form.age}
                onChange={e => set('age', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender *</label>
              <select className="form-select" value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Vaccination Status *</label>
            <select className="form-select" value={form.vaccination_status} onChange={e => set('vaccination_status', e.target.value)}>
              <option value="">Select status</option>
              <option value="Unvaccinated">Unvaccinated</option>
              <option value="Partially Vaccinated">Partially Vaccinated (1 dose)</option>
              <option value="Fully Vaccinated">Fully Vaccinated (2 doses)</option>
              <option value="Booster Dose">Booster Dose</option>
            </select>
          </div>

          <div className="form-section-title">🤒 Current Symptoms</div>
          <p style={{ fontSize: 13, color: 'rgba(180,175,220,0.5)', marginBottom: 14 }}>Select all symptoms you are currently experiencing</p>
          <div className="symptom-grid">
            {SYMPTOMS.map(s => (
              <button key={s.key} className={`symptom-btn ${form[s.key] ? 'active' : ''}`} onClick={() => toggle(s.key)}>
                <span className="symptom-check">{form[s.key] ? '✓' : ''}</span>
                <span className="symptom-icon">{s.icon}</span>
                <span className="symptom-label">{s.label}</span>
              </button>
            ))}
          </div>

          <div className="form-section-title">⚕️ Pre-existing Conditions</div>
          <p style={{ fontSize: 13, color: 'rgba(180,175,220,0.5)', marginBottom: 14 }}>Select any conditions that apply to you</p>
          <div className="comorbidity-grid">
            {COMORBIDITIES.map(c => (
              <button key={c.key} className={`symptom-btn ${form[c.key] ? 'active' : ''}`} onClick={() => toggle(c.key)}>
                <span className="symptom-check">{form[c.key] ? '✓' : ''}</span>
                <span className="symptom-icon">{c.icon}</span>
                <span className="symptom-label">{c.label}</span>
              </button>
            ))}
          </div>

          {error && (
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#fca5a5', fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}

          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? <><div className="spinner" /> Analyzing...</> : '🔬 Analyze My Risk'}
          </button>
          {result && (
            <button onClick={reset} style={{ width: '100%', marginTop: 10, background: 'transparent', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 10, padding: 12, color: 'rgba(180,175,220,0.6)', fontSize: 13, cursor: 'pointer' }}>
              ↺ Reset Form
            </button>
          )}
        </div>

        {/* RIGHT: RESULTS */}
        <div id="results-panel" className="results-panel">
          {!result ? (
            <div className="placeholder-card">
              <span className="placeholder-icon">🧬</span>
              <div className="placeholder-title">Results will appear here</div>
              <div className="placeholder-text">Complete the assessment form and click "Analyze My Risk" to get your personalized COVID-19 risk evaluation.</div>
            </div>
          ) : (
            <>
              {/* Verdict card */}
              <div className={`result-card ${result.positive ? 'glow-positive' : 'glow-negative'}`}>
                <div className="result-header">
                  <span className="result-icon">{result.positive ? '⚠️' : '✅'}</span>
                  <div className="result-verdict">{result.prediction}</div>
                  <div className="result-subtitle">Based on your symptom profile</div>
                </div>

                <div className="gauge-container">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div className="gauge-score" style={{ color: RISK_COLORS[result.risk_level] || '#a78bfa' }}>
                      {result.risk_score}%
                    </div>
                    <div className="gauge-level" style={{ color: RISK_COLORS[result.risk_level] || '#a78bfa' }}>
                      {result.risk_level} Risk
                    </div>
                  </div>
                  <div className="gauge-bar-bg" style={{ width: '100%' }}>
                    <div className="gauge-bar-fill" style={{
                      width: `${result.risk_score}%`,
                      background: `linear-gradient(90deg, #22c55e, ${RISK_COLORS[result.risk_level] || '#7c3aed'})`
                    }} />
                  </div>
                  <div className="gauge-labels"><span>0%</span><span>50%</span><span>100%</span></div>
                </div>

                <div className="result-stats">
                  <div className="stat-mini">
                    <div className="stat-mini-val">{result.model_confidence}%</div>
                    <div className="stat-mini-label">Model Confidence</div>
                  </div>
                  <div className="stat-mini">
                    <div className="stat-mini-val">{result.symptom_count}/6</div>
                    <div className="stat-mini-label">Symptoms Reported</div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="result-card">
                <div className="recs-title">📋 Recommendations</div>
                {result.recommendations.map((r, i) => (
                  <div key={i} className={`rec-item ${r.priority}`}>
                    <span className="rec-icon">{r.icon}</span>
                    <span>{r.text}</span>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12, color: 'rgba(160,155,200,0.5)', lineHeight: 1.6 }}>
                ⚕️ <strong style={{ color: 'rgba(180,175,220,0.6)' }}>Medical Disclaimer:</strong> This tool provides informational guidance only and does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
