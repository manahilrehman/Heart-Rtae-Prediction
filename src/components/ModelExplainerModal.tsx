'use client';

import React from 'react';
import { X, Cpu, Layers, Activity, Award, BarChart3 } from 'lucide-react';
import modelData from '@/lib/model_params.json';

interface ModelExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelExplainerModal: React.FC<ModelExplainerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Logistic Regression Architecture & Specifications
              </h3>
              <p className="text-xs text-slate-400">
                Trained via Python <code className="text-teal-300">scikit-learn</code> on UCI Cleveland Dataset
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mathematical formulation */}
        <div className="mt-6 space-y-6 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h4 className="font-semibold text-teal-300 mb-2 flex items-center gap-1.5 text-sm">
              <Layers className="w-4 h-4" /> Mathematical Formulation
            </h4>
            <p className="mb-2">
              Logistic Regression maps continuous clinical attributes $\mathbf{x}$ to a bounded risk probability $P \in [0, 1]$ using the sigmoid function:
            </p>
            <div className="p-3 bg-slate-950/80 rounded-xl font-mono text-center text-teal-300 border border-slate-800 my-2 text-xs sm:text-sm">
              P(Heart Disease = 1 | x) = 1 / (1 + e^-(w^T * z + b))
            </div>
            <p className="text-[11px] text-slate-400">
              Where $z = (x - \mu) / \sigma$ is the standardized feature vector, $\mathbf{w}$ represents trained weights, and $b = {modelData.model.intercept.toFixed(4)}$ is the bias intercept.
            </p>
          </div>

          {/* Model Performance Cards */}
          <div>
            <h4 className="font-semibold text-white mb-3 flex items-center gap-1.5 text-sm">
              <Award className="w-4 h-4 text-emerald-400" /> Evaluation Metrics (Held-out Test Cohort)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                <div className="text-[11px] text-slate-400">Test Accuracy</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">{modelData.metrics.accuracy}%</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                <div className="text-[11px] text-slate-400">ROC-AUC Score</div>
                <div className="text-xl font-bold text-cyan-400 mt-1">{modelData.metrics.roc_auc}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                <div className="text-[11px] text-slate-400">Recall / Sensitivity</div>
                <div className="text-xl font-bold text-teal-300 mt-1">{modelData.metrics.recall}%</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                <div className="text-[11px] text-slate-400">F1-Score</div>
                <div className="text-xl font-bold text-indigo-400 mt-1">{modelData.metrics.f1_score}</div>
              </div>
            </div>
          </div>

          {/* Feature Importance Table */}
          <div>
            <h4 className="font-semibold text-white mb-3 flex items-center gap-1.5 text-sm">
              <BarChart3 className="w-4 h-4 text-cyan-400" /> Learned Feature Weights & Clinical Directionality
            </h4>
            <div className="border border-slate-800 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-800/80 text-slate-300 text-[11px] sticky top-0">
                  <tr>
                    <th className="p-2.5">Feature</th>
                    <th className="p-2.5">Coefficient (Weight)</th>
                    <th className="p-2.5">Clinical Influence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                  {modelData.feature_importance.map((f, i) => (
                    <tr key={i} className="hover:bg-slate-800/40">
                      <td className="p-2.5 text-white font-sans">{f.feature}</td>
                      <td className={`p-2.5 font-bold ${f.coefficient > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {f.coefficient > 0 ? `+${f.coefficient}` : f.coefficient}
                      </td>
                      <td className="p-2.5 text-slate-300 font-sans">{f.risk_direction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
};
