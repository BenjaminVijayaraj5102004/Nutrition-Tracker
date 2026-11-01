import React, { useState } from 'react';
import { UserProfile, FitnessGoal } from '../../../core/types/nutrition';
import { User, ChevronDown, ChevronUp, Flame, Sun, Moon, Laptop, Sparkles } from 'lucide-react';

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
    <header className="w-full bg-[var(--card-surface)] border-b-[2.5px] border-[var(--card-border)] sticky top-0 z-30 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Product Name (Neo-Brutalist Bold) */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-400 text-black border-2 border-[var(--card-border)] shadow-[2.5px_2.5px_0px_var(--card-shadow)] flex items-center justify-center font-black text-sm tracking-wider">
              MN
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-tight text-[var(--text-primary)]">
                  MessNutri
                </h1>
                <span className="text-[10px] font-black tracking-wider text-black bg-cyan-300 border-1.5 border-[var(--card-border)] shadow-[1.5px_1.5px_0px_var(--card-shadow)] px-2 py-0.5 rounded-md">
                  CAMPUS INTELLIGENCE
                </span>
              </div>
              <p className="text-[11px] font-bold text-[var(--text-muted)] hidden sm:block">
                Precision hostel nutrition balance & deficit tracking
              </p>
            </div>
          </div>

          {/* Quick Metrics, Theme Toggle & Profile Button */}
          <div className="flex items-center gap-2.5">
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 bg-orange-300 dark:bg-orange-400 text-black border-2 border-[var(--card-border)] shadow-[2px_2px_0px_var(--card-shadow)] px-2.5 py-1 rounded-lg text-xs font-black">
              <Flame className="w-3.5 h-3.5 fill-black text-black" />
              <span>{streak}d Streak</span>
            </div>

            {/* Neo-Brutalist Light / Dark / Auto Segmented Switcher */}
            <div className="flex items-center bg-[var(--card-surface)] p-1 rounded-xl border-2 border-[var(--card-border)] shadow-[2px_2px_0px_var(--card-shadow)] text-[var(--text-muted)] gap-1">
              <button
                type="button"
                onClick={() => onThemeChange('light')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-yellow-300 text-black border-1.5 border-[var(--card-border)] shadow-[1.5px_1.5px_0px_var(--card-shadow)]'
                    : 'hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 font-bold'
                }`}
                title="Light Mode"
              >
                <Sun className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden sm:inline">Light</span>
              </button>
              <button
                type="button"
                onClick={() => onThemeChange('dark')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-zinc-900 text-white border-1.5 border-[var(--card-border)] shadow-[1.5px_1.5px_0px_var(--card-shadow)]'
                    : 'hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 font-bold'
                }`}
                title="Dark Mode"
              >
                <Moon className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden sm:inline">Dark</span>
              </button>
              <button
                type="button"
                onClick={() => onThemeChange('system')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'bg-cyan-300 text-black border-1.5 border-[var(--card-border)] shadow-[1.5px_1.5px_0px_var(--card-shadow)]'
                    : 'hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 font-bold'
                }`}
                title="Auto / System Mode"
              >
                <Laptop className="w-3.5 h-3.5 text-black" />
                <span className="hidden sm:inline">Auto</span>
              </button>
            </div>

            {/* Profile Drawer Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--card-surface)] hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-primary)] border-2 border-[var(--card-border)] shadow-[2.5px_2.5px_0px_var(--card-shadow)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none rounded-xl text-xs font-black transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{profile.weightKg}kg • Goal</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" /> : <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />}
            </button>
          </div>
        </div>

        {/* Expandable Goals Drawer */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t-2 border-[var(--card-border)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-in fade-in duration-150">
            <div>
              <label className="block text-[var(--text-primary)] font-bold mb-1">
                Body Weight (kg)
              </label>
              <input
                type="number"
                min="35"
                max="180"
                value={profile.weightKg}
                onChange={(e) => onUpdateProfile({ weightKg: Number(e.target.value) || 60 })}
                className="w-full px-2.5 py-1.5 neo-input"
              />
            </div>

            <div>
              <label className="block text-[var(--text-primary)] font-bold mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                min="120"
                max="230"
                value={profile.heightCm}
                onChange={(e) => onUpdateProfile({ heightCm: Number(e.target.value) || 170 })}
                className="w-full px-2.5 py-1.5 neo-input"
              />
            </div>

            <div>
              <label className="block text-[var(--text-primary)] font-bold mb-1">
                Gender
              </label>
              <select
                value={profile.gender}
                onChange={(e) => onUpdateProfile({ gender: e.target.value as any })}
                className="w-full px-2.5 py-1.5 neo-input"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-[var(--text-primary)] font-bold mb-1">
                Fitness Goal
              </label>
              <select
                value={profile.goal}
                onChange={(e) => onUpdateProfile({ goal: e.target.value as FitnessGoal })}
                className="w-full px-2.5 py-1.5 neo-input"
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
