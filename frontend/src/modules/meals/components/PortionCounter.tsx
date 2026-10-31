import React from 'react';
import { FoodItem } from '../../../core/types/nutrition';
import { Plus, Minus, Flame, Sparkles } from 'lucide-react';

interface PortionCounterProps {
  food: FoodItem;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const PortionCounter: React.FC<PortionCounterProps> = ({
  food,
  count,
  onIncrement,
  onDecrement,
}) => {
  const isSelected = count > 0;

  return (
    <div
      className={`relative rounded-xl border p-3 transition-all duration-200 ${
        isSelected
          ? 'bg-slate-900/90 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30'
          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
      }`}
    >
      {/* Anime tag or badge */}
      {food.animeTag && (
        <span className="absolute -top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-violet-950 border border-violet-500/50 text-violet-300">
          {food.animeTag}
        </span>
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                food.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
              }`}
              title={food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            />
            <h4 className="text-xs md:text-sm font-bold text-white leading-tight">
              {food.name}
            </h4>
          </div>
          {food.hindiName && (
            <p className="text-[10px] text-slate-400 font-medium ml-3.5">
              {food.hindiName}
            </p>
          )}
        </div>

        {/* Serving Unit Indicator */}
        <span className="text-[10px] text-slate-400 font-medium bg-slate-800/60 px-1.5 py-0.5 rounded">
          {food.defaultServing}
        </span>
      </div>

      {/* Macros overview */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300 mb-2.5">
        <span className="text-emerald-400 font-semibold">
          {food.calories * (count || 1)} kcal
        </span>
        <span className="text-slate-600">•</span>
        <span className="text-cyan-400 font-semibold">
          {Math.round(food.protein * (count || 1) * 10) / 10}g P
        </span>
        <span className="text-slate-600">•</span>
        <span className="text-amber-400">
          {Math.round(food.carbs * (count || 1) * 10) / 10}g C
        </span>
      </div>

      {/* Portion Controls: Minus / Count / Plus */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
        <button
          onClick={onDecrement}
          disabled={count <= 0}
          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
            count > 0
              ? 'bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-200 active:scale-90 border border-slate-700'
              : 'bg-slate-900/50 text-slate-600 cursor-not-allowed border border-slate-900'
          }`}
          aria-label={`Decrease portion of ${food.name}`}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-baseline gap-1">
          <span
            className={`text-base font-black font-mono transition-colors ${
              isSelected ? 'text-cyan-400' : 'text-slate-500'
            }`}
          >
            {count}
          </span>
          <span className="text-[10px] text-slate-500 uppercase font-semibold">
            {food.servingUnit}
          </span>
        </div>

        <button
          onClick={onIncrement}
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-md shadow-cyan-950/40 active:scale-90 transition-all border border-cyan-400/40"
          aria-label={`Increase portion of ${food.name}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
