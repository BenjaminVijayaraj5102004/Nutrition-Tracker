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
      {/* 1. Main Neo-Futurist Glass Cell: Protein Engine (Col span 7) */}
      <div className="md:col-span-7 futurism-card p-5 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Zap className="w-3 h-3" />
              <span>Target • Daily Protein</span>
            </span>
            <span className="text-xs font-semibold text-[var(--text-muted)]">
              {proteinMetPercentage}% Achieved
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {consumed.protein}g
            </span>
            <span className="text-sm font-medium text-[var(--text-muted)]">
              of {target.protein}g daily requirement
            </span>
          </div>

          {/* Futuristic Cyber Neon Progress Bar */}
          <div className="w-full bg-[var(--card-border)]/50 rounded-full h-2.5 overflow-hidden mb-3 p-[1px]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                proteinMetPercentage >= 100
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 shadow-[0_0_12px_rgba(99,102,241,0.4)]'
              }`}
              style={{ width: `${Math.min(100, proteinMetPercentage)}%` }}
            />
          </div>
        </div>

        {/* Actionable Status Callout */}
        <div className="mt-1 relative">
          {isProteinDeficit ? (
            <div className="flex items-start gap-2.5 text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/25 p-2.5 rounded-xl">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Deficit Alert:</strong> You are short by <strong>{deficit.protein}g protein</strong> today. Consider adding eggs, milk, or chicken from external food below.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                <strong>Target Complete:</strong> You have reached your daily protein requirement!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Secondary Cell: Calories (Col span 5) */}
      <div className="md:col-span-5 futurism-card p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Energy Intake
            </span>
            <span className="text-xs font-bold text-[var(--text-primary)]">
              {caloriesMetPercentage}%
            </span>
          </div>

          <div className="my-1">
            <span className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {consumed.calories}
            </span>
            <span className="text-sm text-[var(--text-muted)] font-medium ml-1.5">
              / {target.calories} kcal
            </span>
          </div>

          <div className="w-full bg-[var(--card-border)]/50 rounded-full h-2 mb-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${Math.min(100, caloriesMetPercentage)}%` }}
            />
          </div>
        </div>

        <div className="text-[11px] text-[var(--text-muted)] flex items-center justify-between pt-2 border-t border-[var(--card-border)]">
          <span>Calculation Standard</span>
          <span className="font-semibold text-[var(--text-primary)]">Mifflin-St Jeor</span>
        </div>
      </div>

      {/* 3. Mini Stat: Carbs (Col span 4) */}
      <div className="md:col-span-4 futurism-card p-4">
        <span className="text-[11px] font-medium text-[var(--text-muted)] block mb-1">Carbohydrates</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-[var(--text-primary)]">{consumed.carbs}g</span>
          <span className="text-xs text-[var(--text-muted)]">/ ~{target.carbs}g</span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mt-1">Hostel rice, rotis & grains</p>
      </div>

      {/* 4. Mini Stat: Fats (Col span 4) */}
      <div className="md:col-span-4 futurism-card p-4">
        <span className="text-[11px] font-medium text-[var(--text-muted)] block mb-1">Dietary Fats</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-[var(--text-primary)]">{consumed.fats}g</span>
          <span className="text-xs text-[var(--text-muted)]">/ ~{target.fats}g</span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mt-1">Ghee, dals, & gravies</p>
      </div>

      {/* 5. Mini Stat: Fiber (Col span 4) */}
      <div className="md:col-span-4 futurism-card p-4">
        <span className="text-[11px] font-medium text-[var(--text-muted)] block mb-1">Dietary Fiber</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-[var(--text-primary)]">{consumed.fiber}g</span>
          <span className="text-xs text-[var(--text-muted)]">/ 30g target</span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mt-1">Fresh salads & fruits</p>
      </div>
    </div>
  );
};
