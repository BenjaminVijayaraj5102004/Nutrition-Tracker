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
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
          <Calendar className="w-4 h-4 text-amber-500 stroke-[2.5]" />
          <span>7-Day Rotation Schedule</span>
        </div>
        <span className="text-xs text-[var(--text-muted)] font-bold">
          Active: <strong className="text-[var(--text-primary)] font-black capitalize bg-yellow-400/30 px-1.5 py-0.5 rounded border border-[var(--card-border)]">{todayDay}</strong> (Today)
        </span>
      </div>

      {/* Segmented Day Tab Bar (Neo-Brutal) */}
      <div className="flex items-center gap-1.5 p-1.5 neo-card-static overflow-x-auto no-scrollbar">
        {DAYS.map(({ key, short }) => {
          const isSelected = selectedDay === key;
          const isToday = todayDay === key;

          return (
            <button
              key={key}
              onClick={() => onSelectDay(key)}
              className={`flex-1 min-w-[70px] py-2 px-2 text-xs rounded-xl transition-all text-center relative cursor-pointer ${
                isSelected
                  ? 'bg-yellow-400 text-black font-black border-2 border-[var(--card-border)] shadow-[2.5px_2.5px_0px_var(--card-shadow)] -translate-y-0.5'
                  : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5 font-bold border-2 border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>{short}</span>
              {isToday && (
                <span className={`block w-1.5 h-1.5 rounded-full mx-auto mt-0.5 ${isSelected ? 'bg-black' : 'bg-yellow-400'}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
