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
    <header className="w-full bg-[var(--card-surface)] border-b border-[var(--card-border)] backdrop-blur-xl sticky top-0 z-30 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Product Name (Neo-Futurist Clean Glow) */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-[1.5px] shadow-[0_0_15px_rgba(99,102,241,0.25)]">
                <div className="w-full h-full bg-[var(--card-surface)] rounded-[10px] flex items-center justify-center font-bold text-sm text-[var(--text-primary)]">
                  MN
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-[var(--text-primary)]">
                  MessNutri
                </h1>
                <span className="text-[10px] font-semibold tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 px-2 py-0.5 rounded-full">
                  CAMPUS INTELLIGENCE
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] hidden sm:block">
                Precision hostel nutrition balance & deficit tracking
              </p>
            </div>
          </div>

          {/* Quick Metrics, Theme Toggle & Profile Button */}
          <div className="flex items-center gap-2.5">
            {/* Streak Counter with Subtle Glow */}
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs text-amber-600 dark:text-amber-400 font-medium">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{streak}d Streak</span>
            </div>

            {/* Neo-Futuristic Light / Dark / Auto Segmented Switcher */}
            <div className="flex items-center bg-[var(--card-border)]/40 p-1 rounded-xl border border-[var(--card-border)] text-[var(--text-muted)] gap-1">
              <button
                type="button"
                onClick={() => onThemeChange('light')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  theme === 'light'
                    ? 'bg-white text-indigo-950 shadow-xs border border-slate-200'
                    : 'hover:text-[var(--text-primary)] hover:bg-[var(--card-border)]/30'
                }`}
                title="Light Mode"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Light</span>
              </button>
              <button
                type="button"
                onClick={() => onThemeChange('dark')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-indigo-950/80 text-cyan-300 shadow-[0_0_10px_rgba(99,102,241,0.25)] border border-indigo-500/40'
                    : 'hover:text-[var(--text-primary)] hover:bg-[var(--card-border)]/30'
                }`}
                title="Dark Mode"
              >
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Dark</span>
              </button>
              <button
                type="button"
                onClick={() => onThemeChange('system')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  theme === 'system'
                    ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                    : 'hover:text-[var(--text-primary)] hover:bg-[var(--card-border)]/30'
                }`}
                title="Auto / System Mode"
              >
                <Laptop className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Auto</span>
              </button>
            </div>

            {/* Profile Drawer Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--card-surface)] hover:bg-[var(--card-border)]/50 text-[var(--text-primary)] border border-[var(--card-border)] rounded-lg text-xs font-medium shadow-xs transition-colors"
            >
              <User className="w-3.5 h-3.5 text-indigo-500" />
              <span>{profile.weightKg}kg • Goal</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expandable Goals Drawer */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-[var(--card-border)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-in fade-in duration-150">
            <div>
              <label className="block text-[var(--text-secondary)] font-medium mb-1">
                Body Weight (kg)
              </label>
              <input
                type="number"
                min="35"
                max="180"
                value={profile.weightKg}
                onChange={(e) => onUpdateProfile({ weightKg: Number(e.target.value) || 60 })}
                className="w-full px-2.5 py-1.5 futurism-input"
              />
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] font-medium mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                min="120"
                max="230"
                value={profile.heightCm}
                onChange={(e) => onUpdateProfile({ heightCm: Number(e.target.value) || 170 })}
                className="w-full px-2.5 py-1.5 futurism-input"
              />
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] font-medium mb-1">
                Gender
              </label>
              <select
                value={profile.gender}
                onChange={(e) => onUpdateProfile({ gender: e.target.value as any })}
                className="w-full px-2.5 py-1.5 futurism-input"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] font-medium mb-1">
                Fitness Goal
              </label>
              <select
                value={profile.goal}
                onChange={(e) => onUpdateProfile({ goal: e.target.value as FitnessGoal })}
                className="w-full px-2.5 py-1.5 futurism-input"
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
