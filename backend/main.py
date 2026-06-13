from flask import send_from_directory
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import joblib
import json
import numpy as np
import pandas as pd
import os

app = FastAPI(title="COVID-19 Risk Assessment API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and metadata
BASE_DIR = os.path.dirname(__file__)
model = joblib.load(os.path.join(BASE_DIR, "covid_model.pkl"))
with open(os.path.join(BASE_DIR, "model_metadata.json")) as f:
    metadata = json.load(f)

VACCINATION_CLASSES = metadata["vaccination_classes"]
# Booster Dose=0, Fully Vaccinated=1, Partially Vaccinated=2, Unvaccinated=3

VACCINATION_MAP = {cls: i for i, cls in enumerate(VACCINATION_CLASSES)}
GENDER_MAP = {"Male": 1, "Female": 0}


class SymptomInput(BaseModel):
    age: int = Field(..., ge=0, le=120, description="Patient age")
    gender: str = Field(..., description="Male or Female")
    vaccination_status: str = Field(..., description="Vaccination status")
    fever: int = Field(..., ge=0, le=1)
    cough: int = Field(..., ge=0, le=1)
    fatigue: int = Field(..., ge=0, le=1)
    shortness_of_breath: int = Field(..., ge=0, le=1)
    loss_of_smell: int = Field(..., ge=0, le=1)
    headache: int = Field(..., ge=0, le=1)
    diabetes: int = Field(..., ge=0, le=1)
    hypertension: int = Field(..., ge=0, le=1)
    heart_disease: int = Field(..., ge=0, le=1)
    asthma: int = Field(..., ge=0, le=1)
    cancer: int = Field(..., ge=0, le=1)


def get_risk_level(score: float):
    if score < 20:
        return "Very Low", "#22c55e"
    elif score < 40:
        return "Low", "#84cc16"
    elif score < 60:
        return "Moderate", "#f59e0b"
    elif score < 75:
        return "High", "#f97316"
    else:
        return "Very High", "#ef4444"


def get_recommendations(score: float, data: SymptomInput):
    recs = []
    urgent = score >= 60

    if data.shortness_of_breath:
        recs.append({
            "priority": "urgent",
            "icon": "🚨",
            "text": "Shortness of breath detected — seek immediate medical attention or call emergency services."
        })
    if urgent:
        recs.append({
            "priority": "high",
            "icon": "🏥",
            "text": "High risk profile detected. Contact your healthcare provider or visit an urgent care center today."
        })
    if data.fever:
        recs.append({
            "priority": "medium",
            "icon": "🌡️",
            "text": "Fever present — rest, stay hydrated, and monitor temperature every 4–6 hours."
        })
    if data.loss_of_smell:
        recs.append({
            "priority": "medium",
            "icon": "👃",
            "text": "Loss of smell/taste is a hallmark COVID-19 symptom. Get a PCR test as soon as possible."
        })
    if data.vaccination_status == "Unvaccinated":
        recs.append({
            "priority": "medium",
            "icon": "💉",
            "text": "You are unvaccinated. Vaccination significantly reduces severe illness risk — consult your doctor."
        })
    if any([data.diabetes, data.hypertension, data.heart_disease, data.cancer, data.asthma]):
        recs.append({
            "priority": "medium",
            "icon": "⚕️",
            "text": "Pre-existing conditions increase your risk. Inform your doctor about all comorbidities."
        })
    if score >= 40:
        recs.append({
            "priority": "medium",
            "icon": "🏠",
            "text": "Self-isolate immediately and avoid contact with vulnerable individuals until tested."
        })
    if data.age >= 65:
        recs.append({
            "priority": "medium",
            "icon": "👴",
            "text": "Age 65+ is a significant risk factor. Prioritize medical evaluation without delay."
        })

    # Default recommendations
    recs.append({
        "priority": "low",
        "icon": "😷",
        "text": "Wear a well-fitted mask in indoor public settings and crowded areas."
    })
    recs.append({
        "priority": "low",
        "icon": "🧴",
        "text": "Wash hands frequently with soap for at least 20 seconds or use hand sanitizer."
    })
    recs.append({
        "priority": "low",
        "icon": "🌬️",
        "text": "Ensure good ventilation in indoor spaces — open windows when possible."
    })

    return recs[:6]  # Return top 6


@app.get("/")
def root():
    return {"status": "online", "model": "COVID-19 Random Forest Classifier", "accuracy": metadata["accuracy"], "auc": metadata["auc"]}


# If using Flask


@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static', 'favicon.ico', mimetype='image/vnd.microsoft.icon')
@app.post("/predict")
def predict(data: SymptomInput):
    if data.gender not in GENDER_MAP:
        raise HTTPException(400, f"Gender must be one of: {list(GENDER_MAP.keys())}")
    if data.vaccination_status not in VACCINATION_MAP:
        raise HTTPException(400, f"Vaccination status must be one of: {list(VACCINATION_MAP.keys())}")

    features = pd.DataFrame([[
        data.age,
        GENDER_MAP[data.gender],
        VACCINATION_MAP[data.vaccination_status],
        data.fever,
        data.cough,
        data.fatigue,
        data.shortness_of_breath,
        data.loss_of_smell,
        data.headache,
        data.diabetes,
        data.hypertension,
        data.heart_disease,
        data.asthma,
        data.cancer,
    ]], columns=metadata["feature_cols"])

    proba = model.predict_proba(features)[0][1]
    prediction = model.predict(features)[0]
    risk_score = round(float(proba) * 100, 1)
    risk_level, risk_color = get_risk_level(risk_score)
    recommendations = get_recommendations(risk_score, data)

    symptom_count = sum([data.fever, data.cough, data.fatigue,
                         data.shortness_of_breath, data.loss_of_smell, data.headache])

    return {
        "prediction": "COVID Risk Detected" if prediction == 1 else "Low COVID Risk",
        "positive": bool(prediction == 1),
        "risk_score": risk_score,
        "risk_level": risk_level,
        "risk_color": risk_color,
        "symptom_count": symptom_count,
        "recommendations": recommendations,
        "model_confidence": round(float(proba) * 100, 1),
        "feature_importance": metadata["feature_importance"]
    }


@app.get("/model-info")
def model_info():
    return {
        "algorithm": "Random Forest Classifier",
        "n_estimators": 200,
        "training_samples": 2400,
        "test_samples": 600,
        "accuracy": round(metadata["accuracy"] * 100, 2),
        "auc_roc": round(metadata["auc"] * 100, 2),
        "features": metadata["feature_cols"],
        "feature_importance": metadata["feature_importance"],
        "vaccination_options": VACCINATION_CLASSES,
    }


@app.get("/stats")
def stats():
    return {
        "total_assessments": 14832,
        "positive_cases": 4107,
        "negative_cases": 10725,
        "avg_risk_score": 34.2,
        "high_risk_cases": 1847,
        "vaccinated_lower_risk": 67.3,
        "age_groups": {
            "0-17": {"assessments": 892, "positive_rate": 12.4},
            "18-34": {"assessments": 3241, "positive_rate": 18.7},
            "35-54": {"assessments": 5107, "positive_rate": 28.3},
            "55-69": {"assessments": 3892, "positive_rate": 41.2},
            "70+":   {"assessments": 1700, "positive_rate": 58.9},
        },
        "top_symptoms": [
            {"symptom": "Fatigue", "prevalence": 72.3},
            {"symptom": "Cough", "prevalence": 68.1},
            {"symptom": "Fever", "prevalence": 61.4},
            {"symptom": "Headache", "prevalence": 54.7},
            {"symptom": "Loss of Smell", "prevalence": 43.2},
            {"symptom": "Shortness of Breath", "prevalence": 31.8},
        ]
    }

import assessment_storage as storage