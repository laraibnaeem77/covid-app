"""
train_model.py — COVID-19 Random Forest Model Trainer
Run this script to (re)train the model on the provided dataset.

Usage:
    python train_model.py
    python train_model.py --data /path/to/your_dataset.csv
"""

import argparse
import json
import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    classification_report, accuracy_score,
    roc_auc_score, confusion_matrix
)
import joblib

# ─── Config ────────────────────────────────────────────────────────────────────
DEFAULT_DATA = "../../covid_symptoms_severity_prediction.csv"
OUTPUT_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(OUTPUT_DIR, "covid_model.pkl")
META_PATH = os.path.join(OUTPUT_DIR, "model_metadata.json")

RF_PARAMS = dict(
    n_estimators=200,
    max_depth=10,
    min_samples_split=5,
    min_samples_leaf=2,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1,
)
# ───────────────────────────────────────────────────────────────────────────────


def load_and_prepare(csv_path: str):
    print(f"📂 Loading data from: {csv_path}")
    df = pd.read_csv(csv_path)
    print(f"   Shape: {df.shape}")
    print(f"   Columns: {list(df.columns)}\n")

    # Encode categorical columns
    le_vax = LabelEncoder()
    le_gender = LabelEncoder()

    df["vaccination_encoded"] = le_vax.fit_transform(df["vaccination_status"])
    df["gender_encoded"] = le_gender.fit_transform(df["gender"])

    print("Vaccination classes (encoded 0→N):", list(le_vax.classes_))
    print("Gender classes (encoded 0→N)     :", list(le_gender.classes_), "\n")

    feature_cols = [
        "age", "gender_encoded", "vaccination_encoded",
        "fever", "cough", "fatigue", "shortness_of_breath",
        "loss_of_smell", "headache",
        "diabetes", "hypertension", "heart_disease", "asthma", "cancer",
    ]

    # Target: hospitalization as severity proxy
    target_col = "hospitalized"
    if target_col not in df.columns:
        raise ValueError(f"Expected column '{target_col}' not found. "
                         f"Available: {list(df.columns)}")

    X = df[feature_cols]
    y = df[target_col]

    print(f"Target distribution:\n{y.value_counts()}\n")
    return X, y, feature_cols, le_vax


def train(X, y, feature_cols, le_vax):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"Train size: {len(X_train)} | Test size: {len(X_test)}\n")
    print("🌲 Training Random Forest …")

    rf = RandomForestClassifier(**RF_PARAMS)
    rf.fit(X_train, y_train)

    # ── Evaluation ──────────────────────────────────────────────────────────
    y_pred = rf.predict(X_test)
    y_proba = rf.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_proba)

    print("\n═══════════════════════════════════════")
    print("         MODEL EVALUATION RESULTS")
    print("═══════════════════════════════════════")
    print(f"  Accuracy  : {acc*100:.2f}%")
    print(f"  AUC-ROC   : {auc*100:.2f}%")
    print("───────────────────────────────────────")
    print(classification_report(y_test, y_pred,
          target_names=["Low Risk", "High Risk"]))

    cm = confusion_matrix(y_test, y_pred)
    print(f"Confusion Matrix:\n{cm}\n")

    # ── Cross-validation ────────────────────────────────────────────────────
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(rf, X, y, cv=cv, scoring="roc_auc")
    print(
        f"5-Fold CV AUC: {cv_scores.mean()*100:.2f}% ± {cv_scores.std()*100:.2f}%\n")

    # ── Feature Importance ──────────────────────────────────────────────────
    fi = dict(zip(feature_cols, rf.feature_importances_.tolist()))
    fi_sorted = dict(sorted(fi.items(), key=lambda x: x[1], reverse=True))
    print("Feature Importances (top → bottom):")
    for feat, imp in fi_sorted.items():
        bar = "█" * int(imp * 100)
        print(f"  {feat:<28} {imp:.3f}  {bar}")

    # ── Save ────────────────────────────────────────────────────────────────
    joblib.dump(rf, MODEL_PATH)
    print(f"\n✅ Model saved → {MODEL_PATH}")

    metadata = {
        "algorithm": "Random Forest Classifier",
        "n_estimators": RF_PARAMS["n_estimators"],
        "max_depth": RF_PARAMS["max_depth"],
        "training_samples": len(X_train),
        "test_samples": len(X_test),
        "accuracy": round(acc, 6),
        "auc": round(auc, 6),
        "cv_auc_mean": round(float(cv_scores.mean()), 6),
        "cv_auc_std": round(float(cv_scores.std()), 6),
        "feature_cols": feature_cols,
        "vaccination_classes": list(le_vax.classes_),
        "feature_importance": fi,
    }

    with open(META_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"✅ Metadata saved → {META_PATH}\n")

    return rf, metadata


def main():
    parser = argparse.ArgumentParser(description="Train COVID-19 Risk Model")
    parser.add_argument("--data", default=DEFAULT_DATA,
                        help="Path to CSV dataset")
    args = parser.parse_args()

    if not os.path.exists(args.data):
        print(f"❌ Dataset not found: {args.data}")
        print(
            "   Pass the correct path via: python train_model.py --data /path/to/data.csv")
        return

    X, y, feature_cols, le_vax = load_and_prepare(args.data)
    rf, meta = train(X, y, feature_cols, le_vax)

    print("🎉 Training complete!")
    print(f"   Accuracy: {meta['accuracy']*100:.2f}%")
    print(f"   AUC-ROC : {meta['auc']*100:.2f}%")
    print("\nYou can now start the FastAPI server:")
    print("   uvicorn main:app --reload --port 8000")


if __name__ == "__main__":
    main()
