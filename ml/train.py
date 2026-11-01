"""
Full-Stack Heart Disease Prediction - Logistic Regression Training Pipeline
Dataset: Cleveland Heart Disease (UCI Machine Learning Repository)
Objective: Train and export a high-performance Logistic Regression model for clinical risk assessment.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

def main():
    print("=" * 65)
    print(" HEART DISEASE RISK PREDICTION - LOGISTIC REGRESSION TRAINING")
    print("=" * 65)

    columns = [
        'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
        'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target'
    ]

    # Check for raw dataset or existing heart.csv
    raw_path = 'heart.csv'
    dataset_dest = os.path.join('dataset', 'heart.csv')

    if os.path.exists(raw_path):
        df = pd.read_csv(raw_path, names=columns, na_values='?')
    elif os.path.exists(dataset_dest):
        df = pd.read_csv(dataset_dest)
    else:
        raise FileNotFoundError("heart.csv not found in root or dataset/")

    print(f"[+] Loaded raw dataset: {df.shape[0]} records, {df.shape[1]} columns")

    # Step 1: Preprocessing & Missing Value Imputation
    print("\n--- [Step 1: Data Preprocessing & Cleaning] ---")
    print(f"Missing values before imputation:\n{df.isnull().sum()[df.isnull().sum() > 0]}")

    df['ca'] = df['ca'].fillna(df['ca'].mode()[0])
    df['thal'] = df['thal'].fillna(df['thal'].mode()[0])
    print("[+] Missing values successfully imputed with modal frequencies.")

    # Step 2: Binarize Target Variable
    # 0 = Low Risk (Absence of Heart Disease)
    # 1, 2, 3, 4 = High Risk (Presence of Heart Disease)
    df['target'] = (df['target'] > 0).astype(int)
    print(f"[+] Target binarization complete:")
    print(f"    - Low Risk (0) : {sum(df['target'] == 0)} patients ({sum(df['target'] == 0)/len(df)*100:.1f}%)")
    print(f"    - High Risk (1): {sum(df['target'] == 1)} patients ({sum(df['target'] == 1)/len(df)*100:.1f}%)")

    # Save cleaned, standardized dataset to dataset/heart.csv
    os.makedirs('dataset', exist_ok=True)
    df.to_csv(dataset_dest, index=False)
    print(f"[+] Saved clean dataset with headers to '{dataset_dest}'")

    # Step 3: Feature & Target Split
    feature_names = [c for c in columns if c != 'target']
    X = df[feature_names]
    y = df['target']

    # Step 4: Train / Test Split (80% Train, 20% Test, Stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"\n--- [Step 2: Train/Test Split] ---")
    print(f"Train samples: {X_train.shape[0]} | Test samples: {X_test.shape[0]}")

    # Step 5: Feature Standardization (Z-score scaling)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    print("[+] StandardScaler fitted on training set.")

    # Step 6: Train Logistic Regression Model
    print("\n--- [Step 3: Training Logistic Regression] ---")
    model = LogisticRegression(
        penalty='l2',
        C=1.0,
        solver='lbfgs',
        max_iter=1000,
        random_state=42
    )
    model.fit(X_train_scaled, y_train)
    print("[+] Model fitted successfully.")

    # Step 7: Model Evaluation
    print("\n--- [Step 4: Model Evaluation Metrics] ---")
    y_pred = model.predict(X_test_scaled)
    y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_pred_proba)
    cm = confusion_matrix(y_test, y_pred)

    print(f"Accuracy : {acc * 100:.2f}%")
    print(f"ROC-AUC  : {auc:.4f}")
    print(f"Precision: {prec * 100:.2f}%")
    print(f"Recall   : {rec * 100:.2f}%")
    print(f"F1-Score : {f1:.4f}")
    print("\nConfusion Matrix:")
    print(f"  TN={cm[0,0]} | FP={cm[0,1]}")
    print(f"  FN={cm[1,0]} | TP={cm[1,1]}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Low Risk', 'High Risk']))

    # Step 8: Save Model Artifacts
    os.makedirs('ml', exist_ok=True)
    model_bundle = {
        'model': model,
        'scaler': scaler,
        'features': feature_names
    }
    joblib.dump(model_bundle, os.path.join('ml', 'heart_disease_model.pkl'))
    print(f"[+] Saved model bundle to 'ml/heart_disease_model.pkl'")

    # Export parameter metadata for Next.js web application
    coef = model.coef_[0].tolist()
    intercept = float(model.intercept_[0])
    mean = scaler.mean_.tolist()
    scale = scaler.scale_.tolist()

    feature_impact = []
    for f, c in zip(feature_names, coef):
        feature_impact.append({
            'feature': f,
            'coefficient': round(c, 4),
            'risk_direction': 'Positive (Increases Risk)' if c > 0 else 'Negative (Protective)'
        })
    feature_impact.sort(key=lambda x: abs(x['coefficient']), reverse=True)

    export_data = {
        'model_name': 'Logistic Regression Classifier',
        'algorithm': 'Logistic Regression (L-BFGS, L2 penalty)',
        'features': feature_names,
        'scaler': {
            'mean': mean,
            'scale': scale
        },
        'model': {
            'coefficients': coef,
            'intercept': intercept
        },
        'metrics': {
            'accuracy': round(acc * 100, 2),
            'roc_auc': round(auc, 4),
            'precision': round(prec * 100, 2),
            'recall': round(rec * 100, 2),
            'f1_score': round(f1, 4)
        },
        'feature_importance': feature_impact
    }

    params_path = os.path.join('ml', 'model_params.json')
    with open(params_path, 'w') as f:
        json.dump(export_data, f, indent=2)
    print(f"[+] Exported model parameters to '{params_path}'")

    # Also prepare for Next.js src/lib directory if it exists
    lib_dir = os.path.join('src', 'lib')
    os.makedirs(lib_dir, exist_ok=True)
    with open(os.path.join(lib_dir, 'model_params.json'), 'w') as f:
        json.dump(export_data, f, indent=2)
    print(f"[+] Synchronized model parameters with 'src/lib/model_params.json'")

    print("\n" + "=" * 65)
    print(" TRAINING COMPLETE: Ready for Next.js full-stack integration!")
    print("=" * 65)

if __name__ == '__main__':
    main()
