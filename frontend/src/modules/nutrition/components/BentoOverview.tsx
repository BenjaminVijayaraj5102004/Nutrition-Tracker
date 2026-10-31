import React from 'react';
import { DeficitAnalysis } from '../../../core/types/nutrition';
import { AlertCircle, CheckCircle2, Zap, ArrowRight, ShieldAlert } from 'lucide-react';

interface BentoOverviewProps {
  analysis: DeficitAnalysis;
  onOpenScanner: () => void;
}

export const BentoOverview: React.FC<BentoOverviewProps> = ({ analysis, onOpenScanner }) => {
  const { target, consumed, deficit, proteinMetPercentage, caloriesMetPercentage } = analysis;
  const isProteinDeficit = deficit.protein > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* 1. Hero Brutalist Cell: Protein Target (Col span 7) */}
      <div className="md:col-span-7 bg-[#a7f3d0] border-4 border-black p-5 shadow-[6px_6px_0px_0px_#000] rounded-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider bg-black text-white px-2.5 py-1 rounded-sm shadow-[2px_2px_0_0_#000]">
              PROTEIN TARGET • PRIORITY #1
            </span>
            <span className="text-sm font-black bg-white border-2 border-black px-2 py-0.5 shadow-[2px_2px_0_0_#000]">
              {proteinMetPercentage}% MET
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl sm:text-5xl font-black text-black tracking-tight font-mono">
              {consumed.protein}g
            </span>
            <span className="text-sm font-black text-black/70 uppercase">
              / {target.protein}g TARGET
            </span>
          </div>

          {/* Neo-brutalist Progress Track */}
          <div className="w-full bg-white border-3 border-black h-5 rounded-md overflow-hidden p-0.5 shadow-[2px_2px_0_0_#000] mb-3">
            <div
              className="h-full bg-[#f43f5e] border-r-2 border-black transition-all duration-200"
              style={{ width: `${Math.min(100, proteinMetPercentage)}%` }}
            />
          </div>
        </div>

        {/* Action Callout */}
        <div>
          {isProteinDeficit ? (
            <div className="bg-[#fee2e2] border-3 border-black p-3 rounded-lg shadow-[3px_3px_0_0_#000] flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs font-black text-black">
                <span className="uppercase text-rose-700">DEFICIT WARNING:</span> You are short by <span className="underline decoration-2">{deficit.protein}g protein</span> today! Add boiled eggs, milk, or chana from the canteen below.
              </div>
            </div>
          ) : (
            <div className="bg-[#bbf7d0] border-3 border-black p-3 rounded-lg shadow-[3px_3px_0_0_#000] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span className="text-xs font-black text-black uppercase">
                GOAL SMASHED! +{Math.abs(deficit.protein)}g SURPLUS ACHIEVED!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Secondary Brutalist Cell: Calories (Col span 5) */}
      <div className="md:col-span-5 bg-[#bae6fd] border-4 border-black p-5 shadow-[6px_6px_0px_0px_#000] rounded-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-sm shadow-[2px_2px_0_0_#000]">
              DAILY CALORIES
            </span>
            <span className="text-xs font-black bg-white border-2 border-black px-2 py-0.5">
              {caloriesMetPercentage}%
            </span>
          </div>

          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-black text-black tracking-tight font-mono">
              {consumed.calories}
            </span>
            <span className="text-xs font-black text-black/70 ml-1 uppercase">
              / {target.calories} KCAL
            </span>
          </div>

          <div className="w-full bg-white border-3 border-black h-4 rounded-md overflow-hidden p-0.5 shadow-[2px_2px_0_0_#000] mb-3">
            <div
              className="h-full bg-[#38bdf8] border-r-2 border-black transition-all duration-200"
              style={{ width: `${Math.min(100, caloriesMetPercentage)}%` }}
            />
          </div>
        </div>

        <div className="pt-2 border-t-2 border-black flex items-center justify-between text-[11px] font-black uppercase text-black">
          <span>Calculation Model</span>
          <span className="bg-white border-2 border-black px-1.5 py-0.5">Mifflin-St Jeor</span>
        </div>
      </div>

      {/* 3. Brutal Mini Cell: Carbs (Col span 4) */}
      <div className="md:col-span-4 bg-[#fef08a] border-4 border-black p-4 shadow-[5px_5px_0px_0px_#000] rounded-xl">
        <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-sm">
          CARBOHYDRATES
        </span>
        <div className="mt-2 text-2xl font-black font-mono text-black">
          {consumed.carbs}g <span className="text-xs text-black/60 font-sans font-bold">/ ~{target.carbs}g</span>
        </div>
        <p className="text-[11px] font-bold text-black/70 mt-1 uppercase">Rice, rotis, grains</p>
      </div>

      {/* 4. Brutal Mini Cell: Fats (Col span 4) */}
      <div className="md:col-span-4 bg-[#fed7aa] border-4 border-black p-4 shadow-[5px_5px_0px_0px_#000] rounded-xl">
        <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-sm">
          DIETARY FATS
        </span>
        <div className="mt-2 text-2xl font-black font-mono text-black">
          {consumed.fats}g <span className="text-xs text-black/60 font-sans font-bold">/ ~{target.fats}g</span>
        </div>
        <p className="text-[11px] font-bold text-black/70 mt-1 uppercase">Ghee, dals, oils</p>
      </div>

      {/* 5. Brutal Mini Cell: Fiber (Col span 4) */}
      <div className="md:col-span-4 bg-[#e9d5ff] border-4 border-black p-4 shadow-[5px_5px_0px_0px_#000] rounded-xl">
        <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-sm">
          DIETARY FIBER
        </span>
        <div className="mt-2 text-2xl font-black font-mono text-black">
          {consumed.fiber}g <span className="text-xs text-black/60 font-sans font-bold">/ 30g TARGET</span>
        </div>
        <p className="text-[11px] font-bold text-black/70 mt-1 uppercase">Mess fruits & veggies</p>
      </div>
    </div>
  );
};
