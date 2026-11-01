import React, { useState, useEffect, useMemo } from 'react';
import {
  DayOfWeek,
  UserProfile,
  FoodItem,
  WeeklyMessSchedule,
} from './core/types/nutrition';
import {
  ALL_COMBINED_FOOD_DATABASE,
  VIT_AP_WEEKLY_MESS_SCHEDULE,
} from './core/data/vitApMenuDatabase';
import { ServiceFactory } from './core/services/ServiceFactory';

import { ProfileBar, ThemeMode } from './modules/profile/components/ProfileBar';
import { BentoOverview } from './modules/nutrition/components/BentoOverview';
import { MessCalendarTabs } from './modules/calendar/components/MessCalendarTabs';
import { MealSwipeCarousel } from './modules/meals/components/MealSwipeCarousel';
import { ExternalFoodsSection } from './modules/canteen/components/ExternalFoodsSection';
import { ScannerModal } from './modules/scanner/components/ScannerModal';

import {
  Camera,
  RotateCcw,
} from 'lucide-react';

const STORAGE_KEYS = {
  PROFILE: 'user_profile_v2',
  SCHEDULE: 'weekly_mess_schedule_vitap_v3',
  DAILY_PORTIONS: 'daily_portions_v3_',
  EXTERNAL_ITEMS: 'external_foods_custom_v3',
  THEME: 'messnutri_theme_mode',
};

export const App: React.FC = () => {
  const storageService = ServiceFactory.getStorageService();
  const calculatorService = ServiceFactory.getCalculatorService();

  // Theme Management (Light, Dark, System)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return storageService.getItem<ThemeMode>(STORAGE_KEYS.THEME, 'system');
  });

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    };

    if (theme === 'dark') {
      applyTheme(true);
    } else if (theme === 'light') {
      applyTheme(false);
    } else {
      // System preference check
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const listener = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }

    storageService.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

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
    const initialTargets = calculatorService.calculateDailyTargets(68, 175, 'male', 'muscle_gain');
    return storageService.getItem<UserProfile>(STORAGE_KEYS.PROFILE, {
      weightKg: 68,
      heightCm: 175,
      gender: 'male',
      goal: 'muscle_gain',
      activityLevel: 'moderate',
      dailyTargets: initialTargets,
      streakDays: 4,
      lastActiveDate: new Date().toISOString().split('T')[0],
    });
  });

  // Default to VIT-AP official October schedule
  const [schedule, setSchedule] = useState<WeeklyMessSchedule>(() => {
    return storageService.getItem<WeeklyMessSchedule>(
      STORAGE_KEYS.SCHEDULE,
      VIT_AP_WEEKLY_MESS_SCHEDULE
    );
  });

  const [dayPortions, setDayPortions] = useState<Record<string, number>>(() => {
    return storageService.getItem<Record<string, number>>(
      `${STORAGE_KEYS.DAILY_PORTIONS}${todayDay}`,
      {}
    );
  });

  // External / Canteen / Food Street items persisted in storage
  const [externalFoods, setExternalFoods] = useState<FoodItem[]>(() => {
    return storageService.getItem<FoodItem[]>(STORAGE_KEYS.EXTERNAL_ITEMS, []);
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

  const handleAddExternalItem = (item: FoodItem) => {
    setExternalFoods((prev) => {
      const updated = [item, ...prev];
      storageService.setItem(STORAGE_KEYS.EXTERNAL_ITEMS, updated);
      return updated;
    });
  };

  const handleRemoveExternalItem = (id: string) => {
    setExternalFoods((prev) => {
      const updated = prev.filter((it) => it.id !== id);
      storageService.setItem(STORAGE_KEYS.EXTERNAL_ITEMS, updated);
      return updated;
    });

    if (dayPortions[id]) {
      setDayPortions((prev) => {
        const copy = { ...prev };
        delete copy[id];
        storageService.setItem(`${STORAGE_KEYS.DAILY_PORTIONS}${selectedDay}`, copy);
        return copy;
      });
    }
  };

  const handleResetDay = () => {
    if (window.confirm(`Reset all meal logs for ${selectedDay.toUpperCase()}?`)) {
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

  // Combine items map for instant lookup
  const allFoodsMap = useMemo(() => {
    const map = new Map<string, FoodItem>();
    ALL_COMBINED_FOOD_DATABASE.forEach((f) => map.set(f.id, f));
    externalFoods.forEach((f) => map.set(f.id, f));
    return map;
  }, [externalFoods]);

  // Compute nutrients
  const consumedMacros = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;
    let fiber = 0;

    Object.entries(dayPortions).forEach(([foodId, count]) => {
      if (count <= 0) return;
      const food = allFoodsMap.get(foodId);
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
  }, [dayPortions, allFoodsMap]);

  const deficitAnalysis = useMemo(() => {
    return calculatorService.calculateDeficit(profile.dailyTargets, consumedMacros);
  }, [profile.dailyTargets, consumedMacros]);

  const currentDaySchedule = schedule[selectedDay] || VIT_AP_WEEKLY_MESS_SCHEDULE[selectedDay];

  const getFoodsForIds = (ids: string[] = []): FoodItem[] => {
    return ids
      .map((id) => allFoodsMap.get(id))
      .filter((f): f is FoodItem => !!f);
  };

  const resolvedScheduleForDay = useMemo(() => {
    return {
      breakfast: getFoodsForIds(currentDaySchedule.breakfast),
      lunch: getFoodsForIds(currentDaySchedule.lunch),
      snacks: getFoodsForIds(currentDaySchedule.snacks),
      dinner: getFoodsForIds(currentDaySchedule.dinner),
    };
  }, [currentDaySchedule, allFoodsMap]);

  return (
    <div className="min-h-screen flex flex-col font-sans pb-16 transition-colors">
      {/* Top Header */}
      <ProfileBar
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        streak={profile.streakDays}
        theme={theme}
        onThemeChange={setTheme}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-4 pt-6 space-y-6 flex-1">
        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 futurism-card p-3.5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[var(--text-primary)] tracking-tight">
                Hostel Nutrition Dashboard
              </h2>
              <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 px-2 py-0.5 rounded-full">
                VIT-AP Active
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Live menu schedule & personal deficit breakdown
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white rounded-xl font-medium text-xs flex items-center gap-2 transition-all shadow-[0_0_12px_rgba(99,102,241,0.25)]"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Import Mess Menu</span>
            </button>

            <button
              onClick={handleResetDay}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--card-surface)] hover:bg-[var(--card-hover)] text-[var(--text-secondary)] border border-[var(--card-border)] rounded-xl font-medium text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Nutritional Overview Card Grid */}
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

        {/* Clean Swipeable Meal Carousel (No Long Messy Scrolling) */}
        <MealSwipeCarousel
          scheduleForDay={resolvedScheduleForDay}
          dayPortions={dayPortions}
          onIncrement={handleIncrementPortion}
          onDecrement={handleDecrementPortion}
        />

        {/* External Foods, Campus Canteen & Food Street (Pure Upload & Scan Driven) */}
        <ExternalFoodsSection
          externalItems={externalFoods}
          onAddCustomItem={handleAddExternalItem}
          onRemoveItem={handleRemoveExternalItem}
          onIncrementPortion={handleIncrementPortion}
          onDecrementPortion={handleDecrementPortion}
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
