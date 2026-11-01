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
          ? 'bg-indigo-500/10 border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.12)]'
          : 'bg-[var(--card-surface)] border-[var(--card-border)] hover:border-indigo-500/30'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                food.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
              }`}
              title={food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            />
            <h4 className="text-xs font-semibold text-[var(--text-primary)] leading-snug line-clamp-1">
              {food.name}
            </h4>
          </div>
          {food.hindiName && (
            <p className="text-[10px] text-[var(--text-muted)] ml-3.5 line-clamp-1">
              {food.hindiName}
            </p>
          )}
        </div>

        <span className="text-[10px] font-medium text-[var(--text-muted)] bg-[var(--card-border)]/40 px-1.5 py-0.5 rounded shrink-0">
          {food.defaultServing}
        </span>
      </div>

      {/* Nutrients Per Serving */}
      <div className="flex items-center gap-2.5 text-[10px] text-[var(--text-secondary)] mb-2.5 bg-[var(--card-border)]/20 px-2 py-1.5 rounded-lg border border-[var(--card-border)]">
        <div>
          <span className="text-[var(--text-muted)] block text-[8px] uppercase font-semibold">Prot</span>
          <span className="font-semibold text-emerald-500 dark:text-emerald-400">{food.protein}g</span>
        </div>
        <div className="w-px h-3.5 bg-[var(--card-border)]" />
        <div>
          <span className="text-[var(--text-muted)] block text-[8px] uppercase font-semibold">Cals</span>
          <span className="font-semibold text-[var(--text-primary)]">{food.calories}</span>
        </div>
        <div className="w-px h-3.5 bg-[var(--card-border)]" />
        <div>
          <span className="text-[var(--text-muted)] block text-[8px] uppercase font-semibold">Carb</span>
          <span className="font-medium text-[var(--text-secondary)]">{food.carbs}g</span>
        </div>
      </div>

      {/* Counter Controls */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[var(--text-muted)]">
          {count > 0 ? (
            <span className="font-semibold text-indigo-500 dark:text-indigo-400">
              {count} logged
            </span>
          ) : (
            'Not logged'
          )}
        </span>

        <div className="flex items-center gap-1 bg-[var(--card-border)]/50 p-0.5 rounded-lg border border-[var(--card-border)]">
          <button
            onClick={onDecrement}
            disabled={count === 0}
            className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
              count > 0
                ? 'bg-[var(--card-surface)] text-[var(--text-primary)] shadow-xs hover:bg-[var(--card-border)]'
                : 'text-[var(--text-muted)] opacity-40 cursor-not-allowed'
            }`}
          >
            <Minus className="w-3 h-3" />
          </button>

          <span className="w-6 text-center font-semibold text-xs text-[var(--text-primary)] font-mono">
            {count}
          </span>

          <button
            onClick={onIncrement}
            className="w-6 h-6 rounded bg-[var(--card-surface)] text-[var(--text-primary)] shadow-xs hover:bg-[var(--card-border)] flex items-center justify-center transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
