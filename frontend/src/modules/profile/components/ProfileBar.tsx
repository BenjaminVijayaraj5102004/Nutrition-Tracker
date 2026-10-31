import React, { useState } from 'react';
import { UserProfile, FitnessGoal, Gender } from '../../../core/types/nutrition';
import { Flame, Dumbbell, Target, Sparkles, User, ChevronDown, ChevronUp, Zap } from 'lucide-react';

interface ProfileBarProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  streak: number;
}

export const ProfileBar: React.FC<ProfileBarProps> = ({ profile, onUpdateProfile, streak }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const goalLabels: Record<FitnessGoal, { label: string; icon: string; flair: string }> = {
    muscle_gain: { label: 'Muscle Gain (Bulk)', icon: '💪', flair: 'Hypertrophy Demon' },
    fat_loss: { label: 'Fat Loss (Cut)', icon: '🔥', flair: 'Lean Assassin' },
    maintenance: { label: 'Maintenance', icon: '⚖️', flair: 'Balanced Sensei' },
  };

  return (
    <header className="w-full bg-slate-900/95 border-b border-violet-500/30 backdrop-blur-md sticky top-0 z-30 shadow-lg shadow-violet-950/20">
      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* Top summary row */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand & Anime Rank Tag */}
          <div className="flex items-center gap-2.5">
            <div className="relative group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg md:text-xl font-black tracking-tight text-white flex items-center gap-1">
                  MESS<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">NUTRI</span>
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-violet-900/60 border border-violet-500/40 text-violet-300">
                  v2.0
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1 text-amber-300">
                  <Zap className="w-3 h-3 fill-amber-300" />
                  Streak: <strong className="text-white">{streak}d</strong>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-300 hidden sm:inline">
                  {goalLabels[profile.goal].flair}
                </span>
              </div>
            </div>
          </div>

          {/* Target badges & quick toggle */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-3 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <div className="text-center">
                <span className="text-[10px] block text-slate-400 uppercase font-semibold">Weight</span>
                <span className="font-bold text-white">{profile.weightKg} kg</span>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div className="text-center">
                <span className="text-[10px] block text-slate-400 uppercase font-semibold">Target Cals</span>
                <span className="font-bold text-emerald-400">{profile.dailyTargets.calories}</span>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div className="text-center">
                <span className="text-[10px] block text-slate-400 uppercase font-semibold">Protein</span>
                <span className="font-bold text-cyan-400">{profile.dailyTargets.protein}g</span>
              </div>
            </div>

            {/* Quick Profile expander button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 transition-all hover:shadow-[0_0_12px_rgba(139,92,246,0.3)] active:scale-95"
              aria-label="Toggle profile parameters"
            >
              <User className="w-3.5 h-3.5 text-violet-400" />
              <span className="hidden sm:inline">Body Stats</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible body stats editing drawer */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-in fade-in duration-200">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Weight (kg)</label>
              <input
                type="number"
                min="35"
                max="180"
                value={profile.weightKg}
                onChange={(e) => onUpdateProfile({ weightKg: Number(e.target.value) || 60 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-semibold focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Height (cm)</label>
              <input
                type="number"
                min="100"
                max="230"
                value={profile.heightCm}
                onChange={(e) => onUpdateProfile({ heightCm: Number(e.target.value) || 170 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-semibold focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Gender</label>
              <select
                value={profile.gender}
                onChange={(e) => onUpdateProfile({ gender: e.target.value as Gender })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-semibold focus:outline-none focus:border-cyan-400"
              >
                <option value="male">Male (Sensei)</option>
                <option value="female">Female (Kunoichi)</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Fitness Goal</label>
              <select
                value={profile.goal}
                onChange={(e) => onUpdateProfile({ goal: e.target.value as FitnessGoal })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-semibold focus:outline-none focus:border-cyan-400"
              >
                <option value="muscle_gain">💪 Muscle Gain (+350 kcal)</option>
                <option value="fat_loss">🔥 Fat Loss (-400 kcal)</option>
                <option value="maintenance">⚖️ Maintenance (Normal)</option>
              </select>
            </div>

            {/* Calculated targets summary */}
            <div className="col-span-2 sm:col-span-4 mt-1 p-2.5 bg-slate-950/60 rounded-xl border border-violet-500/20 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-slate-300 font-semibold">Computed Daily Target:</span>
              </div>
              <div className="flex items-center gap-3 font-mono font-bold text-xs">
                <span className="text-emerald-400">{profile.dailyTargets.calories} kcal</span>
                <span className="text-cyan-400">{profile.dailyTargets.protein}g protein</span>
                <span className="text-amber-400">{profile.dailyTargets.carbs}g carbs</span>
                <span className="text-rose-400">{profile.dailyTargets.fats}g fats</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
