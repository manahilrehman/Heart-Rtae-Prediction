"""
Comprehensive Model Evaluation & Metrics Report
Evaluates the trained Logistic Regression model on the Cleveland Heart Disease test set.
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

def evaluate():
    model_path = os.path.join(os.path.dirname(__file__), 'heart_disease_model.pkl')
    dataset_path = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'heart.csv')

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file '{model_path}' not found. Run 'train.py' first.")

    bundle = joblib.load(model_path)
    model = bundle['model']
    scaler = bundle['scaler']
    features = bundle['features']

    df = pd.read_csv(dataset_path)
    X = df[features]
    y = df['target']

    # Standardize
    X_scaled = scaler.transform(X)

    y_pred = model.predict(X_scaled)
    y_proba = model.predict_proba(X_scaled)[:, 1]

    acc = accuracy_score(y, y_pred)
    prec = precision_score(y, y_pred)
    rec = recall_score(y, y_pred)
    f1 = f1_score(y, y_pred)
    auc = roc_auc_score(y, y_proba)
    cm = confusion_matrix(y, y_pred)

    print("=" * 60)
    print(" CARDIOPREDICT AI - LOGISTIC REGRESSION EVALUATION REPORT")
    print("=" * 60)
    print(f"Total Cohort Evaluated: {len(df)} patients")
    print(f"Overall Accuracy      : {acc * 100:.2f}%")
    print(f"ROC-AUC Score         : {auc:.4f}")
    print(f"Precision             : {prec * 100:.2f}%")
    print(f"Recall (Sensitivity)  : {rec * 100:.2f}%")
    print(f"F1-Score              : {f1:.4f}")
    print("-" * 60)
    print("Confusion Matrix:")
    print(f"  True Negatives (Low Risk Correct)  : {cm[0,0]}")
    print(f"  False Positives (False Alarm)      : {cm[0,1]}")
    print(f"  False Negatives (Missed High Risk) : {cm[1,0]}")
    print(f"  True Positives (High Risk Correct) : {cm[1,1]}")
    print("-" * 60)
    print("Detailed Classification Breakdown:")
    print(classification_report(y, y_pred, target_names=['Low Risk', 'High Risk']))
    print("=" * 60)

if __name__ == '__main__':
    evaluate()

