# CoviScan AI — COVID-19 Risk Assessment System
> Random Forest ML · 92.8% Accuracy · 0.98 AUC-ROC · FastAPI + React

---

## Project Structure

```
covid-app/
├── backend/
│   ├── main.py                  # FastAPI application
│   ├── requirements.txt         # Python dependencies
│   ├── covid_model.pkl          # Trained Random Forest model
│   └── model_metadata.json      # Model metrics & feature info
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.jsx              # Main app + navbar + routing
    │   ├── App.css              # Full design system (purple/blue gradient)
    │   ├── index.js
    │   └── pages/
    │       ├── Home.jsx         # Landing page
    │       ├── Assessment.jsx   # Symptom form + results
    │       ├── SymptomGuide.jsx # Reference guide
    │       └── Statistics.jsx   # Charts & model metrics
    └── package.json
```

---

## Quick Start

### Step 1 — Install Backend Dependencies

```bash
cd covid-app/backend
pip install fastapi uvicorn scikit-learn pandas numpy joblib pydantic python-multipart
```

### Step 2 — Start the FastAPI Backend

```bash
cd covid-app/backend
uvicorn main:app --reload --port 8000
```

API will be live at: http://localhost:8000
Interactive docs at: http://localhost:8000/docs

### Step 3 — Install & Start the React Frontend

```bash
cd covid-app/frontend
npm install
npm start
```

Frontend will open at: http://localhost:3000

---

## API Endpoints

| Method | Endpoint       | Description                          |
|--------|----------------|--------------------------------------|
| GET    | `/`            | Health check + model info            |
| POST   | `/predict`     | Submit symptoms, get risk prediction |
| GET    | `/model-info`  | Model metrics & feature importances  |
| GET    | `/stats`       | Epidemiological statistics           |
| GET    | `/docs`        | Interactive Swagger UI               |

### POST /predict — Example Request

```json
{
  "age": 55,
  "gender": "Male",
  "vaccination_status": "Fully Vaccinated",
  "fever": 1,
  "cough": 1,
  "fatigue": 1,
  "shortness_of_breath": 0,
  "loss_of_smell": 1,
  "headache": 0,
  "diabetes": 1,
  "hypertension": 0,
  "heart_disease": 0,
  "asthma": 0,
  "cancer": 0
}
```

### POST /predict — Example Response

```json
{
  "prediction": "COVID Risk Detected",
  "positive": true,
  "risk_score": 74.3,
  "risk_level": "High",
  "risk_color": "#f97316",
  "symptom_count": 4,
  "model_confidence": 74.3,
  "recommendations": [
    {
      "priority": "high",
      "icon": "🏥",
      "text": "High risk profile detected. Contact your healthcare provider today."
    },
    ...
  ]
}
```

---

## Model Details

| Property             | Value                                |
|----------------------|--------------------------------------|
| Algorithm            | Random Forest Classifier             |
| Training samples     | 2,400                                |
| Test samples         | 600                                  |
| Accuracy             | 92.83%                               |
| AUC-ROC              | 98.24%                               |
| Trees (estimators)   | 200                                  |
| Max depth            | 10                                   |
| Class weighting      | Balanced                             |

### Top Feature Importances

| Feature              | Importance |
|----------------------|------------|
| Vaccination Status   | 20.9%      |
| Age                  | 19.0%      |
| Shortness of Breath  | 6.8%       |
| Cough                | 6.7%       |
| Loss of Smell        | 6.5%       |
| Headache             | 6.0%       |
| Fatigue              | 5.6%       |
| Fever                | 5.4%       |

---

## Features

- **4-page React app**: Home, Assessment, Symptom Guide, Statistics
- **Purple/blue gradient design** with animated noise texture
- **Interactive symptom toggles** with instant visual feedback
- **Risk gauge** with 5-level color-coded scoring
- **Personalized recommendations** sorted by urgency
- **Recharts dashboards**: pie, bar, radar, horizontal bar
- **Responsive** — works on mobile and desktop
- **FastAPI backend** with Pydantic validation and CORS

---

## Risk Scale

| Score    | Level     | Color     |
|----------|-----------|-----------|
| 0–19%    | Very Low  | 🟢 Green  |
| 20–39%   | Low       | 🟡 Lime   |
| 40–59%   | Moderate  | 🟠 Amber  |
| 60–74%   | High      | 🔶 Orange |
| 75–100%  | Very High | 🔴 Red    |

---

## Vaccination Status Options

- `Unvaccinated`
- `Partially Vaccinated`
- `Fully Vaccinated`
- `Booster Dose`

---

## Medical Disclaimer

This tool is for **informational purposes only** and does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical decisions.
echo "" >> README.md
Due to file size limitations, the CSV data files are not included in this repository.

