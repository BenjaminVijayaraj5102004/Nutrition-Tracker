import React, { useState } from 'react';
import { UserProfile, FitnessGoal } from '../../../core/types/nutrition';
import { User, ChevronDown, ChevronUp, Activity, Check } from 'lucide-react';

interface ProfileBarProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  streak: number;
}

export const ProfileBar: React.FC<ProfileBarProps> = ({ profile, onUpdateProfile, streak }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const goalLabels: Record<FitnessGoal, string> = {
    muscle_gain: 'Muscle Gain',
    fat_loss: 'Fat Loss',
    maintenance: 'Maintenance',
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 py-3">
        {/* Top Summary Bar */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Product Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">
                  MessNutri
                </h1>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  Hostel Edition
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Daily hostel nutrition & deficit tracker • {streak} day streak
              </p>
            </div>
          </div>

          {/* Quick Metrics & Edit Drawer Button */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-4 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-lg text-xs text-slate-600">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Weight</span>
                <span className="font-semibold text-slate-900">{profile.weightKg} kg</span>
              </div>
              <div className="w-px h-5 bg-slate-200" />
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Target Energy</span>
                <span className="font-semibold text-slate-900">{profile.dailyTargets.calories} kcal</span>
              </div>
              <div className="w-px h-5 bg-slate-200" />
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Target Protein</span>
                <span className="font-semibold text-indigo-600">{profile.dailyTargets.protein}g</span>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors shadow-2xs active:bg-slate-100"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Goals</span>
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
