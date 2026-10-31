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
    <div className="bg-[#fef9c3] border-4 border-black p-4 sm:p-5 shadow-[6px_6px_0px_0px_#000] rounded-xl">
      <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black text-[#facc15] flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000]">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-black uppercase tracking-tight">
              CAMPUS CANTEEN & QUICK SUPPLEMENTS
            </h3>
            <p className="text-[11px] font-bold text-black/70 uppercase">
              TAP + TO BRIDGE YOUR DAILY DEFICIT INSTANTLY
            </p>
          </div>
        </div>

        <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 hidden sm:inline">
          1-CLICK QUICK ADD
        </span>
      </div>

      {/* Supplement Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {supplements.map((item) => {
          const loggedCount = dayPortions[item.id] || 0;

          return (
            <div
              key={item.id}
              className="bg-white border-3 border-black p-3 shadow-[3px_3px_0_0_#000] flex items-center justify-between gap-3 hover:shadow-[4px_4px_0_0_#000] transition-all"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 border border-black ${
                      item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  <h4 className="text-xs font-black text-black uppercase leading-tight">
                    {item.name}
                  </h4>
                </div>
                <div className="text-[11px] font-bold text-black/70 ml-3.5 mt-0.5">
                  <span className="text-emerald-700 font-mono font-black">+{item.protein}g PROT</span> • {item.calories} CALS
                </div>
                {loggedCount > 0 && (
                  <span className="text-[9px] font-black uppercase text-emerald-800 bg-[#bbf7d0] border border-black px-1.5 py-0.2 ml-3.5 inline-block mt-1">
                    LOGGED: {loggedCount}X
                  </span>
                )}
              </div>

              <button
                onClick={() => onQuickAdd(item)}
                className="w-8 h-8 bg-[#facc15] border-2 border-black text-black font-black flex items-center justify-center neo-btn shrink-0"
                title={`Add ${item.name}`}
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
