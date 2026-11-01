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
      className={`rounded-xl p-3 transition-all ${
        isSelected
          ? 'bg-yellow-100/90 dark:bg-yellow-950/40 border-[2.5px] border-[var(--card-border)] shadow-[3.5px_3.5px_0px_var(--card-shadow)] -translate-y-0.5'
          : 'bg-[var(--card-surface)] border-2 border-[var(--card-border)] shadow-[2.5px_2.5px_0px_var(--card-shadow)] hover:shadow-[3.5px_3.5px_0px_var(--card-shadow)] hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 border border-black dark:border-white ${
                food.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
              }`}
              title={food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            />
            <h4 className="text-xs font-black text-[var(--text-primary)] leading-snug line-clamp-1">
              {food.name}
            </h4>
          </div>
          {food.hindiName && (
            <p className="text-[10px] font-bold text-[var(--text-muted)] ml-4 line-clamp-1">
              {food.hindiName}
            </p>
          )}
        </div>

        <span className="text-[10px] font-bold text-[var(--text-primary)] bg-black/5 dark:bg-white/10 border border-[var(--card-border)] px-1.5 py-0.5 rounded-md shrink-0">
          {food.defaultServing}
        </span>
      </div>

      {/* Nutrients Per Serving */}
      <div className="flex items-center justify-between text-[10px] mb-2.5 bg-black/5 dark:bg-white/5 px-2 py-1.5 rounded-lg border border-[var(--card-border)] font-mono">
        <div>
          <span className="text-[var(--text-muted)] block text-[8px] uppercase font-black">Prot</span>
          <span className="font-black text-emerald-600 dark:text-emerald-400">{food.protein}g</span>
        </div>
        <div className="w-px h-4 bg-[var(--card-border)]" />
        <div>
          <span className="text-[var(--text-muted)] block text-[8px] uppercase font-black">Cals</span>
          <span className="font-black text-[var(--text-primary)]">{food.calories}</span>
        </div>
        <div className="w-px h-4 bg-[var(--card-border)]" />
        <div>
          <span className="text-[var(--text-muted)] block text-[8px] uppercase font-black">Carb</span>
          <span className="font-bold text-[var(--text-secondary)]">{food.carbs}g</span>
        </div>
      </div>

      {/* Counter Controls */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-[var(--text-muted)]">
          {count > 0 ? (
            <span className="font-black text-black bg-yellow-400 border border-[var(--card-border)] px-1.5 py-0.2 rounded-md shadow-[1px_1px_0px_var(--card-shadow)] font-mono text-[10px]">
              {count} logged
            </span>
          ) : (
            'Not logged'
          )}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={onDecrement}
            disabled={count === 0}
            className={`w-7 h-7 rounded-lg border-2 border-[var(--card-border)] shadow-[1.5px_1.5px_0px_var(--card-shadow)] flex items-center justify-center transition-all ${
              count > 0
                ? 'bg-[var(--card-surface)] text-[var(--text-primary)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer'
                : 'text-[var(--text-muted)] opacity-30 cursor-not-allowed border-dashed'
            }`}
          >
            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          <span className="w-6 text-center font-black text-xs text-[var(--text-primary)] font-mono">
            {count}
          </span>

          <button
            onClick={onIncrement}
            className="w-7 h-7 rounded-lg bg-yellow-400 text-black border-2 border-[var(--card-border)] shadow-[1.5px_1.5px_0px_var(--card-shadow)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center transition-all cursor-pointer font-black"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
