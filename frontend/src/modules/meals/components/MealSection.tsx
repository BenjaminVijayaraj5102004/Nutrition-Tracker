import React from 'react';
import { FoodItem, MealCategory } from '../../../core/types/nutrition';
import { PortionCounter } from './PortionCounter';
import { Utensils, Coffee, Sun, Sunset, Moon } from 'lucide-react';

interface MealSectionProps {
  category: MealCategory;
  title: string;
  foodItems: FoodItem[];
  portionCounts: Record<string, number>;
  onIncrement: (foodId: string) => void;
  onDecrement: (foodId: string) => void;
}

export const MealSection: React.FC<MealSectionProps> = ({
  category,
  title,
  foodItems,
  portionCounts,
  onIncrement,
  onDecrement,
}) => {
  const getCategoryIcon = () => {
    switch (category) {
      case 'breakfast':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'lunch':
        return <Utensils className="w-4 h-4 text-cyan-400" />;
      case 'snacks':
        return <Coffee className="w-4 h-4 text-purple-400" />;
      case 'dinner':
        return <Moon className="w-4 h-4 text-indigo-400" />;
    }
  };

  const totalMealCalories = foodItems.reduce((acc, food) => {
    const count = portionCounts[food.id] || 0;
    return acc + food.calories * count;
  }, 0);

  const totalMealProtein = foodItems.reduce((acc, food) => {
    const count = portionCounts[food.id] || 0;
    return acc + food.protein * count;
  }, 0);

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
            {getCategoryIcon()}
          </div>
          <div>
            <h3 className="font-extrabold text-sm md:text-base text-white tracking-wide">
              {title}
            </h3>
            <span className="text-[10px] text-slate-400">
              Hostel Mess Menu
            </span>
          </div>
        </div>

        {/* Subtotal of this meal */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 font-bold">
            {totalMealCalories} kcal
          </span>
          <span className="px-2 py-0.5 rounded-md bg-cyan-950/40 border border-cyan-800/50 text-cyan-400 font-bold">
            {Math.round(totalMealProtein * 10) / 10}g P
          </span>
        </div>
      </div>

      {/* Grid of portion counters */}
      {foodItems.length === 0 ? (
        <div className="py-6 text-center text-slate-500 text-xs">
          No items scheduled for this meal. Add dishes or scan your mess menu!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {foodItems.map((food) => (
            <PortionCounter
              key={food.id}
              food={food}
              count={portionCounts[food.id] || 0}
              onIncrement={() => onIncrement(food.id)}
              onDecrement={() => onDecrement(food.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
