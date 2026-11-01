import React from 'react';
import { FoodItem } from '../../../core/types/nutrition';
import { Plus, Minus } from 'lucide-react';

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
      className={`rounded-xl border p-3 transition-all ${
        isSelected
          ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-700 shadow-xs'
          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                food.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              title={food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            />
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-1">
              {food.name}
            </h4>
          </div>
          {food.hindiName && (
            <p className="text-[10px] text-slate-500 dark:text-slate-400 ml-3.5 line-clamp-1">
              {food.hindiName}
            </p>
          )}
        </div>

        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-1.5 py-0.5 rounded shrink-0">
          {food.defaultServing}
        </span>
      </div>

      {/* Nutrients Per Serving */}
      <div className="flex items-center gap-2.5 text-[10px] text-slate-600 dark:text-slate-300 mb-2.5 bg-slate-50 dark:bg-slate-900/50 px-2 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-slate-400 dark:text-slate-500 block text-[8px] uppercase font-semibold">Prot</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{food.protein}g</span>
        </div>
        <div className="w-px h-3.5 bg-slate-200 dark:bg-slate-700" />
        <div>
          <span className="text-slate-400 dark:text-slate-500 block text-[8px] uppercase font-semibold">Cals</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{food.calories}</span>
        </div>
        <div className="w-px h-3.5 bg-slate-200 dark:bg-slate-700" />
        <div>
          <span className="text-slate-400 dark:text-slate-500 block text-[8px] uppercase font-semibold">Carb</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">{food.carbs}g</span>
        </div>
      </div>

      {/* Counter Controls */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          {count > 0 ? (
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {count} logged
            </span>
          ) : (
            'Not logged'
          )}
        </span>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={onDecrement}
            disabled={count === 0}
            className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
              count > 0
                ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700'
                : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <Minus className="w-3 h-3" />
          </button>

          <span className="w-6 text-center font-semibold text-xs text-slate-800 dark:text-slate-200">
            {count}
          </span>

          <button
            onClick={onIncrement}
            className="w-6 h-6 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
