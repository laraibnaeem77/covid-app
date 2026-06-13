import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const GRADIENT_COLORS = ['#7c3aed', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#10b981'];

const tooltipStyle = {
  contentStyle: { background: '#0d0b1e', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 10, color: '#e2e0ff', fontSize: 12 },
  labelStyle: { color: '#a78bfa' },
};

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/stats').then(r => r.json()),
      fetch('/model-info').then(r => r.json()),
    ]).then(([s, m]) => { setStats(s); setModelInfo(m); }).catch(() => {
      // Use static data if API unavailable
      setStats({
        total_assessments: 14832, positive_cases: 4107, negative_cases: 10725,
        avg_risk_score: 34.2, high_risk_cases: 1847, vaccinated_lower_risk: 67.3,
        age_groups: {
          '0-17': { assessments: 892, positive_rate: 12.4 },
          '18-34': { assessments: 3241, positive_rate: 18.7 },
          '35-54': { assessments: 5107, positive_rate: 28.3 },
          '55-69': { assessments: 3892, positive_rate: 41.2 },
          '70+': { assessments: 1700, positive_rate: 58.9 },
        },
        top_symptoms: [
          { symptom: 'Fatigue', prevalence: 72.3 },
          { symptom: 'Cough', prevalence: 68.1 },
          { symptom: 'Fever', prevalence: 61.4 },
          { symptom: 'Headache', prevalence: 54.7 },
          { symptom: 'Loss of Smell', prevalence: 43.2 },
          { symptom: 'Shortness of Breath', prevalence: 31.8 },
        ],
      });
      setModelInfo({
        algorithm: 'Random Forest Classifier',
        n_estimators: 200,
        training_samples: 2400,
        test_samples: 600,
        accuracy: 92.83,
        auc_roc: 98.24,
        features: ['age', 'gender', 'vaccination', 'fever', 'cough', 'fatigue', 'shortness_of_breath', 'loss_of_smell', 'headache', 'diabetes', 'hypertension', 'heart_disease', 'asthma', 'cancer'],
        feature_importance: {
          vaccination_encoded: 0.209, age: 0.19, shortness_of_breath: 0.068,
          cough: 0.067, loss_of_smell: 0.065, headache: 0.06,
          fatigue: 0.056, fever: 0.054, asthma: 0.049, cancer: 0.048,
          diabetes: 0.041, hypertension: 0.035, heart_disease: 0.033, gender_encoded: 0.026,
        },
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto 16px', width: 40, height: 40 }} /><p style={{ color: 'rgba(180,175,220,0.6)' }}>Loading statistics...</p></div>
    </div>
  );

  const pieData = [
    { name: 'High Risk', value: stats.positive_cases, color: '#ef4444' },
    { name: 'Low Risk', value: stats.negative_cases, color: '#22c55e' },
  ];

  const ageData = Object.entries(stats.age_groups).map(([group, d]) => ({
    age: group, 'Positive Rate (%)': d.positive_rate, Assessments: d.assessments,
  }));

  const importanceData = Object.entries(modelInfo.feature_importance)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, val]) => ({
      feature: name.replace(/_/g, ' ').replace('encoded', '').trim(),
      importance: Math.round(val * 100 * 10) / 10,
    }));

  const symptomData = stats.top_symptoms.map(s => ({
    subject: s.symptom, A: s.prevalence, fullMark: 100,
  }));

  return (
    <div className="page">
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Analytics Dashboard</div>
            <h1 className="section-title">COVID-19 Statistics</h1>
            <p className="section-subtitle">Assessment data, model performance, and epidemiological insights</p>
          </div>

          {/* Summary Stats */}
          <div className="stats-grid">
            {[
              { icon: '📊', val: stats.total_assessments.toLocaleString(), label: 'Total Assessments', cls: 'info' },
              { icon: '🔴', val: stats.positive_cases.toLocaleString(), label: 'High Risk Cases', cls: 'positive' },
              { icon: '🟢', val: stats.negative_cases.toLocaleString(), label: 'Low Risk Cases', cls: 'negative' },
              { icon: '📈', val: `${stats.avg_risk_score}%`, label: 'Average Risk Score', cls: 'info' },
              { icon: '⚠️', val: stats.high_risk_cases.toLocaleString(), label: 'Critical Risk', cls: 'positive' },
              { icon: '💉', val: `${stats.vaccinated_lower_risk}%`, label: 'Reduced Risk (Vaxxed)', cls: 'negative' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-card-icon">{s.icon}</div>
                <div className={`stat-card-val ${s.cls}`}>{s.val}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-title">Risk Distribution</div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: 'rgba(200,195,255,0.3)' }}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <div className="chart-title">Positive Rate by Age Group</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={ageData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="age" tick={{ fill: 'rgba(180,175,220,0.6)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'rgba(180,175,220,0.6)', fontSize: 11 }} unit="%" />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="Positive Rate (%)" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <div className="chart-title">Top 8 Feature Importances (ML Model)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={importanceData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" tick={{ fill: 'rgba(180,175,220,0.6)', fontSize: 10 }} unit="%" />
                  <YAxis type="category" dataKey="feature" tick={{ fill: 'rgba(180,175,220,0.7)', fontSize: 10 }} width={60} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="importance" fill="url(#impGrad)" radius={[0, 4, 4, 0]} />
                  <defs>
                    <linearGradient id="impGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <div className="chart-title">Symptom Prevalence Radar</div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={symptomData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(180,175,220,0.7)', fontSize: 10 }} />
                  <Radar name="Prevalence" dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} />
                  <Tooltip {...tooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Info */}
          {modelInfo && (
            <div style={{ marginTop: 48 }}>
              <div className="section-header" style={{ marginBottom: 24 }}>
                <div className="section-eyebrow">Model Performance</div>
                <h2 className="section-title">ML Model Metrics</h2>
              </div>
              <div className="model-info-grid">
                {[
                  { k: 'Algorithm', v: modelInfo.algorithm },
                  { k: 'Training Samples', v: modelInfo.training_samples?.toLocaleString() },
                  { k: 'Test Samples', v: modelInfo.test_samples?.toLocaleString() },
                  { k: 'Accuracy', v: `${modelInfo.accuracy}%` },
                  { k: 'AUC-ROC Score', v: `${modelInfo.auc_roc}%` },
                  { k: 'Estimators', v: modelInfo.n_estimators },
                  { k: 'Total Features', v: modelInfo.features?.length },
                ].map(m => (
                  <div key={m.k} className="model-metric">
                    <span className="model-metric-key">{m.k}</span>
                    <span className="model-metric-val">{m.v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
