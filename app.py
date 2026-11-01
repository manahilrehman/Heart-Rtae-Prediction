import os
import streamlit as st
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

# ---------------------------------------------------------
# Page Configuration
# ---------------------------------------------------------
st.set_page_config(
    page_title="Simple Heart Rate Predictor",
    page_icon="🫀",
    layout="centered",
    initial_sidebar_state="expanded"
)

# Custom Styling (Dark & Light Mode Friendly)
st.markdown("""
<style>
    .main-title {
        font-size: 2.3rem;
        font-weight: 800;
        color: #f43f5e;
        text-align: center;
        margin-bottom: 0.2rem;
    }
    .sub-title {
        font-size: 1.05rem;
        color: #94a3b8;
        text-align: center;
        margin-bottom: 1.8rem;
    }
    .result-card-safe {
        background-color: rgba(34, 197, 94, 0.12);
        border: 2px solid #22c55e;
        border-radius: 16px;
        padding: 22px;
        text-align: center;
        margin-top: 15px;
    }
    .result-card-warning {
        background-color: rgba(245, 158, 11, 0.12);
        border: 2px solid #f59e0b;
        border-radius: 16px;
        padding: 22px;
        text-align: center;
        margin-top: 15px;
    }
    .result-card-danger {
        background-color: rgba(239, 68, 68, 0.12);
        border: 2px solid #ef4444;
        border-radius: 16px;
        padding: 22px;
        text-align: center;
        margin-top: 15px;
    }
    .stButton>button {
        background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
        color: white;
        font-weight: 700;
        font-size: 1.1rem;
        border-radius: 12px;
        border: none;
        padding: 12px 24px;
        width: 100%;
        transition: all 0.3s ease;
        box-shadow: 0 4px 14px rgba(244, 63, 94, 0.3);
    }
    .stButton>button:hover {
        background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
        box-shadow: 0 6px 18px rgba(244, 63, 94, 0.45);
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Load & Train Heart Rate Model (Cached)
# ---------------------------------------------------------
@st.cache_resource
def get_heart_model():
    dataset_path = os.path.join(os.path.dirname(__file__), 'dataset', 'heart.csv')
    if os.path.exists(dataset_path):
        df = pd.read_csv(dataset_path)
    else:
        raw_cleveland = 'https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data'
        cols = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target']
        df = pd.read_csv(raw_cleveland, names=cols, na_values='?')

    # Binarize target: 0 = Low Risk, 1 = Elevated Risk
    df['target'] = (df['target'] > 0).astype(int)

    # Simplified feature set: Age, Sex, Heart Rate (thalach), Blood Pressure (trestbps)
    features = ['age', 'sex', 'thalach', 'trestbps']
    X = df[features].fillna(df[features].median())
    y = df['target']

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = LogisticRegression(random_state=42)
    model.fit(X_scaled, y)

    accuracy = model.score(X_scaled, y)
    return model, scaler, features, accuracy

model, scaler, features, model_acc = get_heart_model()

# ---------------------------------------------------------
# Sidebar - Presets & Heart Rate Standards
# ---------------------------------------------------------
with st.sidebar:
    st.image("https://img.icons8.com/color/96/heart-with-pulse.png", width=60)
    st.markdown("### 🫀 Heart Rate Guide")
    st.caption("Simplified Cardiac Risk Assessment")

    st.markdown("---")
    st.markdown("#### ⚡ 1-Click Fast Presets")
    st.write("Click any sample patient to test instantly:")

    if st.button("🟢 Young & Healthy (72 BPM)"):
        st.session_state['age_val'] = 26
        st.session_state['sex_val'] = "Male"
        st.session_state['hr_val'] = 72
        st.session_state['bp_val'] = 118
        st.rerun()

    if st.button("🏃 Active Athlete (58 BPM)"):
        st.session_state['age_val'] = 30
        st.session_state['sex_val'] = "Female"
        st.session_state['hr_val'] = 58
        st.session_state['bp_val'] = 110
        st.rerun()

    if st.button("🟡 High Pulse / Tachycardia (112 BPM)"):
        st.session_state['age_val'] = 45
        st.session_state['sex_val'] = "Male"
        st.session_state['hr_val'] = 112
        st.session_state['bp_val'] = 135
        st.rerun()

    if st.button("🔴 Senior High Risk (105 BPM)"):
        st.session_state['age_val'] = 66
        st.session_state['sex_val'] = "Male"
        st.session_state['hr_val'] = 105
        st.session_state['bp_val'] = 160
        st.rerun()

    st.markdown("---")
    st.markdown("#### 📊 Clinical Heart Rate Zones")
    st.markdown("""
    - **Normal Resting:** 60 - 100 BPM
    - **Trained Athletes:** 40 - 60 BPM
    - **Bradycardia (Low):** < 60 BPM
    - **Tachycardia (High):** > 100 BPM
    """)
    st.caption(f"Model Accuracy: ~{model_acc * 100:.1f}%")

# ---------------------------------------------------------
# Main Header
# ---------------------------------------------------------
st.markdown('<div class="main-title">🫀 Simple Heart Rate Predictor</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-title">Enter your basic vitals below to evaluate heart rate metrics and cardiac health risk.</div>', unsafe_allow_html=True)

# ---------------------------------------------------------
# Form Inputs
# ---------------------------------------------------------
st.markdown("### 📋 Enter Patient Information")

col1, col2 = st.columns(2)

with col1:
    age = st.number_input(
        "👤 Age (Years)",
        min_value=15,
        max_value=100,
        value=st.session_state.get('age_val', 35),
        step=1,
        help="Patient chronological age in years."
    )

    sex = st.selectbox(
        "🚻 Biological Sex",
        options=["Male", "Female"],
        index=0 if st.session_state.get('sex_val', "Male") == "Male" else 1,
        help="Biological sex assigned at birth."
    )

with col2:
    heart_rate = st.number_input(
        "💓 Heart Rate (BPM - Beats Per Minute)",
        min_value=40,
        max_value=220,
        value=st.session_state.get('hr_val', 75),
        step=1,
        help="Resting pulse or max exercise heart rate in BPM."
    )

    bp = st.number_input(
        "🩸 Resting Blood Pressure (mmHg)",
        min_value=80,
        max_value=220,
        value=st.session_state.get('bp_val', 120),
        step=1,
        help="Systolic blood pressure (Normal is ~120 mmHg)."
    )

predict_btn = st.button("🔮 Predict Heart Health")

# ---------------------------------------------------------
# Computations
# ---------------------------------------------------------
max_safe_hr = 220 - age
target_zone_low = int(max_safe_hr * 0.50)
target_zone_high = int(max_safe_hr * 0.85)

if heart_rate < 60:
    hr_status = "Low (Bradycardia)"
elif 60 <= heart_rate <= 100:
    hr_status = "Normal / Optimal"
else:
    hr_status = "Elevated (Tachycardia)"

# ---------------------------------------------------------
# Prediction Calculation & Result Display
# ---------------------------------------------------------
if predict_btn or 'has_predicted' in st.session_state:
    st.session_state['has_predicted'] = True

    sex_binary = 1 if sex == "Male" else 0
    input_features = pd.DataFrame([{
        'age': age,
        'sex': sex_binary,
        'thalach': heart_rate,
        'trestbps': bp
    }])

    scaled_input = scaler.transform(input_features)
    risk_prob = float(model.predict_proba(scaled_input)[0][1]) * 100

    # Adjust for young individuals with normal resting pulse
    if heart_rate >= 60 and heart_rate <= 85 and age < 40 and bp <= 125:
        risk_prob = min(risk_prob, 22.0)

    st.markdown("---")
    st.markdown("### 📊 Prediction Results")

    # Result Card Banner
    if risk_prob < 35 and (60 <= heart_rate <= 100):
        st.markdown(f"""
        <div class="result-card-safe">
            <h2 style="margin: 0; color: #22c55e;">🟢 Low Risk - Heart Rate is Healthy!</h2>
            <p style="font-size: 1.1rem; margin-top: 8px; color: #e2e8f0;">
                Your heart rate of <strong>{heart_rate} BPM</strong> is within the ideal clinical range. 
                Estimated cardiac risk probability is low at <strong>{risk_prob:.1f}%</strong>.
            </p>
        </div>
        """, unsafe_allow_html=True)
    elif risk_prob < 65:
        st.markdown(f"""
        <div class="result-card-warning">
            <h2 style="margin: 0; color: #f59e0b;">🟡 Moderate Risk - Routine Caution Advised</h2>
            <p style="font-size: 1.1rem; margin-top: 8px; color: #e2e8f0;">
                Your heart rate is <strong>{heart_rate} BPM</strong> with a risk probability of <strong>{risk_prob:.1f}%</strong>. 
                Keep track of daily physical exertion and maintain a balanced blood pressure.
            </p>
        </div>
        """, unsafe_allow_html=True)
    else:
        st.markdown(f"""
        <div class="result-card-danger">
            <h2 style="margin: 0; color: #ef4444;">🔴 High Risk Detected - Medical Checkup Recommended</h2>
            <p style="font-size: 1.1rem; margin-top: 8px; color: #e2e8f0;">
                Estimated cardiac risk score is <strong>{risk_prob:.1f}%</strong> with a pulse of <strong>{heart_rate} BPM</strong>. 
                Consulting a healthcare provider or cardiologist is recommended.
            </p>
        </div>
        """, unsafe_allow_html=True)

    st.write("")

    # 4 Key Metrics Display
    m1, m2, m3, m4 = st.columns(4)
    with m1:
        st.metric("Risk Score", f"{risk_prob:.1f}%")
    with m2:
        st.metric("Pulse Status", hr_status.split("(")[0].strip())
    with m3:
        st.metric("Estimated Max HR", f"{max_safe_hr} BPM")
    with m4:
        st.metric("Cardio Workout Zone", f"{target_zone_low}-{target_zone_high} BPM")

    # Recommendations
    st.markdown("#### 💡 Clinical Insights & Guidance")
    st.info(f"""
    - **Current Pulse Status:** Your pulse is **{heart_rate} BPM** ({hr_status}). Normal resting heart rate for adults ranges between **60 and 100 BPM**.
    - **Maximum Safe Heart Rate:** For your age ({age} years), your theoretical maximum heart rate is **{max_safe_hr} BPM** (calculated via $220 - \text{{Age}}$).
    - **Target Exercise Zone:** During aerobic workouts, your target heart rate should stay between **{target_zone_low} and {target_zone_high} BPM** (50% to 85% intensity).
    - **When to Seek Care:** If you experience chest pain, sudden palpitations, shortness of breath, or dizziness, seek medical attention promptly.
    """)
