'use client';

import React from 'react';
import { PatientInput } from '@/lib/modelPredictor';
import { ShieldCheck, AlertTriangle, Activity, Sparkles } from 'lucide-react';

interface PresetSelectorProps {
  onSelect: (preset: PatientInput) => void;
}

export const PRESETS: { id: string; name: string; tag: string; icon: any; color: string; data: PatientInput }[] = [
  {
    id: 'healthy',
    name: 'Sample 1: Healthy Low Risk',
    tag: 'Normal Physiology (Predicted ~3% Risk)',
    icon: ShieldCheck,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400 hover:border-emerald-400',
    data: {
      age: 38,
      sex: 0, // Female
      cp: 2, // Atypical
      trestbps: 118,
      chol: 182,
      fbs: 0,
      restecg: 0,
      thalach: 174,
      exang: 0,
      oldpeak: 0.0,
      slope: 1,
      ca: 0,
      thal: 3, // Normal
    },
  },
  {
    id: 'high_risk',
    name: 'Sample 2: High Risk Cardiac Patient',
    tag: 'Severe Ischemia (Predicted ~99% Risk)',
    icon: AlertTriangle,
    color: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400 hover:border-rose-400',
    data: {
      age: 63,
      sex: 1, // Male
      cp: 4, // Asymptomatic / Severe
      trestbps: 160,
      chol: 286,
      fbs: 1,
      restecg: 2,
      thalach: 108,
      exang: 1,
      oldpeak: 2.6,
      slope: 2,
      ca: 3,
      thal: 7, // Reversible defect
    },
  },
  {
    id: 'borderline',
    name: 'Sample 3: Moderate / Hypertensive',
    tag: 'Intermediate Risk (Predicted ~45-55%)',
    icon: Activity,
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400 hover:border-amber-400',
    data: {
      age: 54,
      sex: 1, // Male
      cp: 3, // Non-anginal
      trestbps: 138,
      chol: 235,
      fbs: 0,
      restecg: 1,
      thalach: 148,
      exang: 0,
      oldpeak: 1.2,
      slope: 2,
      ca: 1,
      thal: 3,
    },
  },
];

export const PresetSelector: React.FC<PresetSelectorProps> = ({ onSelect }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Quick Clinical Test Presets (1-Click Fill)
          </h2>
        </div>
        <span className="text-xs text-slate-400">Click a sample to test instant inference</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PRESETS.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.data)}
              type="button"
              className={`p-3 rounded-xl border bg-gradient-to-br transition-all flex items-start space-x-3 text-left group cursor-pointer hover:scale-[1.01] ${p.color}`}
            >
              <div className="p-2 rounded-lg bg-slate-900/80 border border-white/10 shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-slate-100 group-hover:text-white truncate">
                  {p.name}
                </div>
                <div className="text-xs opacity-80 mt-0.5">{p.tag}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

