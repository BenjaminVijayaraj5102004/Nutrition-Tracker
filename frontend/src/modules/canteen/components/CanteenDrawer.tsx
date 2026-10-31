import React from 'react';
import { FoodItem } from '../../../core/types/nutrition';
import { CANTEEN_SUPPLEMENTS } from '../../../core/data/foodDatabase';
import { Zap, Plus, Flame, Sparkles } from 'lucide-react';

interface CanteenDrawerProps {
  onQuickAdd: (food: FoodItem) => void;
  activeCounts: Record<string, number>;
}

export const CanteenDrawer: React.FC<CanteenDrawerProps> = ({
  onQuickAdd,
  activeCounts,
}) => {
  return (
    <div className="w-full bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900/95 border border-violet-500/30 rounded-2xl p-4 md:p-5 relative overflow-hidden shadow-xl backdrop-blur-md">
      {/* Decorative neon glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-slate-950">
            <Zap className="w-4 h-4 fill-slate-950" />
          </div>
          <div>
            <h3 className="font-black text-sm md:text-base text-white flex items-center gap-1.5">
              1-CLICK CANTEEN SUPPLEMENTS
              <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Instant Fix
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Hostel canteen staples to bridge your daily protein & calorie deficit in 1 tap!
            </p>
          </div>
        </div>
      </div>

      {/* Quick Add Pills / Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {CANTEEN_SUPPLEMENTS.map((food: FoodItem) => {
          const count = activeCounts[food.id] || 0;

          return (
            <button
              key={food.id}
              onClick={() => onQuickAdd(food)}
              className="group relative flex flex-col justify-between p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-violet-400/60 transition-all duration-200 text-left active:scale-95 shadow-sm hover:shadow-[0_0_15px_rgba(139,92,246,0.25)]"
            >
              {/* Badge if logged */}
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full border border-slate-900 shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                  +{count}
                </span>
              )}

              <div>
                <div className="flex items-center justify-between text-[9px] uppercase font-bold text-violet-400 mb-1">
                  <span>{food.animeTag || 'Canteen Fix'}</span>
                  <span className="text-slate-500">{food.defaultServing}</span>
                </div>
                <div className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {food.name}
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-850 flex items-center justify-between">
                <div className="font-mono text-[11px]">
                  <span className="font-bold text-cyan-400">+{food.protein}g P</span>
                  <span className="text-slate-500 mx-1">•</span>
                  <span className="text-emerald-400">{food.calories} kcal</span>
                </div>

                <div className="w-6 h-6 rounded-lg bg-violet-600/30 group-hover:bg-violet-600 text-violet-300 group-hover:text-white flex items-center justify-center transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
