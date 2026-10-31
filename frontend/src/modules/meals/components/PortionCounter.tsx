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
      className={`border-3 border-black p-3.5 transition-all rounded-lg ${
        isSelected
          ? 'bg-[#fef9c3] shadow-[4px_4px_0_0_#000]'
          : 'bg-white shadow-[3px_3px_0_0_#000] hover:shadow-[4px_4px_0_0_#000]'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 border border-black ${
                food.isVeg ? 'bg-[#22c55e]' : 'bg-[#ef4444]'
              }`}
              title={food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            />
            <h4 className="text-xs font-black text-black leading-tight uppercase">
              {food.name}
            </h4>
          </div>
          {food.hindiName && (
            <p className="text-[11px] font-bold text-black/60 ml-4">
              {food.hindiName}
            </p>
          )}
        </div>

        <span className="text-[10px] font-black uppercase text-black bg-white border-2 border-black px-1.5 py-0.5 shadow-[1.5px_1.5px_0_0_#000]">
          {food.defaultServing}
        </span>
      </div>

      {/* Nutrients Per Serving */}
      <div className="flex items-center gap-2 text-[11px] font-black text-black mb-3 bg-white border-2 border-black p-1.5 shadow-[2px_2px_0_0_#000]">
        <div>
          <span className="text-[8px] uppercase block text-black/60">PROT</span>
          <span className="text-[#059669] font-mono">{food.protein}g</span>
        </div>
        <div className="w-[1.5px] h-4 bg-black" />
        <div>
          <span className="text-[8px] uppercase block text-black/60">CALS</span>
          <span className="text-black font-mono">{food.calories}</span>
        </div>
        <div className="w-[1.5px] h-4 bg-black" />
        <div>
          <span className="text-[8px] uppercase block text-black/60">CARB</span>
          <span className="text-black font-mono">{food.carbs}g</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase text-black">
          {count > 0 ? (
            <span className="bg-[#bbf7d0] border border-black px-1.5 py-0.5">
              {count} LOGGED
            </span>
          ) : (
            <span className="text-black/50">0 LOGGED</span>
          )}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={onDecrement}
            disabled={count === 0}
            className={`w-7 h-7 border-2 border-black font-black flex items-center justify-center transition-all ${
              count > 0
                ? 'bg-white text-black neo-btn hover:bg-slate-100'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-300'
            }`}
          >
            <Minus className="w-3.5 h-3.5 stroke-[3]" />
          </button>

          <span className="w-6 text-center font-black font-mono text-xs text-black">
            {count}
          </span>

          <button
            onClick={onIncrement}
            className="w-7 h-7 bg-[#facc15] text-black border-2 border-black font-black neo-btn flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
