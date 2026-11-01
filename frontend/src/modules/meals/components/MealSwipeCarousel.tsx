import React, { useState } from 'react';
import { FoodItem, MealCategory } from '../../../core/types/nutrition';
import { PortionCounter } from './PortionCounter';
import { Coffee, Sun, Utensils, Moon, ChevronLeft, ChevronRight } from 'lucide-react';

interface MealSwipeCarouselProps {
  scheduleForDay: {
    breakfast: FoodItem[];
    lunch: FoodItem[];
    snacks: FoodItem[];
    dinner: FoodItem[];
  };
  dayPortions: Record<string, number>;
  onIncrement: (foodId: string) => void;
  onDecrement: (foodId: string) => void;
}

const MEAL_TABS: { key: MealCategory; label: string; time: string; icon: React.ReactNode; color: string }[] = [
  {
    key: 'breakfast',
    label: 'Breakfast',
    time: '7:30 AM – 9:30 AM',
    icon: <Coffee className="w-4 h-4 text-amber-500" />,
    color: 'border-amber-400',
  },
  {
    key: 'lunch',
    label: 'Lunch',
    time: '12:30 PM – 2:30 PM',
    icon: <Sun className="w-4 h-4 text-orange-500" />,
    color: 'border-orange-400',
  },
  {
    key: 'snacks',
    label: 'Evening Snacks',
    time: '4:45 PM – 6:15 PM',
    icon: <Utensils className="w-4 h-4 text-indigo-500" />,
    color: 'border-indigo-400',
  },
  {
    key: 'dinner',
    label: 'Dinner',
    time: '7:45 PM – 9:45 PM',
    icon: <Moon className="w-4 h-4 text-sky-500" />,
    color: 'border-sky-400',
  },
];

export const MealSwipeCarousel: React.FC<MealSwipeCarouselProps> = ({
  scheduleForDay,
  dayPortions,
  onIncrement,
  onDecrement,
}) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const activeMeal = MEAL_TABS[activeCategoryIndex];
  const activeFoods = scheduleForDay[activeMeal.key] || [];

  const handlePrev = () => {
    setActiveCategoryIndex((prev) => (prev > 0 ? prev - 1 : MEAL_TABS.length - 1));
  };

  const handleNext = () => {
    setActiveCategoryIndex((prev) => (prev < MEAL_TABS.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full space-y-3">
      {/* Swipe / Segmented Meal Selector Bar */}
      <div className="flex items-center justify-between gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
        <button
          onClick={handlePrev}
          className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-colors"
          title="Previous Meal"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 flex-1 overflow-x-auto no-scrollbar">
          {MEAL_TABS.map((tab, idx) => {
            const isSelected = activeCategoryIndex === idx;
            const itemsCount = (scheduleForDay[tab.key] || []).length;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveCategoryIndex(idx)}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  {itemsCount}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-colors"
          title="Next Meal"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Active Meal Section Card */}
      <section className="app-card p-4 sm:p-5 transition-all">
        {/* Meal Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
              {activeMeal.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {activeMeal.label}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Timing: {activeMeal.time}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
              Swipe or tap tabs above to switch meals
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {activeFoods.length} items
            </span>
          </div>
        </div>

        {/* Swipeable / Grid Food Items */}
        {activeFoods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeFoods.map((food) => (
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
          <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500">
            No items scheduled for this meal on this day.
          </div>
        )}
      </section>
    </div>
  );
};
