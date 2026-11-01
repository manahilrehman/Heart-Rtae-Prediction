# Cleveland Heart Disease Dataset

This dataset is sourced from the **UCI Machine Learning Repository** (Cleveland Heart Disease Database).

## Clinical Features & Dictionary

| Feature | Description | Values / Units |
|---|---|---|
| `age` | Patient age | Years (29 - 77) |
| `sex` | Sex of patient | 1 = Male, 0 = Female |
| `cp` | Chest pain type | 1: Typical Angina, 2: Atypical Angina, 3: Non-anginal pain, 4: Asymptomatic |
| `trestbps` | Resting blood pressure | mm Hg on hospital admission |
| `chol` | Serum cholesterol | mg/dl |
| `fbs` | Fasting blood sugar > 120 mg/dl | 1 = True, 0 = False |
| `restecg` | Resting electrocardiographic results | 0 = Normal, 1 = ST-T wave abnormality, 2 = Left ventricular hypertrophy |
| `thalach` | Maximum heart rate achieved | bpm |
| `exang` | Exercise-induced angina | 1 = Yes, 0 = No |
| `oldpeak` | ST depression induced by exercise relative to rest | Numeric |
| `slope` | Slope of peak exercise ST segment | 1 = Upsloping, 2 = Flat, 3 = Downsloping |
| `ca` | Number of major vessels colored by fluoroscopy | 0 - 3 |
| `thal` | Thallium stress test result | 3 = Normal, 6 = Fixed defect, 7 = Reversible defect |
| `target` | Heart disease diagnosis | 0 = Low Risk (Absence), 1 = High Risk (Presence) |

## Preprocessing
- Missing values in `ca` (4 instances) and `thal` (2 instances) are imputed using modal values.
- Continuous features are standardized using `StandardScaler` ($z = (x - \mu) / \sigma$).
- Target is binarized into:
  - `0`: Low Risk (Absence of Heart Disease)
  - `1`: High Risk (Presence of Heart Disease)

