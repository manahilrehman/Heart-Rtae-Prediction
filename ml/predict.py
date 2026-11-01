"""
Heart Disease Risk Predictor - CLI Inference Script
Uses the trained scikit-learn Logistic Regression model.
"""

import sys
import os
import joblib
import numpy as np

def predict_patient(features_dict):
    model_path = os.path.join(os.path.dirname(__file__), 'heart_disease_model.pkl')
    if not os.path.exists(model_path):
        raise FileNotFoundError("Trained model not found. Run 'python ml/train.py' first.")

    bundle = joblib.load(model_path)
    model = bundle['model']
    scaler = bundle['scaler']
    feature_names = bundle['features']

    # Vectorize input in exact training order
    raw_vector = np.array([[float(features_dict.get(feat, 0)) for feat in feature_names]])
    scaled_vector = scaler.transform(raw_vector)

    prediction = model.predict(scaled_vector)[0]
    probabilities = model.predict_proba(scaled_vector)[0]
    risk_prob = probabilities[1] * 100

    result = "High Risk" if prediction == 1 else "Low Risk"
    return {
        'prediction': result,
        'risk_score': round(risk_prob, 2),
        'confidence': round(max(probabilities) * 100, 2)
    }

if __name__ == '__main__':
    # Sample Test Patient (High Risk)
    sample_patient = {
        'age': 63,
        'sex': 1,
        'cp': 4,
        'trestbps': 160,
        'chol': 286,
        'fbs': 0,
        'restecg': 2,
        'thalach': 108,
        'exang': 1,
        'oldpeak': 1.5,
        'slope': 2,
        'ca': 3,
        'thal': 7
    }

    print("Running Sample Patient Prediction:")
    res = predict_patient(sample_patient)
    print(f"Result    : {res['prediction']}")
    print(f"Risk Score: {res['risk_score']}%")

