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
      {/* Swipe / Segmented Meal Selector Bar */}
      <div className="flex items-center justify-between gap-2 bg-[var(--card-surface)] p-1.5 rounded-2xl border border-[var(--card-border)] backdrop-blur-md">
        <button
          onClick={handlePrev}
          className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-border)]/50 transition-colors"
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
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-border)]/40'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white font-bold' : 'bg-[var(--card-border)]/60 text-[var(--text-muted)]'}`}>
                  {itemsCount}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-border)]/50 transition-colors"
          title="Next Meal"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Active Meal Section Card */}
      <section className="futurism-card p-4 sm:p-5 transition-all">
        {/* Meal Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              {activeMeal.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                {activeMeal.label}
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Timing: {activeMeal.time}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] font-medium hidden sm:inline">
              Swipe or tap tabs above to switch meals
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--card-border)]/50 text-[var(--text-primary)] border border-[var(--card-border)]">
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
