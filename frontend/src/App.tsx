import React, { useState, useEffect, useMemo } from 'react';
import {
  DayOfWeek,
  UserProfile,
  FoodItem,
  WeeklyMessSchedule,
} from './core/types/nutrition';
import {
  INDIAN_MESS_FOOD_DATABASE,
  CANTEEN_SUPPLEMENTS,
} from './core/data/foodDatabase';
import { DEFAULT_WEEKLY_MESS_SCHEDULE } from './core/data/defaultSchedule';
import { ServiceFactory } from './core/services/ServiceFactory';

import { ProfileBar } from './modules/profile/components/ProfileBar';
import { BentoOverview } from './modules/nutrition/components/BentoOverview';
import { MessCalendarTabs } from './modules/calendar/components/MessCalendarTabs';
import { MealSection } from './modules/meals/components/MealSection';
import { CanteenDrawer } from './modules/canteen/components/CanteenDrawer';
import { ScannerModal } from './modules/scanner/components/ScannerModal';

import {
  Camera,
  RotateCcw,
} from 'lucide-react';

const STORAGE_KEYS = {
  PROFILE: 'user_profile_v2',
  SCHEDULE: 'weekly_mess_schedule_v2',
  DAILY_PORTIONS: 'daily_portions_',
};

export const App: React.FC = () => {
  const storageService = ServiceFactory.getStorageService();
  const calculatorService = ServiceFactory.getCalculatorService();

  const getTodayDayOfWeek = (): DayOfWeek => {
    const days: DayOfWeek[] = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    return days[new Date().getDay()];
  };

  const todayDay = useMemo(() => getTodayDayOfWeek(), []);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayDay);

  const [profile, setProfile] = useState<UserProfile>(() => {
    const initialTargets = calculatorService.calculateDailyTargets(65, 172, 'male', 'muscle_gain');
    return storageService.getItem<UserProfile>(STORAGE_KEYS.PROFILE, {
      weightKg: 65,
      heightCm: 172,
      gender: 'male',
      goal: 'muscle_gain',
      activityLevel: 'moderate',
      dailyTargets: initialTargets,
      streakDays: 4,
      lastActiveDate: new Date().toISOString().split('T')[0],
    });
  });

  const [schedule, setSchedule] = useState<WeeklyMessSchedule>(() => {
    return storageService.getItem<WeeklyMessSchedule>(
      STORAGE_KEYS.SCHEDULE,
      DEFAULT_WEEKLY_MESS_SCHEDULE
    );
  });

  const [dayPortions, setDayPortions] = useState<Record<string, number>>(() => {
    return storageService.getItem<Record<string, number>>(
      `${STORAGE_KEYS.DAILY_PORTIONS}${todayDay}`,
      {}
    );
  });

  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const merged = { ...prev, ...updates };
      merged.dailyTargets = calculatorService.calculateDailyTargets(
        merged.weightKg,
        merged.heightCm,
        merged.gender,
        merged.goal
      );
      storageService.setItem(STORAGE_KEYS.PROFILE, merged);
      return merged;
    });
  };

  const handleSelectDay = (day: DayOfWeek) => {
    setSelectedDay(day);
    const loaded = storageService.getItem<Record<string, number>>(
      `${STORAGE_KEYS.DAILY_PORTIONS}${day}`,
      {}
    );
    setDayPortions(loaded);
  };

  const handleIncrementPortion = (foodId: string) => {
    setDayPortions((prev) => {
      const current = prev[foodId] || 0;
      const next = { ...prev, [foodId]: current + 1 };
      storageService.setItem(`${STORAGE_KEYS.DAILY_PORTIONS}${selectedDay}`, next);
      return next;
    });
  };

  const handleDecrementPortion = (foodId: string) => {
    setDayPortions((prev) => {
      const current = prev[foodId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[foodId];
        storageService.setItem(`${STORAGE_KEYS.DAILY_PORTIONS}${selectedDay}`, copy);
        return copy;
      }
      const next = { ...prev, [foodId]: current - 1 };
      storageService.setItem(`${STORAGE_KEYS.DAILY_PORTIONS}${selectedDay}`, next);
      return next;
    });
  };

  const handleQuickAddCanteen = (food: FoodItem) => {
    handleIncrementPortion(food.id);
  };

  const handleResetDay = () => {
    if (window.confirm("Reset all meal logs for this day?")) {
      setDayPortions({});
      storageService.setItem(`${STORAGE_KEYS.DAILY_PORTIONS}${selectedDay}`, {});
    }
  };

  const handleApplyScannedSchedule = (scannedSchedule: any) => {
    setSchedule((prev) => {
      const updated = { ...prev, ...scannedSchedule };
      storageService.setItem(STORAGE_KEYS.SCHEDULE, updated);
      return updated;
    });
  };

  const consumedMacros = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;
    let fiber = 0;

    Object.entries(dayPortions).forEach(([foodId, count]) => {
      if (count <= 0) return;
      const food = INDIAN_MESS_FOOD_DATABASE.find((f) => f.id === foodId);
      if (food) {
        const portion = calculatorService.calculateFoodPortion(food, count);
        calories += portion.calories;
        protein += portion.protein;
        carbs += portion.carbs;
        fats += portion.fats;
        fiber += portion.fiber;
      }
    });

    return {
      calories: Math.round(calories),
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fats: Math.round(fats * 10) / 10,
      fiber: Math.round(fiber * 10) / 10,
    };
  }, [dayPortions]);

  const deficitAnalysis = useMemo(() => {
    return calculatorService.calculateDeficit(profile.dailyTargets, consumedMacros);
  }, [profile.dailyTargets, consumedMacros]);

  const currentDaySchedule = schedule[selectedDay] || DEFAULT_WEEKLY_MESS_SCHEDULE[selectedDay];

  const getFoodsForIds = (ids: string[] = []): FoodItem[] => {
    return ids
      .map((id) => INDIAN_MESS_FOOD_DATABASE.find((f) => f.id === id))
      .filter((f): f is FoodItem => !!f);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans pb-16">
      {/* Top Header */}
      <ProfileBar
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        streak={profile.streakDays}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-4 pt-6 space-y-6 flex-1">
        {/* Top Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Hostel Nutrition Dashboard</h2>
            <p className="text-xs text-slate-500">Track your mess meals and optimize daily intake</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs flex items-center gap-2 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Upload Menu Photo</span>
            </button>

            <button
              onClick={handleResetDay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Bento Grid: Nutritional Overview */}
        <BentoOverview
          analysis={deficitAnalysis}
          onOpenScanner={() => setIsScannerOpen(true)}
        />

        {/* 7-Day Calendar Tabs */}
        <MessCalendarTabs
          selectedDay={selectedDay}
          onSelectDay={handleSelectDay}
          todayDay={todayDay}
        />

        {/* Bento Grid for Today's Meals: 2x2 Clean Grid on Desktops */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MealSection
            category="breakfast"
            foods={getFoodsForIds(currentDaySchedule.breakfast)}
            dayPortions={dayPortions}
            onIncrement={handleIncrementPortion}
            onDecrement={handleDecrementPortion}
          />

          <MealSection
            category="lunch"
            foods={getFoodsForIds(currentDaySchedule.lunch)}
            dayPortions={dayPortions}
            onIncrement={handleIncrementPortion}
            onDecrement={handleDecrementPortion}
          />

          <MealSection
            category="snacks"
            foods={getFoodsForIds(currentDaySchedule.snacks)}
            dayPortions={dayPortions}
            onIncrement={handleIncrementPortion}
            onDecrement={handleDecrementPortion}
          />

          <MealSection
            category="dinner"
            foods={getFoodsForIds(currentDaySchedule.dinner)}
            dayPortions={dayPortions}
            onIncrement={handleIncrementPortion}
            onDecrement={handleDecrementPortion}
          />
        </div>

        {/* Canteen & Outside Supplements Bento Shelf */}
        <CanteenDrawer
          supplements={CANTEEN_SUPPLEMENTS}
          onQuickAdd={handleQuickAddCanteen}
          dayPortions={dayPortions}
        />
      </main>

      {/* Menu Scanner Modal */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onApplySchedule={handleApplyScannedSchedule}
        currentDay={selectedDay}
      />
    </div>
  );
};
