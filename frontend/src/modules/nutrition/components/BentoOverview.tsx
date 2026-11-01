import React from 'react';
import { DeficitAnalysis } from '../../../core/types/nutrition';
import { AlertCircle, CheckCircle2, TrendingUp, Zap } from 'lucide-react';

interface BentoOverviewProps {
  analysis: DeficitAnalysis;
  onOpenScanner: () => void;
}

export const BentoOverview: React.FC<BentoOverviewProps> = ({ analysis }) => {
  const { target, consumed, deficit, proteinMetPercentage, caloriesMetPercentage } = analysis;
  const isProteinDeficit = deficit.protein > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
      {/* 1. Main Neo-Brutalist Cell: Protein Engine (Col span 7) */}
      <div className="md:col-span-7 neo-card-static p-5 flex flex-col justify-between relative overflow-hidden bg-white dark:bg-zinc-900">
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-black bg-yellow-400 border-1.5 border-[var(--card-border)] shadow-[1.5px_1.5px_0px_var(--card-shadow)] px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-black text-black" />
              <span>Target • Daily Protein</span>
            </span>
            <span className="text-xs font-black font-mono text-[var(--text-primary)] bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-md border border-[var(--card-border)]">
              {proteinMetPercentage}% Achieved
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight font-mono">
              {consumed.protein}g
            </span>
            <span className="text-xs font-bold text-[var(--text-muted)]">
              of {target.protein}g daily requirement
            </span>
          </div>

          {/* Neo-Brutalist Thick Progress Bar */}
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 border-2 border-[var(--card-border)] rounded-full h-4 overflow-hidden mb-3 p-0.5 shadow-[1.5px_1.5px_0px_var(--card-shadow)]">
            <div
              className={`h-full rounded-full border border-[var(--card-border)] transition-all duration-500 ${
                proteinMetPercentage >= 100
                  ? 'bg-lime-400 dark:bg-lime-400'
                  : 'bg-yellow-400 dark:bg-yellow-400'
              }`}
              style={{ width: `${Math.min(100, proteinMetPercentage)}%` }}
            />
          </div>
        </div>

        {/* Actionable Status Callout */}
        <div className="mt-1 relative">
          {isProteinDeficit ? (
            <div className="flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/70 border-2 border-[var(--card-border)] shadow-[2.5px_2.5px_0px_var(--card-shadow)] p-3 rounded-xl font-bold">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 stroke-[2.5]" />
              <span>
                <strong>Deficit Alert:</strong> You are short by <strong>{deficit.protein}g protein</strong> today. Consider adding eggs, milk, or chicken from external food below.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 text-xs text-emerald-950 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950/70 border-2 border-[var(--card-border)] shadow-[2.5px_2.5px_0px_var(--card-shadow)] p-3 rounded-xl font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
              <span>
                <strong>Target Complete:</strong> You have reached your daily protein requirement!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Secondary Cell: Calories (Col span 5) */}
      <div className="md:col-span-5 neo-card-static p-5 flex flex-col justify-between bg-cyan-50/70 dark:bg-cyan-950/20">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-black bg-cyan-300 border-1.5 border-[var(--card-border)] shadow-[1.5px_1.5px_0px_var(--card-shadow)] px-2 py-0.5 rounded-md">
              Energy Intake
            </span>
            <span className="text-xs font-black font-mono text-[var(--text-primary)]">
              {caloriesMetPercentage}%
            </span>
          </div>

          <div className="my-1.5">
            <span className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight font-mono">
              {consumed.calories}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-bold ml-1.5">
              / {target.calories} kcal
            </span>
          </div>

          <div className="w-full bg-zinc-200 dark:bg-zinc-800 border-2 border-[var(--card-border)] rounded-full h-3.5 mb-3 p-0.5 shadow-[1.5px_1.5px_0px_var(--card-shadow)]">
            <div
              className="h-full rounded-full bg-cyan-400 dark:bg-cyan-400 border border-[var(--card-border)] transition-all duration-300"
              style={{ width: `${Math.min(100, caloriesMetPercentage)}%` }}
            />
          </div>
        </div>

        <div className="text-[11px] text-[var(--text-muted)] flex items-center justify-between pt-2 border-t-2 border-[var(--card-border)] font-bold">
          <span>Calculation Standard</span>
          <span className="font-black text-[var(--text-primary)]">Mifflin-St Jeor</span>
        </div>
      </div>

      {/* 3. Mini Stat: Carbs (Col span 4) */}
      <div className="md:col-span-4 neo-card p-4 bg-orange-50/70 dark:bg-orange-950/20">
        <span className="text-[11px] font-black text-black bg-orange-300 border-1.5 border-[var(--card-border)] shadow-[1.5px_1.5px_0px_var(--card-shadow)] px-2 py-0.5 rounded-md uppercase inline-block mb-2">
          Carbohydrates
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-[var(--text-primary)] font-mono">{consumed.carbs}g</span>
          <span className="text-xs text-[var(--text-muted)] font-bold">/ ~{target.carbs}g</span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] font-bold mt-1">Hostel rice, rotis & grains</p>
      </div>

      {/* 4. Mini Stat: Fats (Col span 4) */}
      <div className="md:col-span-4 neo-card p-4 bg-pink-50/70 dark:bg-pink-950/20">
        <span className="text-[11px] font-black text-black bg-pink-300 border-1.5 border-[var(--card-border)] shadow-[1.5px_1.5px_0px_var(--card-shadow)] px-2 py-0.5 rounded-md uppercase inline-block mb-2">
          Dietary Fats
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-[var(--text-primary)] font-mono">{consumed.fats}g</span>
          <span className="text-xs text-[var(--text-muted)] font-bold">/ ~{target.fats}g</span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] font-bold mt-1">Ghee, dals, & gravies</p>
      </div>

      {/* 5. Mini Stat: Fiber (Col span 4) */}
      <div className="md:col-span-4 neo-card p-4 bg-lime-50/70 dark:bg-lime-950/20">
        <span className="text-[11px] font-black text-black bg-lime-300 border-1.5 border-[var(--card-border)] shadow-[1.5px_1.5px_0px_var(--card-shadow)] px-2 py-0.5 rounded-md uppercase inline-block mb-2">
          Dietary Fiber
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-[var(--text-primary)] font-mono">{consumed.fiber}g</span>
          <span className="text-xs text-[var(--text-muted)] font-bold">/ 30g target</span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] font-bold mt-1">Fresh salads & fruits</p>
      </div>
    </div>
  );
};
