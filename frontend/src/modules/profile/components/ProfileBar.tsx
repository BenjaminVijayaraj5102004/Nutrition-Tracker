import React, { useState } from 'react';
import { UserProfile, FitnessGoal } from '../../../core/types/nutrition';
import { User, ChevronDown, ChevronUp, Flame, Sun, Moon, Laptop } from 'lucide-react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ProfileBarProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  streak: number;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const ProfileBar: React.FC<ProfileBarProps> = ({
  profile,
  onUpdateProfile,
  streak,
  theme,
  onThemeChange,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Product Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 text-white flex items-center justify-center font-bold text-sm rounded-xl shadow-xs">
              MN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  MessNutri
                </h1>
                <span className="text-[10px] font-semibold tracking-wide text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full">
                  HOSTEL EDITION
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Daily hostel nutrition tracking & smart deficit analysis
              </p>
            </div>
          </div>

          {/* Quick Metrics, Theme Toggle & Profile Button */}
          <div className="flex items-center gap-2.5">
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 px-2.5 py-1 rounded-lg text-xs text-amber-800 dark:text-amber-300 font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>{streak}d Streak</span>
            </div>

            {/* Light / Dark / System Theme Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 text-slate-600 dark:text-slate-300">
              <button
                onClick={() => onThemeChange('light')}
                className={`p-1.5 rounded-md transition-colors ${
                  theme === 'light'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Light Mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onThemeChange('dark')}
                className={`p-1.5 rounded-md transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-white shadow-2xs font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onThemeChange('system')}
                className={`p-1.5 rounded-md transition-colors ${
                  theme === 'system'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
                title="System Mode"
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Profile Drawer Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium shadow-2xs transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>{profile.weightKg}kg • Goal</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expandable Goals Drawer */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-in fade-in duration-100">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Body Weight (kg)
              </label>
              <input
                type="number"
                min="35"
                max="180"
                value={profile.weightKg}
                onChange={(e) => onUpdateProfile({ weightKg: Number(e.target.value) || 60 })}
                className="w-full px-2.5 py-1.5 app-input"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                min="120"
                max="230"
                value={profile.heightCm}
                onChange={(e) => onUpdateProfile({ heightCm: Number(e.target.value) || 170 })}
                className="w-full px-2.5 py-1.5 app-input"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Gender
              </label>
              <select
                value={profile.gender}
                onChange={(e) => onUpdateProfile({ gender: e.target.value as any })}
                className="w-full px-2.5 py-1.5 app-input"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Fitness Goal
              </label>
              <select
                value={profile.goal}
                onChange={(e) => onUpdateProfile({ goal: e.target.value as FitnessGoal })}
                className="w-full px-2.5 py-1.5 app-input"
              >
                <option value="muscle_gain">Muscle Gain (+15%)</option>
                <option value="maintenance">Maintenance</option>
                <option value="fat_loss">Fat Loss (-20%)</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
