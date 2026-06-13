import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '🧠', title: 'AI-Powered Prediction', desc: 'Random Forest model trained on 3,000 patient records achieving 92.8% accuracy and 0.98 AUC-ROC score.' },
  { icon: '⚡', title: 'Instant Results', desc: 'Get your COVID risk assessment in seconds with color-coded severity levels and actionable recommendations.' },
  { icon: '💉', title: 'Vaccination Analysis', desc: 'Accounts for vaccination status (Unvaccinated, Partial, Full, Booster) to provide accurate risk profiling.' },
  { icon: '🏥', title: 'Clinical Recommendations', desc: 'Receive evidence-based guidance tailored to your specific symptoms, age, and comorbidities.' },
  { icon: '📊', title: 'Risk Stratification', desc: 'Five-tier risk scale (Very Low → Very High) with probability scores to help prioritize care.' },
  { icon: '🔒', title: 'Privacy-First', desc: 'Your health data is processed locally. Nothing is stored or shared with third parties.' },
];

const steps = [
  { n: '01', title: 'Enter Your Details', desc: 'Provide your age, gender, vaccination status and select your symptoms.' },
  { n: '02', title: 'AI Analysis', desc: 'Our Random Forest model analyzes 14 clinical features in real time.' },
  { n: '03', title: 'Get Your Risk Score', desc: 'Receive a 0–100% risk score, severity level, and personalized recommendations.' },
];

export default function Home() {
  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            ML Model · 92.8% Accuracy · 0.98 AUC-ROC
          </div>
          <h1 className="hero-title">
            COVID-19 Risk
            <span className="gradient-text">Assessment AI</span>
          </h1>
          <p className="hero-subtitle">
            Get an instant, AI-powered COVID-19 risk evaluation based on your symptoms,
            vaccination status, and health profile — backed by a Random Forest model
            trained on real clinical data.
          </p>
          <div className="hero-actions">
            <Link to="/assessment" className="btn-primary">
              🧪 Start Free Assessment
            </Link>
            <Link to="/symptom-guide" className="btn-secondary">
              📋 Symptom Guide
            </Link>
          </div>
          <div className="hero-stats">
            {[
              { val: '92.8%', label: 'Model Accuracy' },
              { val: '0.98', label: 'AUC-ROC Score' },
              { val: '3,000', label: 'Training Records' },
              { val: '14', label: 'Clinical Features' },
            ].map(s => (
              <div key={s.label} className="hero-stat">
                <div className="hero-stat-val">{s.val}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Why CoviScan</div>
            <h2 className="section-title">Clinical-grade AI in your browser</h2>
            <p className="section-subtitle">Powered by ensemble machine learning trained on verified medical datasets</p>
          </div>
          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card fade-up">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: 'rgba(124,58,237,0.04)', borderTop: '1px solid rgba(124,58,237,0.12)', borderBottom: '1px solid rgba(124,58,237,0.12)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Process</div>
            <h2 className="section-title">How it works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {steps.map(s => (
              <div key={s.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '28px', background: 'rgba(18,16,58,0.5)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '20px' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '40px', fontWeight: 800, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '12px' }}>{s.n}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{s.title}</div>
                <div style={{ fontSize: '14px', color: 'rgba(180,175,220,0.65)', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.1))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '28px', padding: '60px 32px' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '36px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
              Ready to check your risk?
            </h2>
            <p style={{ color: 'rgba(200,195,255,0.65)', marginBottom: '28px', fontSize: '16px', maxWidth: '480px', margin: '0 auto 28px' }}>
              Takes less than 2 minutes. No account required. Results are instant.
            </p>
            <Link to="/assessment" className="btn-primary" style={{ fontSize: '16px', padding: '16px 36px' }}>
              🧪 Begin Assessment Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
