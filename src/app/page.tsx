'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { PresetSelector, PRESETS } from '@/components/PresetSelector';
import { PatientForm } from '@/components/PatientForm';
import { ResultDisplay } from '@/components/ResultDisplay';
import { ModelExplainerModal } from '@/components/ModelExplainerModal';
import { PatientInput, PredictionResult } from '@/lib/modelPredictor';
import { Heart, Activity, Info, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [formData, setFormData] = useState<PatientInput>(PRESETS[0].data);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModelModal, setShowModelModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectPreset = (preset: PatientInput) => {
    setFormData(preset);
    setErrorMsg(null);
  };

  const handleFormSubmit = async (data: PatientInput) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Connect to Next.js API route (/api/predict)
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Prediction calculation failed');
      }

      const predictionData: PredictionResult = await res.json();
      setResult(predictionData);

      // Smooth scroll to result on mobile
      if (window.innerWidth < 1024) {
        const resultElement = document.getElementById('prediction-result-section');
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred while evaluating the model.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(PRESETS[0].data);
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header onOpenModelInfo={() => setShowModelModal(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border border-slate-800 p-6 sm:p-8">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Full-Stack Machine Learning Clinical Application</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Heart Disease Risk Stratification & Clinical Prediction
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              An intelligent clinical decision-support system built with <strong className="text-teal-400 font-semibold">Next.js</strong> and trained using a <strong className="text-teal-400 font-semibold">Logistic Regression</strong> algorithm on the Cleveland Heart Disease dataset. Input patient biomarkers to instantly predict coronary artery disease probability.
            </p>
          </div>
        </div>

        {/* 1-Click Presets */}
        <PresetSelector onSelect={handleSelectPreset} />

        {/* Main Content Layout: Form & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Patient Input Form (7 columns on large screens) */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-rose-400" />
                <h2 className="text-base font-bold text-white">Patient Clinical Assessment Form</h2>
              </div>
              <span className="text-xs text-slate-400">13 Clinical Parameters</span>
            </div>

            {errorMsg && (
              <div className="p-4 mb-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
                <Info className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <PatientForm
              initialValues={formData}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              onReset={handleReset}
            />
          </div>

          {/* Results Panel (5 columns on large screens) */}
          <div id="prediction-result-section" className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-teal-400" />
                <h2 className="text-base font-bold text-white">Risk Evaluation Dashboard</h2>
              </div>
              {result && (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Live Prediction Ready
                </span>
              )}
            </div>

            {result ? (
              <ResultDisplay result={result} />
            ) : (
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500 border border-slate-700/60">
                  <Heart className="w-8 h-8 text-slate-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-200">Awaiting Clinical Data</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                    Select a sample test preset above or adjust the patient parameters, then click <strong className="text-teal-400">"Compute Heart Disease Risk Prediction"</strong> to view classification results.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <span>Standard Decision Boundary: &ge; 50%</span>
                  <span>&bull;</span>
                  <span>Logistic Sigmoid Activation</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Model Information Architecture Modal */}
      <ModelExplainerModal
        isOpen={showModelModal}
        onClose={() => setShowModelModal(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            CardioPredict AI &copy; 2026. Built with Next.js, TypeScript, Tailwind CSS & Scikit-Learn Logistic Regression.
          </p>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Accuracy: 86.89%</span>
            <span>&bull;</span>
            <span>ROC-AUC: 0.9513</span>
            <span>&bull;</span>
            <button
              onClick={() => setShowModelModal(true)}
              className="text-teal-400 hover:underline cursor-pointer"
            >
              Model Info
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

