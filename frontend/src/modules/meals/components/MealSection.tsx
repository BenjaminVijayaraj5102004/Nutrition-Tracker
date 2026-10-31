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
  { title: string; subtitle: string; icon: React.ReactNode }
> = {
  breakfast: {
    title: 'Breakfast',
    subtitle: '7:30 AM – 9:30 AM',
    icon: <Coffee className="w-4 h-4 text-amber-600" />,
  },
  lunch: {
    title: 'Lunch',
    subtitle: '12:30 PM – 2:30 PM',
    icon: <Sun className="w-4 h-4 text-orange-500" />,
  },
  snacks: {
    title: 'Evening Snacks',
    subtitle: '4:45 PM – 6:15 PM',
    icon: <Utensils className="w-4 h-4 text-indigo-500" />,
  },
  dinner: {
    title: 'Dinner',
    subtitle: '7:45 PM – 9:45 PM',
    icon: <Moon className="w-4 h-4 text-sky-600" />,
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
    <section className="paper-card p-4 sm:p-5">
      {/* Meal Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
            {meta.icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{meta.title}</h3>
            <p className="text-[11px] text-slate-500">{meta.subtitle}</p>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          {foods.length} items on schedule
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
        <div className="text-center py-6 text-xs text-slate-400">
          No items scheduled for this meal.
        </div>
      )}
    </section>
  );
};
