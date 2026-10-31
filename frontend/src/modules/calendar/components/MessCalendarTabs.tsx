import React from 'react';
import { DayOfWeek } from '../../../core/types/nutrition';
import { Calendar, Sparkles } from 'lucide-react';

interface MessCalendarTabsProps {
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
  todayDay: DayOfWeek;
}

const DAYS: { key: DayOfWeek; label: string; short: string }[] = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' },
];

export const MessCalendarTabs: React.FC<MessCalendarTabsProps> = ({
  selectedDay,
  onSelectDay,
  todayDay,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-violet-400" />
          <span>7-Day Mess Rotation</span>
        </div>
        <div className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Active: {todayDay.toUpperCase()} (Today)</span>
        </div>
      </div>

      {/* Horizontally scrollable day tabs for mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {DAYS.map(({ key, label, short }) => {
          const isSelected = selectedDay === key;
          const isToday = todayDay === key;

          return (
            <button
              key={key}
              onClick={() => onSelectDay(key)}
              className={`flex-1 min-w-[70px] sm:min-w-[85px] py-2 px-2 rounded-xl text-center transition-all duration-200 border relative ${
                isSelected
                  ? 'bg-gradient-to-b from-violet-600 to-indigo-700 text-white border-violet-400/80 shadow-[0_0_15px_rgba(139,92,246,0.4)] scale-102'
                  : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {isToday && (
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-cyan-500 text-[8px] font-black uppercase text-slate-950 rounded-full tracking-wider shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                  Today
                </span>
              )}
              <span className="block text-[10px] font-medium opacity-80">
                {short}
              </span>
              <span className="block text-xs sm:text-sm font-extrabold capitalize">
                {label.slice(0, 3)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
