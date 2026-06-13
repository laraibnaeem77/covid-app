import json
import os
from datetime import datetime
from typing import Dict, List
import pandas as pd

ASSESSMENTS_FILE = "assessments.json"
ASSESSMENTS_CSV = "assessments.csv"

def save_assessment(assessment_data: Dict) -> bool:
    """Save a single assessment to JSON file"""
    try:
        # Add timestamp
        assessment_data["timestamp"] = datetime.now().isoformat()
        assessment_data["assessment_id"] = datetime.now().strftime("%Y%m%d%H%M%S%f")
        
        # Load existing data
        existing_data = []
        if os.path.exists(ASSESSMENTS_FILE):
            with open(ASSESSMENTS_FILE, 'r') as f:
                existing_data = json.load(f)
        
        # Append new assessment
        existing_data.append(assessment_data)
        
        # Save back to file
        with open(ASSESSMENTS_FILE, 'w') as f:
            json.dump(existing_data, f, indent=2)
        
        # Also save to CSV for Excel analysis
        try:
            save_to_csv(assessment_data)
        except:
            pass  # CSV save is optional
        
        return True
    except Exception as e:
        print(f"Error saving assessment: {e}")
        return False

def save_to_csv(assessment_data: Dict):
    """Append assessment to CSV file"""
    try:
        df_new = pd.DataFrame([assessment_data])
        
        if os.path.exists(ASSESSMENTS_CSV):
            df_existing = pd.read_csv(ASSESSMENTS_CSV)
            df_combined = pd.concat([df_existing, df_new], ignore_index=True)
        else:
            df_combined = df_new
        
        df_combined.to_csv(ASSESSMENTS_CSV, index=False)
    except Exception as e:
        print(f"Error saving to CSV: {e}")

def get_all_assessments(limit: int = 100) -> List[Dict]:
    """Retrieve all saved assessments"""
    try:
        if os.path.exists(ASSESSMENTS_FILE):
            with open(ASSESSMENTS_FILE, 'r') as f:
                data = json.load(f)
                return data[-limit:]  # Return last 'limit' assessments
    except Exception as e:
        print(f"Error loading assessments: {e}")
    return []

def get_assessment_stats() -> Dict:
    """Get statistics from saved assessments"""
    assessments = get_all_assessments(limit=10000)
    
    if not assessments:
        return {"error": "No assessments found", "total_saved": 0}
    
    try:
        df = pd.DataFrame(assessments)
        
        stats = {
            "total_saved": len(assessments),
            "avg_risk_score": float(df['risk_score'].mean()) if 'risk_score' in df else 0,
            "positive_rate": float(df['positive'].mean() * 100) if 'positive' in df else 0,
        }
        
        if 'risk_level' in df:
            stats["risk_levels"] = df['risk_level'].value_counts().to_dict()
        
        if 'timestamp' in df:
            stats["date_range"] = {
                "first": df['timestamp'].min(),
                "last": df['timestamp'].max()
            }
        
        return stats
    except Exception as e:
        return {"error": str(e), "total_saved": len(assessments)}
