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
import {
  ALL_COMBINED_FOOD_DATABASE,
  VIT_AP_WEEKLY_MESS_SCHEDULE,
} from './core/data/vitApMenuDatabase';
import { ServiceFactory } from './core/services/ServiceFactory';
import { MessNutriApiClient } from './core/services/MessNutriApiClient';

import { ProfileBar } from './modules/profile/components/ProfileBar';
import { BentoOverview } from './modules/nutrition/components/BentoOverview';
import { MessCalendarTabs } from './modules/calendar/components/MessCalendarTabs';
import { MealSection } from './modules/meals/components/MealSection';
import { CanteenDrawer } from './modules/canteen/components/CanteenDrawer';
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
};

export const App: React.FC = () => {
  const storageService = ServiceFactory.getStorageService();
  const calculatorService = ServiceFactory.getCalculatorService();

  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Poll backend connection
  useEffect(() => {
    let isMounted = true;
    const checkConnection = async () => {
      const healthy = await MessNutriApiClient.checkHealth();
      if (isMounted) {
        setIsBackendConnected(healthy);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

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

  // Custom External / Food Street items persisted in storage (starts empty until user uploads menu card/PDF)
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

  const handleQuickAddCanteen = (food: FoodItem) => {
    handleIncrementPortion(food.id);
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

    // Remove from logged portions if currently selected
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

  // Build combined pool of all items: standard Indian, VIT-AP university menu, plus user custom external foods
  const allFoodsMap = useMemo(() => {
    const map = new Map<string, FoodItem>();
    ALL_COMBINED_FOOD_DATABASE.forEach((f) => map.set(f.id, f));
    CANTEEN_SUPPLEMENTS.forEach((f) => map.set(f.id, f));
    externalFoods.forEach((f) => map.set(f.id, f));
    return map;
  }, [externalFoods]);

  // Compute nutrients using all logged portions
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

  return (
    <div className="min-h-screen bg-[#fffdf5] text-black flex flex-col font-sans pb-16">
      {/* Top Header */}
      <ProfileBar
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        streak={profile.streakDays}
        isBackendConnected={isBackendConnected}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-4 pt-6 space-y-6 flex-1">
        {/* Top Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white border-3 border-black p-3.5 shadow-[4px_4px_0_0_#000] rounded-xl">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-black uppercase tracking-tight">
                HOSTEL NUTRITION TERMINAL
              </h2>
              <span className="text-[10px] font-black uppercase bg-[#facc15] border border-black px-1.5 py-0.2">
                VIT-AP OCTOBER ACTIVE
              </span>
            </div>
            <p className="text-xs font-bold text-black/60 uppercase">
              LIVE MENU SCHEDULE & NUTRITIONAL DEFICIT BREAKDOWN
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-2 bg-[#facc15] hover:bg-[#eab308] text-black border-2 border-black font-black text-xs uppercase neo-btn flex items-center gap-2"
            >
              <Camera className="w-4 h-4 stroke-[2.5]" />
              <span>IMPORT MENU</span>
            </button>

            <button
              onClick={handleResetDay}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-black border-2 border-black font-black text-xs uppercase neo-btn"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>RESET</span>
            </button>
          </div>
        </div>

        {/* Bento Overview with Neo-Brutalist styling */}
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

        {/* Meals 2x2 Grid */}
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

        {/* Campus Canteen & Supplements Shelf */}
        <CanteenDrawer
          supplements={CANTEEN_SUPPLEMENTS}
          onQuickAdd={handleQuickAddCanteen}
          dayPortions={dayPortions}
        />

        {/* External Foods & Food Street Section */}
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
