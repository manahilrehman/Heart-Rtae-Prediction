import os
import joblib
import numpy as np
import pandas as pd
import streamlit as st
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, roc_auc_score, confusion_matrix, classification_report

# ---------------------------------------------------------
# Page Configuration
# ---------------------------------------------------------
st.set_page_config(
    page_title="CardioPredict AI - Heart Disease Prediction",
    page_icon="🫀",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .main-title {
        font-size: 2.2rem;
        font-weight: 800;
        color: #0f766e;
        margin-bottom: 0.2rem;
    }
    .sub-title {
        font-size: 1rem;
        color: #64748b;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 16px;
        text-align: center;
    }
    .high-risk-box {
        background-color: #fef2f2;
        border: 2px solid #ef4444;
        border-radius: 14px;
        padding: 24px;
        color: #991b1b;
        margin-top: 15px;
    }
    .low-risk-box {
        background-color: #f0fdf4;
        border: 2px solid #22c55e;
        border-radius: 14px;
        padding: 24px;
        color: #166534;
        margin-top: 15px;
    }
    .stButton>button {
        background: linear-gradient(90deg, #0d9488 0%, #0891b2 100%);
        color: white;
        font-weight: 700;
        border: none;
        border-radius: 10px;
        padding: 12px 24px;
        font-size: 16px;
        width: 100%;
        transition: all 0.3s;
    }
    .stButton>button:hover {
        background: linear-gradient(90deg, #0f766e 0%, #0e7490 100%);
        color: white;
        box-shadow: 0 4px 14px rgba(13, 148, 136, 0.35);
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Load Dataset & Train / Load Model
# ---------------------------------------------------------
@st.cache_resource
def load_or_train_model():
    dataset_path = os.path.join(os.path.dirname(__file__), 'dataset', 'heart.csv')
    if not os.path.exists(dataset_path):
        # Fallback to Cleveland raw file or create standard format
        raw_cleveland = 'https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data'
        cols = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target']
        df = pd.read_csv(raw_cleveland, names=cols, na_values='?')
    else:
        df = pd.read_csv(dataset_path)

    # Impute missing values
    df['ca'] = df['ca'].fillna(df['ca'].mode()[0])
    df['thal'] = df['thal'].fillna(df['thal'].mode()[0])

    # Binarize target (0 = Low Risk, 1 = High Risk)
    df['target'] = (df['target'] > 0).astype(int)

    feature_cols = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']
    X = df[feature_cols]
    y = df['target']

    # Stratified Train/Test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train Logistic Regression
    clf = LogisticRegression(solver='lbfgs', max_iter=1000, random_state=42)
    clf.fit(X_train_scaled, y_train)

    # Metrics
    y_pred = clf.predict(X_test_scaled)
    y_prob = clf.predict_proba(X_test_scaled)[:, 1]
    acc = accuracy_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_prob)
    cm = confusion_matrix(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=['Low Risk', 'High Risk'], output_dict=True)

    return {
        'model': clf,
        'scaler': scaler,
        'features': feature_cols,
        'df': df,
        'accuracy': acc,
        'roc_auc': auc,
        'confusion_matrix': cm,
        'report': report,
        'X_test': X_test,
        'y_test': y_test
    }

artifacts = load_or_train_model()
model = artifacts['model']
scaler = artifacts['scaler']
features = artifacts['features']
df = artifacts['df']

# ---------------------------------------------------------
# Sidebar - Presets & Model Overview
# ---------------------------------------------------------
with st.sidebar:
    st.image("https://img.icons8.com/color/96/heart-with-pulse.png", width=64)
    st.markdown("### 🫀 CardioPredict AI")
    st.caption("Logistic Regression Clinical Risk Model")

    st.markdown("---")
    st.markdown("#### ⚡ 1-Click Patient Presets")
    st.write("Click below to test sample patients instantly:")

    col_p1, col_p2 = st.columns(2)
    with col_p1:
        if st.button("🟢 Normal (Low)"):
            st.session_state['age'] = 38
            st.session_state['sex'] = 0
            st.session_state['cp'] = 2
            st.session_state['trestbps'] = 118
            st.session_state['chol'] = 182
            st.session_state['fbs'] = 0
            st.session_state['restecg'] = 0
            st.session_state['thalach'] = 174
            st.session_state['exang'] = 0
            st.session_state['oldpeak'] = 0.0
            st.session_state['slope'] = 1
            st.session_state['ca'] = 0
            st.session_state['thal'] = 3
            st.rerun()

    with col_p2:
        if st.button("🔴 Severe (High)"):
            st.session_state['age'] = 63
            st.session_state['sex'] = 1
            st.session_state['cp'] = 4
            st.session_state['trestbps'] = 160
            st.session_state['chol'] = 286
            st.session_state['fbs'] = 1
            st.session_state['restecg'] = 2
            st.session_state['thalach'] = 108
            st.session_state['exang'] = 1
            st.session_state['oldpeak'] = 2.6
            st.session_state['slope'] = 2
            st.session_state['ca'] = 3
            st.session_state['thal'] = 7
            st.rerun()

    st.markdown("---")
    st.markdown("#### 📈 Model Benchmarks")
    st.metric("Test Accuracy", f"{artifacts['accuracy'] * 100:.2f}%")
    st.metric("ROC-AUC Score", f"{artifacts['roc_auc']:.4f}")
    st.metric("Recall (Sensitivity)", f"{artifacts['report']['High Risk']['recall'] * 100:.1f}%")

    st.markdown("---")
    st.caption("Dataset: UCI Cleveland Heart Disease (303 records)")
    st.caption("Algorithm: Scikit-Learn Logistic Regression (L-BFGS)")

# ---------------------------------------------------------
# Main Page Navigation Tabs
# ---------------------------------------------------------
tab_pred, tab_model, tab_data = st.tabs([
    "🩺 Heart Disease Risk Prediction",
    "📊 Model Performance & Math",
    "📁 Dataset Explorer"
])

# ---------------------------------------------------------
# TAB 1: PREDICTION INTERFACE
# ---------------------------------------------------------
with tab_pred:
    st.markdown('<div class="main-title">Full-Stack Heart Disease Risk Prediction</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-title">Enter patient clinical metrics below to predict coronary heart disease risk using Logistic Regression.</div>', unsafe_allow_html=True)

    with st.form("patient_form"):
        st.markdown("##### 1. Patient Demographics & Baseline Vitals")
        col1, col2, col3, col4 = st.columns(4)

        with col1:
            age = st.number_input(
                "Age (Years)", 
                min_value=20, max_value=100, 
                value=st.session_state.get('age', 54),
                help="Patient chronological age in years."
            )
        with col2:
            sex_choice = st.selectbox(
                "Biological Sex", 
                options=[1, 0], 
                format_func=lambda x: "Male (1)" if x == 1 else "Female (0)",
                index=0 if st.session_state.get('sex', 1) == 1 else 1,
                help="Biological sex of the patient."
            )
        with col3:
            trestbps = st.number_input(
                "Resting Blood Pressure (mmHg)", 
                min_value=80, max_value=220, 
                value=st.session_state.get('trestbps', 130),
                help="Resting blood pressure in mm Hg upon hospital admission."
            )
        with col4:
            chol = st.number_input(
                "Serum Cholesterol (mg/dl)", 
                min_value=100, max_value=600, 
                value=st.session_state.get('chol', 240),
                help="Serum cholesterol in mg/dl. Desirable level is < 200 mg/dl."
            )

        st.markdown("---")
        st.markdown("##### 2. Cardiac Symptoms & Electrocardiography")
        col5, col6, col7, col8 = st.columns(4)

        with col5:
            cp = st.selectbox(
                "Chest Pain Type (cp)", 
                options=[1, 2, 3, 4],
                format_func=lambda x: {
                    1: "1: Typical Angina",
                    2: "2: Atypical Angina",
                    3: "3: Non-Anginal Pain",
                    4: "4: Asymptomatic"
                }[x],
                index=[1, 2, 3, 4].index(st.session_state.get('cp', 1))
            )
        with col6:
            fbs = st.selectbox(
                "Fasting Blood Sugar > 120 mg/dl", 
                options=[0, 1],
                format_func=lambda x: "False <= 120 (0)" if x == 0 else "True > 120 (1)",
                index=st.session_state.get('fbs', 0)
            )
        with col7:
            restecg = st.selectbox(
                "Resting ECG (restecg)", 
                options=[0, 1, 2],
                format_func=lambda x: {
                    0: "0: Normal",
                    1: "1: ST-T Wave Abnormality",
                    2: "2: Left Ventricular Hypertrophy"
                }[x],
                index=st.session_state.get('restecg', 0)
            )
        with col8:
            thalach = st.number_input(
                "Max Heart Rate Achieved (bpm)", 
                min_value=60, max_value=230, 
                value=st.session_state.get('thalach', 150),
                help="Maximum heart rate achieved during exercise stress test."
            )

        st.markdown("---")
        st.markdown("##### 3. Exercise Stress Test & Fluoroscopy")
        col9, col10, col11, col12, col13 = st.columns(5)

        with col9:
            exang = st.selectbox(
                "Exercise Angina (exang)", 
                options=[0, 1],
                format_func=lambda x: "No (0)" if x == 0 else "Yes (1)",
                index=st.session_state.get('exang', 0),
                help="Angina provoked by physical exertion."
            )
        with col10:
            oldpeak = st.number_input(
                "ST Depression (oldpeak)", 
                min_value=0.0, max_value=7.0, step=0.1,
                value=float(st.session_state.get('oldpeak', 1.0)),
                help="ST depression induced by exercise relative to rest."
            )
        with col11:
            slope = st.selectbox(
                "Peak ST Slope (slope)", 
                options=[1, 2, 3],
                format_func=lambda x: {
                    1: "1: Upsloping (Healthy)",
                    2: "2: Flat (Ischemic)",
                    3: "3: Downsloping (Severe)"
                }[x],
                index=[1, 2, 3].index(st.session_state.get('slope', 1))
            )
        with col12:
            ca = st.selectbox(
                "Major Vessels (ca: 0 - 3)", 
                options=[0, 1, 2, 3],
                format_func=lambda x: f"{x} Major Vessels Occluded",
                index=[0, 1, 2, 3].index(int(st.session_state.get('ca', 0)))
            )
        with col13:
            thal = st.selectbox(
                "Thallium Perfusion (thal)", 
                options=[3, 6, 7],
                format_func=lambda x: {
                    3: "3: Normal Perfusion",
                    6: "6: Fixed Defect",
                    7: "7: Reversible Defect"
                }[x],
                index=[3, 6, 7].index(int(st.session_state.get('thal', 3)))
            )

        submit_btn = st.form_submit_button("⚡ Predict Heart Disease Risk")

    # -----------------------------------------------------
    # Prediction Computation & Results Display
    # -----------------------------------------------------
    if submit_btn:
        patient_data = np.array([[
            age, sex_choice, cp, trestbps, chol, fbs,
            restecg, thalach, exang, oldpeak, slope, ca, thal
        ]])

        # Scale features
        patient_scaled = scaler.transform(patient_data)

        # Scikit-learn Logistic Regression prediction
        prediction = model.predict(patient_scaled)[0]
        prob_high_risk = model.predict_proba(patient_scaled)[0][1] * 100
        is_high_risk = prediction == 1

        st.markdown("### 📋 Prediction Diagnostic Result")

        res_col1, res_col2 = st.columns([3, 2])

        with res_col1:
            if is_high_risk:
                st.markdown(f"""
                <div class="high-risk-box">
                    <h2 style="color: #b91c1c; margin: 0; font-size: 2rem;">🚨 Final Result: HIGH RISK</h2>
                    <p style="font-size: 1.1rem; margin-top: 8px;">
                        The Logistic Regression model detected significant coronary artery disease risk.
                    </p>
                    <h3 style="color: #991b1b; margin-top: 12px;">Predicted Risk Probability: <strong>{prob_high_risk:.1f}%</strong></h3>
                </div>
                """, unsafe_allow_html=True)
            else:
                st.markdown(f"""
                <div class="low-risk-box">
                    <h2 style="color: #15803d; margin: 0; font-size: 2rem;">✅ Final Result: LOW RISK</h2>
                    <p style="font-size: 1.1rem; margin-top: 8px;">
                        Patient profile demonstrates low baseline probability of heart disease.
                    </p>
                    <h3 style="color: #166534; margin-top: 12px;">Predicted Risk Probability: <strong>{prob_high_risk:.1f}%</strong></h3>
                </div>
                """, unsafe_allow_html=True)

            st.progress(min(max(int(prob_high_risk), 1), 100))
            st.caption(f"Decision Boundary: >= 50% High Risk | Model Confidence: {max(prob_high_risk, 100 - prob_high_risk):.1f}%")

        with res_col2:
            st.markdown("#### 🩺 Clinical Action Plan")
            if is_high_risk:
                st.warning("⚠️ **Immediate Referral:** Refer patient to a cardiologist for diagnostic Coronary Angiography.")
                if trestbps >= 140:
                    st.write("• **Hypertension Control:** Titrate anti-hypertensive therapy (target BP < 130/80 mmHg).")
                if chol >= 200:
                    st.write("• **Lipid Optimization:** Initiate high-intensity statin regimen.")
                st.write("• **Lifestyle Protocol:** Sodium-restricted diet and monitored cardiac rehabilitation.")
            else:
                st.success("✔️ **Routine Monitoring:** Maintain biennial cardiovascular checkups.")
                st.write("• **Aerobic Exercise:** Aim for 150+ minutes of moderate weekly physical activity.")
                st.write("• **Diet:** Follow Mediterranean or DASH dietary pattern.")

        # Explainable Factors Breakdown
        st.markdown("---")
        st.markdown("#### 🔍 Explainable AI: Biomarker Contribution to Prediction")
        
        coefs = model.coef_[0]
        contributions = []
        for feat_name, c, val, mean_v, scale_v in zip(features, coefs, patient_data[0], scaler.mean_, scaler.scale_):
            z_score = (val - mean_v) / scale_v
            impact = c * z_score
            contributions.append({
                "Biomarker": feat_name,
                "Patient Value": val,
                "Impact (Log-Odds)": round(impact, 3),
                "Effect": "Elevates Risk 🔺" if impact > 0 else "Protective 🔻"
            })

        contrib_df = pd.DataFrame(contributions).sort_values(by="Impact (Log-Odds)", ascending=False)
        st.dataframe(contrib_df, use_container_width=True, hide_index=True)

# ---------------------------------------------------------
# TAB 2: MODEL PERFORMANCE & FORMULA
# ---------------------------------------------------------
with tab_model:
    st.markdown("### 📊 Scikit-Learn Logistic Regression Architecture")
    
    st.markdown(r"""
    Logistic Regression predicts the posterior probability $P(Y=1 \mid \mathbf{x})$ using the standard sigmoid activation function:
    """)
    
    st.latex(r"P(\text{Heart Disease} = 1 \mid \mathbf{x}) = \frac{1}{1 + e^{-(\mathbf{w}^T \mathbf{z} + b)}}")
    
    st.markdown(rf"""
    Where:
    - $\mathbf{{z}} = \frac{{\mathbf{{x}} - \boldsymbol{{\mu}}}}{{\boldsymbol{{\sigma}}}}$ is the standardized patient feature vector ($Z$-score scaling).
    - $\mathbf{{w}}$ represents learned regression weights (coefficients).
    - $b$ is the model intercept bias ($b = {model.intercept_[0]:.4f}$).
    """)

    m1, m2, m3, m4 = st.columns(4)
    m1.metric("Test Accuracy", f"{artifacts['accuracy'] * 100:.2f}%")
    m2.metric("ROC-AUC Score", f"{artifacts['roc_auc']:.4f}")
    m3.metric("Precision", f"{artifacts['report']['High Risk']['precision'] * 100:.2f}%")
    m4.metric("Recall / Sensitivity", f"{artifacts['report']['High Risk']['recall'] * 100:.2f}%")

    st.markdown("---")
    st.markdown("#### ⚖️ Learned Feature Importance (Coefficients)")
    coef_df = pd.DataFrame({
        "Feature": features,
        "Coefficient (Weight)": model.coef_[0]
    }).sort_values(by="Coefficient (Weight)", ascending=True)

    st.bar_chart(coef_df.set_index("Feature"))

# ---------------------------------------------------------
# TAB 3: DATASET EXPLORER
# ---------------------------------------------------------
with tab_data:
    st.markdown("### 📁 UCI Cleveland Heart Disease Dataset")
    st.markdown(f"Total Cohort: **{df.shape[0]} patient samples**, **{df.shape[1]} attributes**.")
    
    st.dataframe(df.head(20), use_container_width=True)

    d1, d2 = st.columns(2)
    with d1:
        st.markdown("#### Target Distribution")
        target_counts = df['target'].value_counts().rename({0: 'Low Risk (0)', 1: 'High Risk (1)'})
        st.bar_chart(target_counts)

    with d2:
        st.markdown("#### Summary Statistics")
        st.dataframe(df.describe().T[['mean', 'std', 'min', 'max']], use_container_width=True)
