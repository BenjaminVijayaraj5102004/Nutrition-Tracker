import React, { useState } from 'react';
import { UserProfile, FitnessGoal } from '../../../core/types/nutrition';
import { User, ChevronDown, ChevronUp, Flame, Zap } from 'lucide-react';

interface ProfileBarProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  streak: number;
}

export const ProfileBar: React.FC<ProfileBarProps> = ({ profile, onUpdateProfile, streak }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <header className="w-full bg-[#fef08a] border-b-4 border-black sticky top-0 z-30 shadow-[0_4px_0_0_#000]">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Product Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-[#facc15] flex items-center justify-center font-black text-lg border-2 border-black shadow-[2px_2px_0_0_#000] rotate-[-2deg]">
              MN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-black tracking-tight uppercase">
                  MessNutri
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-sm">
                  NEO-BRUTAL
                </span>
              </div>
              <p className="text-[11px] font-bold text-black/70 hidden sm:block">
                Hostel Nutrition Balance & Canteen Fixes
              </p>
            </div>
          </div>

          {/* Quick Metrics & Edit Drawer Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white border-2 border-black px-3 py-1 font-black text-xs text-black shadow-[2px_2px_0_0_#000]">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{streak} DAY STREAK</span>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#67e8f9] hover:bg-[#38bdf8] text-black border-2 border-black font-black text-xs neo-btn uppercase"
            >
              <User className="w-3.5 h-3.5" />
              <span>{profile.weightKg}KG • STATS</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expandable Goals Drawer */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t-2 border-black grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-in fade-in duration-100">
            <div>
              <label className="block text-black font-black uppercase tracking-wider text-[10px] mb-1">
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
              <label className="block text-black font-black uppercase tracking-wider text-[10px] mb-1">
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
              <label className="block text-black font-black uppercase tracking-wider text-[10px] mb-1">
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
              <label className="block text-black font-black uppercase tracking-wider text-[10px] mb-1">
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
