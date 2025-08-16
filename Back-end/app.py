import os
import json
import pandas as pd
import joblib
from fastapi import FastAPI
from pydantic import BaseModel

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, 'ai-model', 'final_churn_model.pkl')
model = joblib.load(model_path)

features_path = os.path.join(BASE_DIR, 'ai-model', 'model_features.json')
with open(features_path, 'r') as f:
    feature_names = json.load(f)

app = FastAPI()

class InputData(BaseModel):
    tenure: int
    MonthlyCharges: float
    TotalCharges: float
    InternetService: str
    OnlineSecurity: str
    OnlineBackup: str
    TechSupport: str
    Contract: str
    PaymentMethod: str

@app.post("/predict")
def predict(data: InputData):
    input_dict = data.dict()

    raw_df = pd.DataFrame([input_dict])

    df_encoded = pd.get_dummies(raw_df)

    for col in feature_names:
        if col not in df_encoded.columns:
            df_encoded[col] = 0

    df_encoded = df_encoded[feature_names]

    prob = model.predict_proba(df_encoded)[0][1]
    threshold = 0.355
    prediction = int(prob > threshold)

    return {
        "prediction": prediction,
        "probability": round(float(prob), 4),
        "threshold": threshold
    }
