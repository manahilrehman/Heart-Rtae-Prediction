'use client';

import React from 'react';
import { PredictionResult } from '@/lib/modelPredictor';
import { 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  Printer,
  ChevronRight,
  Info
} from 'lucide-react';

interface ResultDisplayProps {
  result: PredictionResult;
  onPrint?: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const isHighRisk = result.prediction === 'High Risk';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Primary Result Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all ${
          isHighRisk
            ? 'bg-gradient-to-br from-rose-950/80 via-slate-900 to-red-950/40 border-rose-500/40 shadow-rose-950/40'
            : 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-teal-950/40 border-emerald-500/40 shadow-emerald-950/40'
        }`}
      >
        {/* Ambient background light */}
        <div
          className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${
            isHighRisk ? 'bg-rose-500' : 'bg-emerald-500'
          }`}
        />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  isHighRisk
                    ? 'bg-rose-500 text-white shadow-rose-500/30'
                    : 'bg-emerald-500 text-white shadow-emerald-500/30'
                }`}
              >
                {isHighRisk ? (
                  <AlertTriangle className="w-9 h-9 animate-bounce" />
                ) : (
                  <ShieldCheck className="w-9 h-9" />
                )}
              </div>

              <div>
                <span
                  className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-1 border ${
                    isHighRisk
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  Clinical Classification Output
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {result.prediction}
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  {isHighRisk
                    ? 'High probability of significant coronary artery disease present.'
                    : 'Low probability of angiographic coronary artery disease.'}
                </p>
              </div>
            </div>

            {/* Score & Gauge */}
            <div className="sm:text-right bg-slate-900/60 p-4 rounded-2xl border border-white/10 shrink-0">
              <div className="text-xs text-slate-400 font-medium">Predicted Risk Score</div>
              <div
                className={`text-3xl sm:text-4xl font-black tracking-tight ${
                  isHighRisk ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {result.riskProbability}%
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Model Confidence: <span className="text-slate-200 font-semibold">{result.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Risk Probability Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
              <span>0% (Absence)</span>
              <span className="text-slate-300">Decision Threshold: 50%</span>
              <span>100% (Presence)</span>
            </div>
            <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  isHighRisk
                    ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                    : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                }`}
                style={{ width: `${Math.min(Math.max(result.riskProbability, 3), 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Explainable AI: Feature Risk Factors & Protective Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Top Contributing Risk Factors */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-slate-800 text-rose-400 font-semibold text-sm">
            <TrendingUp className="w-4 h-4" />
            <h3>Key Factors Elevating Patient Risk</h3>
          </div>

          {result.topRiskFactors.length > 0 ? (
            <div className="space-y-3">
              {result.topRiskFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-800/60 border border-rose-500/20 text-xs"
                >
                  <div className="flex items-center justify-between font-medium text-slate-200">
                    <span>{factor.name}</span>
                    <span className="text-rose-400 font-mono font-semibold">
                      +{factor.impactScore} log-odds
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{factor.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-4 text-center">
              No significant risk-elevating biomarkers detected.
            </p>
          )}
        </div>

        {/* Protective Factors */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-slate-800 text-emerald-400 font-semibold text-sm">
            <TrendingDown className="w-4 h-4" />
            <h3>Key Favorable / Protective Biomarkers</h3>
          </div>

          {result.protectiveFactors.length > 0 ? (
            <div className="space-y-3">
              {result.protectiveFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-800/60 border border-emerald-500/20 text-xs"
                >
                  <div className="flex items-center justify-between font-medium text-slate-200">
                    <span>{factor.name}</span>
                    <span className="text-emerald-400 font-mono font-semibold">
                      {factor.impactScore} log-odds
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{factor.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-4 text-center">
              No major protective physiological offsets observed.
            </p>
          )}
        </div>

      </div>

      {/* Clinical Recommendations */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
        <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-slate-800 text-slate-200 font-semibold text-sm">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <h3>Automated Clinical Action & Care Protocol</h3>
        </div>

        <ul className="space-y-2.5">
          {result.clinicalRecommendations.map((rec, i) => (
            <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-300">
              <ChevronRight className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>* For investigational & triage decision-support use only.</span>
          <span className="font-mono">Logit: {result.logit}</span>
        </div>
      </div>

    </div>
  );
};
