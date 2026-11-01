'use client';

import React from 'react';
import { Activity, Heart, Stethoscope, Github, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenModelInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenModelInfo }) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 via-red-500 to-rose-700 shadow-lg shadow-rose-500/25 ring-1 ring-white/20">
            <Heart className="w-6 h-6 text-white animate-pulse" fill="currentColor" />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                CardioPredict <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 font-mono text-sm uppercase px-2 py-0.5 rounded-full bg-teal-950/60 border border-teal-800/60">AI Clinical</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
              Next.js & Logistic Regression Clinical Risk Stratification
            </p>
          </div>
        </div>

        {/* Model Stats & Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
            <span className="text-slate-400">Model:</span>
            <span className="font-semibold text-teal-300">Logistic Regression</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Accuracy:</span>
            <span className="font-semibold text-emerald-400">86.89%</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">ROC-AUC:</span>
            <span className="font-semibold text-cyan-400">0.9513</span>
          </div>

          <button
            onClick={onOpenModelInfo}
            className="flex items-center space-x-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 hover:bg-teal-500/20 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Model Architecture</span>
          </button>
        </div>

      </div>
    </header>
  );
};

