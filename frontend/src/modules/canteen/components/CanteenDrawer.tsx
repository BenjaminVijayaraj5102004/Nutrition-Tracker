import React from 'react';
import { FoodItem } from '../../../core/types/nutrition';
import { ShoppingBag, Plus } from 'lucide-react';

interface CanteenDrawerProps {
  supplements: FoodItem[];
  onQuickAdd: (food: FoodItem) => void;
  dayPortions: Record<string, number>;
}

export const CanteenDrawer: React.FC<CanteenDrawerProps> = ({
  supplements,
  onQuickAdd,
  dayPortions,
}) => {
  return (
    <div className="paper-card p-4 sm:p-5">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Campus Canteen & Store Supplements
            </h3>
            <p className="text-[11px] text-slate-500">
              Quick additions to hit your daily protein and calorie requirements
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline">
          Tap + to log
        </span>
      </div>

      {/* Supplement Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {supplements.map((item) => {
          const loggedCount = dayPortions[item.id] || 0;

          return (
            <div
              key={item.id}
              className="paper-card-subtle p-3 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                    {item.name}
                  </h4>
                </div>
                <div className="text-[11px] text-slate-500 ml-3">
                  +{item.protein}g protein • {item.calories} kcal
                </div>
                {loggedCount > 0 && (
                  <span className="text-[10px] font-medium text-emerald-700 ml-3 block mt-0.5">
                    Logged: {loggedCount}x
                  </span>
                )}
              </div>

              <button
                onClick={() => onQuickAdd(item)}
                className="w-7 h-7 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 flex items-center justify-center transition-colors shrink-0 shadow-2xs"
                title={`Add ${item.name}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
