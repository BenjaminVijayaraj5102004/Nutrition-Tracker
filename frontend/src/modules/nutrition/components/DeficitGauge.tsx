import React from 'react';
import { DeficitAnalysis } from '../../../core/types/nutrition';
import { AlertCircle, CheckCircle2, TrendingUp, Info } from 'lucide-react';

interface DeficitGaugeProps {
  analysis: DeficitAnalysis;
}

export const DeficitGauge: React.FC<DeficitGaugeProps> = ({ analysis }) => {
  const { target, consumed, deficit, proteinMetPercentage, caloriesMetPercentage } = analysis;

  const isProteinDeficit = deficit.protein > 0;
  const isCalorieDeficit = deficit.calories > 0;

  return (
    <div className="w-full paper-card p-5">
      {/* Header title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
            Daily Nutritional Balance
          </h2>
          <p className="text-xs text-slate-500">
            Real-time calculation comparing mess meals against your target
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-medium text-slate-500">Protein Completion</span>
          <p className="text-lg font-bold text-slate-900 leading-tight">
            {proteinMetPercentage}%
          </p>
        </div>
      </div>

      {/* Main Protein Progress Bar */}
      <div className="mb-4 bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl">
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-slate-700">
          <span>Protein Intake ({consumed.protein}g of {target.protein}g)</span>
          <span className={isProteinDeficit ? 'text-amber-600 font-semibold' : 'text-emerald-600 font-semibold'}>
            {isProteinDeficit ? `${deficit.protein}g remaining` : 'Target achieved'}
          </span>
        </div>
        
        {/* Progress track */}
        <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              proteinMetPercentage >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'
            }`}
            style={{ width: `${Math.min(100, proteinMetPercentage)}%` }}
          />
        </div>

        {/* Crisp Alert Banner */}
        <div className="mt-2.5">
          {isProteinDeficit ? (
            <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                You are short by <strong>{deficit.protein}g of protein</strong> today. Consider adding eggs, milk, or chana from the campus canteen below.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Protein target reached ({consumed.protein}g / {target.protein}g). Great job meeting your requirement!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Macronutrient Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Calories */}
        <div className="paper-card-subtle p-3">
          <span className="text-slate-500 block mb-0.5">Energy</span>
          <div className="font-semibold text-slate-900 text-sm">
            {consumed.calories} <span className="text-slate-400 font-normal text-xs">/ {target.calories} kcal</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {caloriesMetPercentage}% met
          </div>
        </div>

        {/* Carbohydrates */}
        <div className="paper-card-subtle p-3">
          <span className="text-slate-500 block mb-0.5">Carbohydrates</span>
          <div className="font-semibold text-slate-900 text-sm">
            {consumed.carbs}g <span className="text-slate-400 font-normal text-xs">/ ~{target.carbs}g</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Energy & glycogen
          </div>
        </div>

        {/* Fats */}
        <div className="paper-card-subtle p-3">
          <span className="text-slate-500 block mb-0.5">Healthy Fats</span>
          <div className="font-semibold text-slate-900 text-sm">
            {consumed.fats}g <span className="text-slate-400 font-normal text-xs">/ ~{target.fats}g</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Hormonal balance
          </div>
        </div>

        {/* Fiber */}
        <div className="paper-card-subtle p-3">
          <span className="text-slate-500 block mb-0.5">Dietary Fiber</span>
          <div className="font-semibold text-slate-900 text-sm">
            {consumed.fiber}g <span className="text-slate-400 font-normal text-xs">/ 30g goal</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Digestion & satiety
          </div>
        </div>
      </div>
    </div>
  );
};
