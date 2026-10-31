import React from 'react';
import { DayOfWeek } from '../../../core/types/nutrition';
import { Calendar } from 'lucide-react';

interface MessCalendarTabsProps {
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
  todayDay: DayOfWeek;
}

const DAYS: { key: DayOfWeek; label: string; short: string }[] = [
  { key: 'monday', label: 'Monday', short: 'MON' },
  { key: 'tuesday', label: 'Tuesday', short: 'TUE' },
  { key: 'wednesday', label: 'Wednesday', short: 'WED' },
  { key: 'thursday', label: 'Thursday', short: 'THU' },
  { key: 'friday', label: 'Friday', short: 'FRI' },
  { key: 'saturday', label: 'Saturday', short: 'SAT' },
  { key: 'sunday', label: 'Sunday', short: 'SUN' },
];

export const MessCalendarTabs: React.FC<MessCalendarTabsProps> = ({
  selectedDay,
  onSelectDay,
  todayDay,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2 text-xs font-black text-black uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-black" />
          <span>7-DAY ROTATION SCHEDULE</span>
        </div>
        <span className="text-xs font-black uppercase bg-black text-[#facc15] px-2 py-0.5 shadow-[2px_2px_0_0_#000]">
          TODAY: {todayDay.toUpperCase()}
        </span>
      </div>

      {/* Neo-brutalist Tab Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {DAYS.map(({ key, short }) => {
          const isSelected = selectedDay === key;
          const isToday = todayDay === key;

          return (
            <button
              key={key}
              onClick={() => onSelectDay(key)}
              className={`flex-1 min-w-[76px] py-2 px-2 text-xs font-black uppercase transition-all border-3 border-black ${
                isSelected
                  ? 'bg-[#facc15] text-black shadow-[4px_4px_0_0_#000] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-white text-black hover:bg-slate-100 shadow-[2px_2px_0_0_#000]'
              }`}
            >
              <span>{short}</span>
              {isToday && (
                <span className="block text-[8px] font-black tracking-widest text-rose-600 mt-0.5">
                  ● ACTIVE
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
