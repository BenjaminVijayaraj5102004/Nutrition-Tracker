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
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span>7-Day Rotation Schedule</span>
        </div>
        <span className="text-xs text-[var(--text-muted)] font-medium">
          Active: <strong className="text-[var(--text-primary)] capitalize">{todayDay}</strong> (Today)
        </span>
      </div>

      {/* Segmented Day Tab Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-[var(--card-surface)] rounded-2xl border border-[var(--card-border)] backdrop-blur-md overflow-x-auto no-scrollbar">
        {DAYS.map(({ key, short }) => {
          const isSelected = selectedDay === key;
          const isToday = todayDay === key;

          return (
            <button
              key={key}
              onClick={() => onSelectDay(key)}
              className={`flex-1 min-w-[70px] py-1.5 px-2 text-xs font-medium rounded-xl transition-all text-center relative ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-border)]/40'
              }`}
            >
              <span>{short}</span>
              {isToday && (
                <span className={`block w-1.5 h-1.5 rounded-full mx-auto mt-0.5 ${isSelected ? 'bg-white' : 'bg-indigo-500'}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
