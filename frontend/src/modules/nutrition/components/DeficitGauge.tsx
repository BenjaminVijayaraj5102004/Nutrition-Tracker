import React from 'react';
import { DeficitAnalysis } from '../../../core/types/nutrition';
import { Zap, AlertTriangle, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

interface DeficitGaugeProps {
  analysis: DeficitAnalysis;
}

export const DeficitGauge: React.FC<DeficitGaugeProps> = ({ analysis }) => {
  const { target, consumed, deficit, proteinMetPercentage, caloriesMetPercentage, powerLevelTotal, rankBadge } = analysis;

  const isProteinDeficit = deficit.protein > 0;
  const isCalorieDeficit = deficit.calories > 0;

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 relative overflow-hidden shadow-xl backdrop-blur-md">
      {/* Background Anime Energy Aura */}
      <div className="absolute -right-16 -top-16 w-52 h-52 bg-gradient-to-br from-violet-600/10 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner: Rank Badge & Power Level */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`px-3 py-1 rounded-xl bg-gradient-to-r ${rankBadge.color} text-slate-950 font-black text-xs md:text-sm uppercase tracking-wider flex items-center gap-1.5 ${rankBadge.glow}`}>
            <Trophy className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>{rankBadge.rank}</span>
          </div>
          <div>
            <h2 className="text-white font-extrabold text-sm md:text-base tracking-wide flex items-center gap-1.5">
              {rankBadge.title}
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">{rankBadge.flairMessage}</p>
          </div>
        </div>

        {/* Gamified Power Level Counter */}
        <div className="bg-slate-950/90 border border-cyan-500/30 px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
          <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400 animate-pulse" />
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Power Level</span>
            <span className="text-base font-black font-mono text-cyan-300">
              {powerLevelTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Protein Gauge (Key Metric for College Hostel Bros) */}
      <div className="mb-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-bold text-cyan-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Protein Power Bar ({consumed.protein}g / {target.protein}g)
          </span>
          <span className="font-extrabold font-mono text-cyan-400">
            {proteinMetPercentage}%
          </span>
        </div>
        {/* Progress Track */}
        <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
            style={{ width: `${Math.min(100, proteinMetPercentage)}%` }}
          />
        </div>

        {/* Live Deficit Alert Banner */}
        <div className="mt-2.5 flex items-center gap-2">
          {isProteinDeficit ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-950/50 border border-rose-800/60 px-2.5 py-1 rounded-lg w-full">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                Alert: Short by <strong>{deficit.protein}g protein!</strong> Fuel up with eggs, milk, or chana below!
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2.5 py-1 rounded-lg w-full">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Protein goal smashed! +{Math.abs(deficit.protein)}g surplus! Anabolic state secured!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Secondary Macro Grid (Calories, Carbs, Fats, Fiber) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        {/* Calories */}
        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
            <span>Calories</span>
            <span className="font-mono text-white font-bold">{caloriesMetPercentage}%</span>
          </div>
          <div className="font-mono font-extrabold text-sm text-emerald-400">
            {consumed.calories} <span className="text-[10px] text-slate-500 font-normal">/ {target.calories} kcal</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, caloriesMetPercentage)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {isCalorieDeficit ? `-${deficit.calories} kcal remaining` : `+${Math.abs(deficit.calories)} kcal extra`}
          </div>
        </div>

        {/* Carbs */}
        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
            <span>Carbs (Ki Energy)</span>
            <span className="font-mono text-white font-bold">
              {Math.round((consumed.carbs / Math.max(1, target.carbs)) * 100)}%
            </span>
          </div>
          <div className="font-mono font-extrabold text-sm text-amber-400">
            {consumed.carbs}g <span className="text-[10px] text-slate-500 font-normal">/ {target.carbs}g</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (consumed.carbs / Math.max(1, target.carbs)) * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {deficit.carbs > 0 ? `${deficit.carbs}g needed` : `Fulfilled`}
          </div>
        </div>

        {/* Fats */}
        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
            <span>Healthy Fats</span>
            <span className="font-mono text-white font-bold">
              {Math.round((consumed.fats / Math.max(1, target.fats)) * 100)}%
            </span>
          </div>
          <div className="font-mono font-extrabold text-sm text-rose-400">
            {consumed.fats}g <span className="text-[10px] text-slate-500 font-normal">/ {target.fats}g</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-rose-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (consumed.fats / Math.max(1, target.fats)) * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {deficit.fats > 0 ? `${deficit.fats}g needed` : `Fulfilled`}
          </div>
        </div>

        {/* Fiber */}
        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
            <span>Fiber (Gut Armor)</span>
            <span className="font-mono text-white font-bold">
              {Math.round((consumed.fiber / Math.max(1, target.fiber)) * 100)}%
            </span>
          </div>
          <div className="font-mono font-extrabold text-sm text-lime-400">
            {consumed.fiber}g <span className="text-[10px] text-slate-500 font-normal">/ {target.fiber}g</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-lime-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (consumed.fiber / Math.max(1, target.fiber)) * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {deficit.fiber > 0 ? `${deficit.fiber}g needed` : `Fulfilled`}
          </div>
        </div>
      </div>
    </div>
  );
};
