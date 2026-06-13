import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';          // ← ADD THIS LINE - Import App.css here


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
