import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  DayOfWeek,
  UserProfile,
  MealCategory,
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
import { DeficitGauge } from './modules/nutrition/components/DeficitGauge';
import { MessCalendarTabs } from './modules/calendar/components/MessCalendarTabs';
import { MealSection } from './modules/meals/components/MealSection';
import { CanteenDrawer } from './modules/canteen/components/CanteenDrawer';
import { ScannerModal } from './modules/scanner/components/ScannerModal';

import {
  Camera,
  RotateCcw,
  Volume2,
  VolumeX,
  PlusCircle,
  Sparkles,
  Trophy,
  Flame,
} from 'lucide-react';

const STORAGE_KEYS = {
  PROFILE: 'user_profile_v2',
  SCHEDULE: 'weekly_mess_schedule_v2',
  DAILY_PORTIONS: 'daily_portions_', // daily_portions_monday, etc.
  SOUND_ENABLED: 'sound_enabled',
};

export const App: React.FC = () => {
  const storageService = ServiceFactory.getStorageService();
  const calculatorService = ServiceFactory.getCalculatorService();
  const audioService = ServiceFactory.getAudioService();
  const scannerService = ServiceFactory.getScannerService();

  // Helper to get today's day of week
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
    const dayIndex = new Date().getDay();
    return days[dayIndex];
  };

  const todayDay = useMemo(() => getTodayDayOfWeek(), []);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayDay);

  // User Profile state with local persistence
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

  // Sound preference state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return storageService.getItem<boolean>(STORAGE_KEYS.SOUND_ENABLED, true);
  });

  // Weekly Mess Schedule state
  const [schedule, setSchedule] = useState<WeeklyMessSchedule>(() => {
    return storageService.getItem<WeeklyMessSchedule>(
      STORAGE_KEYS.SCHEDULE,
      DEFAULT_WEEKLY_MESS_SCHEDULE
    );
  });

  // Daily logged portions state for the current day: { [foodId]: count }
  const [dayPortions, setDayPortions] = useState<Record<string, number>>(() => {
    return storageService.getItem<Record<string, number>>(
      `${STORAGE_KEYS.DAILY_PORTIONS}${todayDay}`,
      {}
    );
  });

  // Scanner modal toggle
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);

  // Sync sound service
  useEffect(() => {
    audioService.setSoundEnabled(soundEnabled);
    storageService.setItem(STORAGE_KEYS.SOUND_ENABLED, soundEnabled);
  }, [soundEnabled]);

  // Persist profile and recalculate targets
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

  // Switch Day and load its portion counts
  const handleSelectDay = (day: DayOfWeek) => {
    setSelectedDay(day);
    const loaded = storageService.getItem<Record<string, number>>(
      `${STORAGE_KEYS.DAILY_PORTIONS}${day}`,
      {}
    );
    setDayPortions(loaded);
  };

  // Portion Increment
  const handleIncrementPortion = (foodId: string) => {
    setDayPortions((prev) => {
      const current = prev[foodId] || 0;
      const next = { ...prev, [foodId]: current + 1 };
      storageService.setItem(`${STORAGE_KEYS.DAILY_PORTIONS}${selectedDay}`, next);
      audioService.playAdd();
      return next;
    });
  };

  // Portion Decrement
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

  // Quick Add from Canteen Supplement Drawer
  const handleQuickAddCanteen = (food: FoodItem) => {
    handleIncrementPortion(food.id);
    audioService.playPowerSurge();
  };

  // Reset current day's logs
  const handleResetDay = () => {
    if (window.confirm("Reset all meal logs for this day?")) {
      setDayPortions({});
      storageService.setItem(`${STORAGE_KEYS.DAILY_PORTIONS}${selectedDay}`, {});
      audioService.playAlert();
    }
  };

  // Apply OCR scanned schedule
  const handleApplyScannedSchedule = (scannedSchedule: any) => {
    setSchedule((prev) => {
      const updated = { ...prev, ...scannedSchedule };
      storageService.setItem(STORAGE_KEYS.SCHEDULE, updated);
      return updated;
    });
    audioService.playLevelUp();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Compute Total Consumed Macros for selected day
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

  // Deficit Analysis
  const deficitAnalysis = useMemo(() => {
    return calculatorService.calculateDeficit(profile.dailyTargets, consumedMacros);
  }, [profile.dailyTargets, consumedMacros]);

  // Trigger celebration confetti when hitting 100% protein goal
  useEffect(() => {
    if (deficitAnalysis.proteinMetPercentage >= 100) {
      audioService.playLevelUp();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
      });
    }
  }, [deficitAnalysis.proteinMetPercentage >= 100]);

  // Helper to resolve FoodItems for each meal in current day's schedule
  const currentDaySchedule = schedule[selectedDay] || DEFAULT_WEEKLY_MESS_SCHEDULE[selectedDay];

  const getFoodsForIds = (ids: string[] = []): FoodItem[] => {
    return ids
      .map((id) => INDIAN_MESS_FOOD_DATABASE.find((f) => f.id === id))
      .filter((f): f is FoodItem => !!f);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 pb-16">
      {/* 1. Header Profile & Goal Bar */}
      <ProfileBar
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        streak={profile.streakDays}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-4 pt-5 space-y-6 flex-1">
        {/* Top Control Bar: Scan Menu, Sound Toggle & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Open Scanner CTA */}
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 hover:brightness-110 text-white shadow-[0_0_15px_rgba(139,92,246,0.35)] flex items-center gap-2 active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Smart Menu Scanner</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                soundEnabled
                  ? 'bg-slate-900 border-cyan-500/40 text-cyan-400'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title={soundEnabled ? 'Hype SFX Enabled' : 'SFX Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Reset day counts */}
            <button
              onClick={handleResetDay}
              className="px-3 py-2 rounded-xl border border-slate-800 hover:border-rose-900 bg-slate-900/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Reset today's logs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Day</span>
            </button>
          </div>
        </div>

        {/* 2. Real-Time Deficit Gauge & Anime Power Level Meter */}
        <DeficitGauge analysis={deficitAnalysis} />

        {/* 3. 1-Click Campus Canteen Supplements Drawer */}
        <CanteenDrawer
          onQuickAdd={handleQuickAddCanteen}
          activeCounts={dayPortions}
        />

        {/* 4. 7-Day Interactive Mess Calendar */}
        <MessCalendarTabs
          selectedDay={selectedDay}
          onSelectDay={handleSelectDay}
          todayDay={todayDay}
        />

        {/* 5. Four Meal Sections for Selected Day */}
        <div className="space-y-4">
          <MealSection
            category="breakfast"
            title="Breakfast (नाश्ता)"
            foodItems={getFoodsForIds(currentDaySchedule.breakfast)}
            portionCounts={dayPortions}
            onIncrement={handleIncrementPortion}
            onDecrement={handleDecrementPortion}
          />

          <MealSection
            category="lunch"
            title="Lunch (दोपहर का भोजन)"
            foodItems={getFoodsForIds(currentDaySchedule.lunch)}
            portionCounts={dayPortions}
            onIncrement={handleIncrementPortion}
            onDecrement={handleDecrementPortion}
          />

          <MealSection
            category="snacks"
            title="Evening Snacks & Fruit (चाय / नाश्ता)"
            foodItems={getFoodsForIds(currentDaySchedule.snacks)}
            portionCounts={dayPortions}
            onIncrement={handleIncrementPortion}
            onDecrement={handleDecrementPortion}
          />

          <MealSection
            category="dinner"
            title="Dinner (रात का खाना)"
            foodItems={getFoodsForIds(currentDaySchedule.dinner)}
            portionCounts={dayPortions}
            onIncrement={handleIncrementPortion}
            onDecrement={handleDecrementPortion}
          />
        </div>
      </main>

      {/* Smart OCR Scanner Modal */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        scannerService={scannerService}
        onApplySchedule={handleApplyScannedSchedule}
      />
    </div>
  );
};

export default App;
