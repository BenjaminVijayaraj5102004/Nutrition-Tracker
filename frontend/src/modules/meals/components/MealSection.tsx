import React from 'react';
import { FoodItem, MealCategory } from '../../../core/types/nutrition';
import { PortionCounter } from './PortionCounter';
import { Coffee, Sun, Utensils, Moon } from 'lucide-react';

interface MealSectionProps {
  category: MealCategory;
  foods: FoodItem[];
  dayPortions: Record<string, number>;
  onIncrement: (foodId: string) => void;
  onDecrement: (foodId: string) => void;
}

const CATEGORY_META: Record<
  MealCategory,
  { title: string; subtitle: string; bg: string; icon: React.ReactNode }
> = {
  breakfast: {
    title: 'BREAKFAST',
    subtitle: '7:30 AM – 9:30 AM',
    bg: '#fef08a',
    icon: <Coffee className="w-4 h-4 text-black stroke-[2.5]" />,
  },
  lunch: {
    title: 'LUNCH',
    subtitle: '12:30 PM – 2:30 PM',
    bg: '#fed7aa',
    icon: <Sun className="w-4 h-4 text-black stroke-[2.5]" />,
  },
  snacks: {
    title: 'EVENING SNACKS',
    subtitle: '4:45 PM – 6:15 PM',
    bg: '#e9d5ff',
    icon: <Utensils className="w-4 h-4 text-black stroke-[2.5]" />,
  },
  dinner: {
    title: 'DINNER',
    subtitle: '7:45 PM – 9:45 PM',
    bg: '#bae6fd',
    icon: <Moon className="w-4 h-4 text-black stroke-[2.5]" />,
  },
};

export const MealSection: React.FC<MealSectionProps> = ({
  category,
  foods,
  dayPortions,
  onIncrement,
  onDecrement,
}) => {
  const meta = CATEGORY_META[category];

  return (
    <section className="bg-white border-4 border-black p-4 sm:p-5 shadow-[6px_6px_0px_0px_#000] rounded-xl">
      {/* Meal Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-black">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000]"
            style={{ backgroundColor: meta.bg }}
          >
            {meta.icon}
          </div>
          <div>
            <h3 className="text-sm font-black text-black tracking-tight uppercase">
              {meta.title}
            </h3>
            <p className="text-[10px] font-bold text-black/60 uppercase">
              {meta.subtitle}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-black uppercase bg-black text-white px-2 py-0.5">
          {foods.length} ITEMS
        </span>
      </div>

      {/* Foods Grid */}
      {foods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {foods.map((food) => (
            <PortionCounter
              key={food.id}
              food={food}
              count={dayPortions[food.id] || 0}
              onIncrement={() => onIncrement(food.id)}
              onDecrement={() => onDecrement(food.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-xs font-bold text-black/40 uppercase">
          NO ITEMS SCHEDULED FOR THIS MEAL.
        </div>
      )}
    </section>
  );
};
