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
      className={`rounded-xl border p-3.5 transition-all ${
        isSelected
          ? 'bg-indigo-50/40 border-indigo-200'
          : 'bg-white border-slate-200/90 hover:border-slate-300'
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
            <h4 className="text-xs font-semibold text-slate-900 leading-snug">
              {food.name}
            </h4>
          </div>
          {food.hindiName && (
            <p className="text-[11px] text-slate-500 ml-3.5">
              {food.hindiName}
            </p>
          )}
        </div>

        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
          {food.defaultServing}
        </span>
      </div>

      {/* Nutrients Per Serving */}
      <div className="flex items-center gap-3 text-[11px] text-slate-600 mb-3 bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-100">
        <div>
          <span className="text-slate-400 block text-[9px] uppercase font-medium">Protein</span>
          <span className="font-semibold text-slate-800">{food.protein}g</span>
        </div>
        <div className="w-px h-4 bg-slate-200" />
        <div>
          <span className="text-slate-400 block text-[9px] uppercase font-medium">Energy</span>
          <span className="font-semibold text-slate-800">{food.calories} kcal</span>
        </div>
        <div className="w-px h-4 bg-slate-200" />
        <div>
          <span className="text-slate-400 block text-[9px] uppercase font-medium">Carbs</span>
          <span className="text-slate-700">{food.carbs}g</span>
        </div>
      </div>

      {/* Counter Controls */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {count > 0 ? (
            <span className="font-medium text-indigo-700">
              {count} {count === 1 ? 'serving' : 'servings'} logged
            </span>
          ) : (
            'Not logged'
          )}
        </span>

        <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={onDecrement}
            disabled={count === 0}
            className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
              count > 0
                ? 'bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            aria-label="Decrease serving"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          
          <span className="w-7 text-center font-semibold text-xs text-slate-800">
            {count}
          </span>

          <button
            onClick={onIncrement}
            className="w-7 h-7 rounded-md bg-white text-slate-700 hover:bg-slate-50 shadow-2xs flex items-center justify-center transition-colors"
            aria-label="Increase serving"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
