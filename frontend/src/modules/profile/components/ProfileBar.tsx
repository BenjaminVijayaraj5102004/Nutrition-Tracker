import React, { useState } from 'react';
import { UserProfile, FitnessGoal } from '../../../core/types/nutrition';
import { User, ChevronDown, ChevronUp, Activity, Flame, Shield } from 'lucide-react';

interface ProfileBarProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  streak: number;
}

export const ProfileBar: React.FC<ProfileBarProps> = ({ profile, onUpdateProfile, streak }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Product Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              MN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  MessNutri
                </h1>
                <span className="text-[10px] font-semibold tracking-wide text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-full">
                  BENTO DASHBOARD
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Daily hostel nutrition balance & canteen intelligence
              </p>
            </div>
          </div>

          {/* Quick Metrics & Edit Drawer Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-lg text-xs text-amber-800 font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>{streak} Day Streak</span>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>{profile.weightKg} kg • Goal</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Expandable Goals Drawer */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-in fade-in duration-150">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Body Weight (kg)</label>
              <input
                type="number"
                min="35"
                max="180"
                value={profile.weightKg}
                onChange={(e) => onUpdateProfile({ weightKg: Number(e.target.value) || 60 })}
                className="w-full px-2.5 py-1.5 paper-input"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Height (cm)</label>
              <input
                type="number"
                min="120"
                max="230"
                value={profile.heightCm}
                onChange={(e) => onUpdateProfile({ heightCm: Number(e.target.value) || 170 })}
                className="w-full px-2.5 py-1.5 paper-input"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Gender</label>
              <select
                value={profile.gender}
                onChange={(e) => onUpdateProfile({ gender: e.target.value as any })}
                className="w-full px-2.5 py-1.5 paper-input"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Current Goal</label>
              <select
                value={profile.goal}
                onChange={(e) => onUpdateProfile({ goal: e.target.value as FitnessGoal })}
                className="w-full px-2.5 py-1.5 paper-input"
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
