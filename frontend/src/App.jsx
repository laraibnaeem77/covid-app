import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import SymptomGuide from './pages/SymptomGuide';
import Statistics from './pages/Statistics';
import './App.css';          // ← ADD THIS LINE - Import App.css here

function NavBar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/assessment', label: 'Assessment' },
    { path: '/symptom-guide', label: 'Symptom Guide' },
    { path: '/statistics', label: 'Statistics' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">🦠</span>
          <span className="brand-text">CoviScan <span className="brand-ai">AI</span></span>
        </Link>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/assessment" className="nav-cta" onClick={() => setMenuOpen(false)}>
            Start Assessment
          </Link>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/symptom-guide" element={<SymptomGuide />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand">
              <span>🦠</span> CoviScan AI
            </div>
            <p className="footer-disclaimer">
              ⚕️ For informational purposes only. Not a substitute for professional medical advice.
              Always consult a qualified healthcare provider for diagnosis and treatment.
            </p>
            <p className="footer-copy">© 2025 CoviScan AI · Powered by Random Forest ML · 92.8% Accuracy</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
