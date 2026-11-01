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

const MEAL_TABS: { key: MealCategory; label: string; time: string; icon: React.ReactNode }[] = [
  {
    key: 'breakfast',
    label: 'Breakfast',
    time: '7:30 AM – 9:30 AM',
    icon: <Coffee className="w-4 h-4 text-amber-500" />,
  },
  {
    key: 'lunch',
    label: 'Lunch',
    time: '12:30 PM – 2:30 PM',
    icon: <Sun className="w-4 h-4 text-orange-500" />,
  },
  {
    key: 'snacks',
    label: 'Evening Snacks',
    time: '4:45 PM – 6:15 PM',
    icon: <Utensils className="w-4 h-4 text-indigo-500" />,
  },
  {
    key: 'dinner',
    label: 'Dinner',
    time: '7:45 PM – 9:45 PM',
    icon: <Moon className="w-4 h-4 text-sky-500" />,
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
      {/* Swipe / Segmented Meal Selector Bar (Neo-Brutal) */}
      <div className="flex items-center justify-between gap-2 neo-card-static p-1.5">
        <button
          onClick={handlePrev}
          className="w-8 h-8 rounded-lg bg-[var(--card-surface)] border-2 border-[var(--card-border)] shadow-[2px_2px_0px_var(--card-shadow)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center text-[var(--text-primary)] cursor-pointer transition-all"
          title="Previous Meal"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-1.5 flex-1 overflow-x-auto no-scrollbar">
          {MEAL_TABS.map((tab, idx) => {
            const isSelected = activeCategoryIndex === idx;
            const itemsCount = (scheduleForDay[tab.key] || []).length;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveCategoryIndex(idx)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-yellow-400 text-black font-black border-2 border-[var(--card-border)] shadow-[2.5px_2.5px_0px_var(--card-shadow)] -translate-y-0.5'
                    : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5 font-bold border-2 border-transparent text-[var(--text-secondary)]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${isSelected ? 'bg-black text-white font-black' : 'bg-black/10 dark:bg-white/10 text-[var(--text-muted)] font-bold'}`}>
                  {itemsCount}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="w-8 h-8 rounded-lg bg-[var(--card-surface)] border-2 border-[var(--card-border)] shadow-[2px_2px_0px_var(--card-shadow)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center text-[var(--text-primary)] cursor-pointer transition-all"
          title="Next Meal"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Active Meal Section Card (Neo-Brutal) */}
      <section className="neo-card-static p-4 sm:p-5 transition-all">
        {/* Meal Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[var(--card-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-yellow-400 text-black border-2 border-[var(--card-border)] shadow-[2px_2px_0px_var(--card-shadow)] flex items-center justify-center font-black">
              {activeMeal.icon}
            </div>
            <div>
              <h3 className="text-base font-black text-[var(--text-primary)]">
                {activeMeal.label}
              </h3>
              <p className="text-[11px] font-bold text-[var(--text-muted)]">
                Timing: {activeMeal.time}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] font-bold hidden sm:inline">
              Swipe or tap tabs above to switch meals
            </span>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-cyan-300 text-black border-1.5 border-[var(--card-border)] shadow-[1.5px_1.5px_0px_var(--card-shadow)] font-mono">
              {activeFoods.length} items
            </span>
          </div>
        </div>

        {/* Swipeable Food Items */}
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
          <div className="text-center py-8 text-xs text-[var(--text-muted)]">
            No items scheduled for this meal on this day.
          </div>
        )}
      </section>
    </div>
  );
};
