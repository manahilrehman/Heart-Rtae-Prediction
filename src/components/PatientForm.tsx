'use client';

import React, { useState } from 'react';
import { PatientInput } from '@/lib/modelPredictor';
import { 
  User, 
  Heart, 
  Activity, 
  Gauge, 
  Stethoscope, 
  Thermometer, 
  Zap, 
  Waves, 
  CheckCircle2, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';

interface PatientFormProps {
  initialValues: PatientInput;
  onSubmit: (data: PatientInput) => void;
  isLoading: boolean;
  onReset: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
  onReset,
}) => {
  const [formData, setFormData] = useState<PatientInput>(initialValues);

  // Sync if initialValues changes from preset
  React.useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleChange = (key: keyof PatientInput, value: number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Section 1: Demographics */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-sm backdrop-blur-sm">
        <div className="flex items-center space-x-2.5 pb-3 mb-4 border-b border-slate-800/80">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              1. Patient Demographics
            </h3>
            <p className="text-xs text-slate-400">Basic biological & age characteristics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Age */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Age (Years) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="18"
                max="100"
                required
                value={formData.age}
                onChange={(e) => handleChange('age', Number(e.target.value))}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="e.g. 54"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-500">yrs</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Typical cohort range: 29 - 77</p>
          </div>

          {/* Sex */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Biological Sex <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleChange('sex', 1)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                  formData.sex === 1
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-sm'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Male (1)
              </button>
              <button
                type="button"
                onClick={() => handleChange('sex', 0)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                  formData.sex === 0
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-sm'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Female (0)
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Male patients hold higher baseline prevalence</p>
          </div>
        </div>
      </div>

      {/* Section 2: Clinical Vitals */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-sm backdrop-blur-sm">
        <div className="flex items-center space-x-2.5 pb-3 mb-4 border-b border-slate-800/80">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              2. Baseline Hemodynamics & Labs
            </h3>
            <p className="text-xs text-slate-400">Blood pressure, lipid panel, and glucose tolerance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Resting BP */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Resting BP (trestbps) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="80"
                max="220"
                required
                value={formData.trestbps}
                onChange={(e) => handleChange('trestbps', Number(e.target.value))}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="120"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-500">mmHg</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Normal: 120 / Hypertensive: &ge; 140</p>
          </div>

          {/* Serum Cholesterol */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Serum Cholesterol (chol) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="100"
                max="600"
                required
                value={formData.chol}
                onChange={(e) => handleChange('chol', Number(e.target.value))}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="200"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-500">mg/dl</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Desirable: &lt; 200 mg/dl</p>
          </div>

          {/* Fasting Blood Sugar */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Fasting Blood Sugar (fbs) <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.fbs}
              onChange={(e) => handleChange('fbs', Number(e.target.value))}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value={0}>&le; 120 mg/dl (Normal - 0)</option>
              <option value={1}>&gt; 120 mg/dl (Diabetic / Elevated - 1)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">Metabolic risk factor indicator</p>
          </div>
        </div>
      </div>

      {/* Section 3: Cardiac & Electrocardiographic */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-sm backdrop-blur-sm">
        <div className="flex items-center space-x-2.5 pb-3 mb-4 border-b border-slate-800/80">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              3. Symptoms, Electrocardiogram & Stress Response
            </h3>
            <p className="text-xs text-slate-400">Chest pain presentation and exercise treadmill stress results</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Chest Pain Type */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Chest Pain Type (cp) <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.cp}
              onChange={(e) => handleChange('cp', Number(e.target.value))}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value={1}>1: Typical Angina</option>
              <option value={2}>2: Atypical Angina</option>
              <option value={3}>3: Non-Anginal Pain</option>
              <option value={4}>4: Asymptomatic (Silent Ischemia)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">Type 4 indicates highest correlation</p>
          </div>

          {/* Resting ECG */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Resting ECG (restecg) <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.restecg}
              onChange={(e) => handleChange('restecg', Number(e.target.value))}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value={0}>0: Normal</option>
              <option value={1}>1: ST-T Wave Abnormality</option>
              <option value={2}>2: Left Ventricular Hypertrophy</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">Resting electrical signal morphology</p>
          </div>

          {/* Max Heart Rate (thalach) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Max Heart Rate (thalach) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="60"
                max="230"
                required
                value={formData.thalach}
                onChange={(e) => handleChange('thalach', Number(e.target.value))}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="150"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-500">bpm</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Higher rate is protective against disease</p>
          </div>

          {/* Exercise Angina (exang) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Exercise Induced Angina (exang) <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.exang}
              onChange={(e) => handleChange('exang', Number(e.target.value))}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value={0}>0: No Exercise Angina</option>
              <option value={1}>1: Yes, Induced by Exercise</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">Strong clinical indicator of coronary ischemia</p>
          </div>

          {/* ST Depression (oldpeak) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              ST Depression (oldpeak) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="7"
                required
                value={formData.oldpeak}
                onChange={(e) => handleChange('oldpeak', Number(e.target.value))}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="1.0"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-500">mm</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Depression induced by exercise relative to rest</p>
          </div>

          {/* Slope of peak exercise ST segment */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Peak ST Slope (slope) <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.slope}
              onChange={(e) => handleChange('slope', Number(e.target.value))}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value={1}>1: Upsloping (Healthy)</option>
              <option value={2}>2: Flat (Ischemic)</option>
              <option value={3}>3: Downsloping (Severe)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">ST segment geometry</p>
          </div>

        </div>
      </div>

      {/* Section 4: Advanced Fluoroscopy & Nuclear Imaging */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-sm backdrop-blur-sm">
        <div className="flex items-center space-x-2.5 pb-3 mb-4 border-b border-slate-800/80">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              4. Angiography & Thallium Perfusion Scintigraphy
            </h3>
            <p className="text-xs text-slate-400">Diagnostic confirmation features with highest model weights</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Major Vessels (ca) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Major Vessels Colored (ca: 0 - 3) <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.ca}
              onChange={(e) => handleChange('ca', Number(e.target.value))}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value={0}>0 Vessels (Clear coronaries)</option>
              <option value={1}>1 Vessel Occluded</option>
              <option value={2}>2 Vessels Occluded</option>
              <option value={3}>3 Major Vessels Occluded</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">Fluoroscopy vessel narrowing count</p>
          </div>

          {/* Thalassemia (thal) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Thallium Stress Test (thal) <span className="text-rose-400">*</span>
            </label>
            <select
              value={formData.thal}
              onChange={(e) => handleChange('thal', Number(e.target.value))}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value={3}>3: Normal Perfusion</option>
              <option value={6}>6: Fixed Defect (Previous Myocardial Infarction)</option>
              <option value={7}>7: Reversible Defect (Active Ischemic Zone)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">Nuclear scan myocardial blood flow status</p>
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white transition-all text-xs font-medium cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Form</span>
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-600 text-white font-semibold text-sm shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Evaluating Logistic Regression Model...</span>
            </>
          ) : (
            <>
              <Heart className="w-4 h-4 text-rose-300 animate-pulse" />
              <span>Compute Heart Disease Risk Prediction</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
};
