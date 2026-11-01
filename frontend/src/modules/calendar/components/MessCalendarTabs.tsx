import React from 'react';
import { DayOfWeek } from '../../../core/types/nutrition';
import { Calendar } from 'lucide-react';

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
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>7-Day Rotation Schedule</span>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Active: <strong className="text-slate-800 dark:text-slate-200 capitalize">{todayDay}</strong> (Today)
        </span>
      </div>

      {/* Segmented Day Tab Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar">
        {DAYS.map(({ key, short }) => {
          const isSelected = selectedDay === key;
          const isToday = todayDay === key;

          return (
            <button
              key={key}
              onClick={() => onSelectDay(key)}
              className={`flex-1 min-w-[70px] py-1.5 px-2 text-xs font-medium rounded-lg transition-all text-center relative ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{short}</span>
              {isToday && (
                <span className="block w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mx-auto mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
