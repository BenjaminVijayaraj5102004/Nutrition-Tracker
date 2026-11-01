import React from 'react';
import { DeficitAnalysis } from '../../../core/types/nutrition';
import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

interface BentoOverviewProps {
  analysis: DeficitAnalysis;
  onOpenScanner: () => void;
}

export const BentoOverview: React.FC<BentoOverviewProps> = ({ analysis }) => {
  const { target, consumed, deficit, proteinMetPercentage, caloriesMetPercentage } = analysis;
  const isProteinDeficit = deficit.protein > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
      {/* 1. Main Protein Card (Col span 7) */}
      <div className="md:col-span-7 app-card p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 rounded-md">
              Primary Target • Daily Protein
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {proteinMetPercentage}% Achieved
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {consumed.protein}g
            </span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              of {target.protein}g daily requirement
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                proteinMetPercentage >= 100 ? 'bg-emerald-500' : 'bg-indigo-600 dark:bg-indigo-500'
              }`}
              style={{ width: `${Math.min(100, proteinMetPercentage)}%` }}
            />
          </div>
        </div>

        {/* Actionable Status Callout */}
        <div className="mt-1">
          {isProteinDeficit ? (
            <div className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-2.5 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Deficit Alert:</strong> You are short by <strong>{deficit.protein}g protein</strong> today. Consider adding eggs, milk, or chana from external food below.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-2.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                <strong>Target Complete:</strong> You have reached your daily protein requirement!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Secondary Card: Calories (Col span 5) */}
      <div className="md:col-span-5 app-card p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Energy Intake
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {caloriesMetPercentage}%
            </span>
          </div>

          <div className="my-1">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {consumed.calories}
            </span>
            <span className="text-sm text-slate-400 font-medium ml-1.5">
              / {target.calories} kcal
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-3">
            <div
              className="h-full rounded-full bg-slate-800 dark:bg-slate-300 transition-all duration-300"
              style={{ width: `${Math.min(100, caloriesMetPercentage)}%` }}
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>Calculation Standard</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">Mifflin-St Jeor</span>
        </div>
      </div>

      {/* 3. Mini Stat: Carbs (Col span 4) */}
      <div className="md:col-span-4 app-card p-4">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">Carbohydrates</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-slate-900 dark:text-white">{consumed.carbs}g</span>
          <span className="text-xs text-slate-400">/ ~{target.carbs}g</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Hostel rice, rotis & grains</p>
      </div>

      {/* 4. Mini Stat: Fats (Col span 4) */}
      <div className="md:col-span-4 app-card p-4">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">Dietary Fats</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-slate-900 dark:text-white">{consumed.fats}g</span>
          <span className="text-xs text-slate-400">/ ~{target.fats}g</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Ghee, dals, & gravies</p>
      </div>

      {/* 5. Mini Stat: Fiber (Col span 4) */}
      <div className="md:col-span-4 app-card p-4">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">Dietary Fiber</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-slate-900 dark:text-white">{consumed.fiber}g</span>
          <span className="text-xs text-slate-400">/ 30g target</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Fresh salads & fruits</p>
      </div>
    </div>
  );
};
