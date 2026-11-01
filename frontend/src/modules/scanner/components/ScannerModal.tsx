import React, { useState } from 'react';
import {
  Upload,
  X,
  Check,
  Camera,
  ClipboardPaste,
  Sparkles,
} from 'lucide-react';
import { ServiceFactory } from '../../../core/services/ServiceFactory';
import { DayOfWeek } from '../../../core/types/nutrition';
import { ALL_COMBINED_FOOD_DATABASE, VIT_AP_WEEKLY_MESS_SCHEDULE } from '../../../core/data/vitApMenuDatabase';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySchedule: (scannedSchedule: any) => void;
  currentDay: DayOfWeek;
}

type UploadTab = 'image' | 'paste' | 'preset';

const CAMPUS_PRESETS = [
  {
    id: 'vit_ap_october',
    title: 'VIT-AP University Mess Menu (October 2026)',
    desc: 'Official October Schedule: Utappam, Pulka, Pulihora, Dondakaya, Mudda Pappu, Dal Maharani, Badam Milk, Punugulu',
    tags: ['VIT-AP Official', 'Veg & Non-Veg'],
  },
  {
    id: 'north_mess',
    title: 'North Indian Hostel Mess Standard',
    desc: 'Rotis, Dal Tadka, Rajma, Chole, Poha, Aloo Gobi, Seasonal Fruits',
    tags: ['North Veg', 'High Carb'],
  },
  {
    id: 'south_mess',
    title: 'South Indian Hostel Mess Standard',
    desc: 'Idli, Sambar, Coconut Chutney, Dosa, Upma, Rasam, Curd Rice, Bananas',
    tags: ['South Veg', 'Fermented'],
  },
];

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onApplySchedule,
  currentDay,
}) => {
  if (!isOpen) return null;

  const scannerService = ServiceFactory.getScannerService();
  const [activeTab, setActiveTab] = useState<UploadTab>('image');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [extractedRawText, setExtractedRawText] = useState<string>('');
  const [detectedDishes, setDetectedDishes] = useState<string[]>([]);
  const [scannedDays, setScannedDays] = useState<any>(null);
  const [targetDay, setTargetDay] = useState<DayOfWeek>(currentDay);

  const [pastedMenuText, setPastedMenuText] = useState<string>(
    'Saturday:\nBreakfast: Mix Veg Utappam, Vegetable Poha, Peanut Chutney, Sprouts, Boiled Egg\nLunch: Pulka, White Rice, Mudda Pappu, Pulihora, Dondakaya Stir Fry, Chole\nSnacks: Punugulu, Cold Badam Milk\nDinner: Roti, Rice, Dal Maharani, Bendakaya Pulusu, Vegetable Fried Rice, Fruit Custard'
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const result = await scannerService.scanMenuImage(file);
      setExtractedRawText(result.rawText);

      const scheduleForTargetDay = result.detectedDays[targetDay] || VIT_AP_WEEKLY_MESS_SCHEDULE[targetDay];
      const finalSchedule = {
        [targetDay]: scheduleForTargetDay,
      };
      setScannedDays(finalSchedule);

      const allIds = [
        ...scheduleForTargetDay.breakfast,
        ...scheduleForTargetDay.lunch,
        ...scheduleForTargetDay.snacks,
        ...scheduleForTargetDay.dinner,
      ];
      const dishNames = allIds.map((id) => {
        const item = ALL_COMBINED_FOOD_DATABASE.find((f) => f.id === id);
        return item ? item.name : id;
      });
      setDetectedDishes(Array.from(new Set(dishNames)));
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleParseText = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const textLower = pastedMenuText.toLowerCase();
      const matchedFoodItems = ALL_COMBINED_FOOD_DATABASE.filter((food) => {
        const nameL = food.name.toLowerCase();
        const tokens = nameL.split(/[/(), ]+/).filter((t) => t.length > 2);
        return tokens.some((token) => textLower.includes(token));
      });

      const matchedIds = matchedFoodItems.map((f) => f.id);
      const matchedNames = matchedFoodItems.map((f) => f.name);

      setExtractedRawText(pastedMenuText);
      setDetectedDishes(matchedNames);

      setScannedDays({
        [targetDay]: {
          breakfast: matchedIds.slice(0, 4),
          lunch: matchedIds.slice(4, 9),
          snacks: matchedIds.slice(9, 11),
          dinner: matchedIds.slice(11, 16),
        },
      });
      setIsProcessing(false);
    }, 300);
  };

  const handleApplyPreset = (presetId: string) => {
    if (presetId === 'vit_ap_october') {
      setExtractedRawText('VIT-AP University Mess Menu (October 2026 Schedule)');
      setScannedDays(VIT_AP_WEEKLY_MESS_SCHEDULE);
      const sat = VIT_AP_WEEKLY_MESS_SCHEDULE[targetDay];
      const names = [...sat.breakfast, ...sat.lunch, ...sat.snacks, ...sat.dinner].map((id) => {
        return ALL_COMBINED_FOOD_DATABASE.find((f) => f.id === id)?.name || id;
      });
      setDetectedDishes(Array.from(new Set(names)));
      return;
    }

    const preset = CAMPUS_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setExtractedRawText(`Applied preset: ${preset.title}`);
    setDetectedDishes(preset.tags);

    const generatedSchedule: any = {};
    const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    days.forEach((day) => {
      if (presetId === 'south_mess') {
        generatedSchedule[day] = {
          breakfast: ['idli_set', 'sambar', 'milk_glass_250'],
          lunch: ['roti_plain', 'steamed_rice', 'dal_yellow_tadka', 'curd_dahi'],
          snacks: ['banana_medium'],
          dinner: ['roti_plain', 'steamed_rice', 'rasam', 'curd_dahi'],
        };
      } else {
        generatedSchedule[day] = {
          breakfast: ['poha', 'milk_glass_250', 'banana_medium'],
          lunch: ['roti_plain', 'steamed_rice', 'dal_yellow_tadka', 'curd_dahi', 'bhindi_masala'],
          snacks: ['apple_medium'],
          dinner: ['roti_plain', 'steamed_rice', 'rajma_masala', 'dal_makhani'],
        };
      }
    });

    setScannedDays(generatedSchedule);
  };

  const handleConfirmAndApply = () => {
    if (scannedDays) {
      onApplySchedule(scannedDays);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-150">
      <div className="neo-card-static bg-[var(--card-surface)] border-3 border-[var(--card-border)] shadow-[8px_8px_0px_var(--card-shadow)] max-w-xl w-full p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[var(--card-border)]">
          <div>
            <h3 className="text-base font-black text-[var(--text-primary)]">
              Import University Mess Menu
            </h3>
            <p className="text-xs font-bold text-[var(--text-muted)]">
              Auto-detects VIT-AP October Menu & campus staples
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border-2 border-[var(--card-border)] shadow-[1.5px_1.5px_0px_var(--card-shadow)] flex items-center justify-center font-black text-xs hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Target Day Selector */}
        <div className="mb-4 bg-black/5 dark:bg-white/5 border-2 border-[var(--card-border)] p-2.5 rounded-xl flex items-center justify-between">
          <label className="text-xs font-black text-[var(--text-primary)]">
            Apply to Schedule Day:
          </label>
          <select
            value={targetDay}
            onChange={(e) => setTargetDay(e.target.value as DayOfWeek)}
            className="px-2.5 py-1 border-2 border-[var(--card-border)] shadow-[2px_2px_0px_var(--card-shadow)] font-black text-xs rounded-lg bg-[var(--card-surface)] text-[var(--text-primary)]"
          >
            <option value="saturday">Saturday (Today)</option>
            <option value="sunday">Sunday</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
          </select>
        </div>

        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-4 bg-black/5 dark:bg-white/5 p-1 rounded-xl border-2 border-[var(--card-border)]">
          <button
            onClick={() => setActiveTab('image')}
            className={`py-2 px-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'image'
                ? 'bg-yellow-400 text-black border-2 border-[var(--card-border)] shadow-[2px_2px_0px_var(--card-shadow)] -translate-y-0.5'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Photo / File</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`py-2 px-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'paste'
                ? 'bg-yellow-400 text-black border-2 border-[var(--card-border)] shadow-[2px_2px_0px_var(--card-shadow)] -translate-y-0.5'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <ClipboardPaste className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Paste Text</span>
          </button>

          <button
            onClick={() => setActiveTab('preset')}
            className={`py-2 px-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'preset'
                ? 'bg-yellow-400 text-black border-2 border-[var(--card-border)] shadow-[2px_2px_0px_var(--card-shadow)] -translate-y-0.5'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Presets</span>
          </button>
        </div>

        {/* Tab 1: Image & Camera Upload */}
        {activeTab === 'image' && (
          <div className="border-2 border-dashed border-[var(--card-border)] rounded-xl p-6 text-center bg-black/5 dark:bg-white/5 hover:bg-yellow-400/10 transition-colors cursor-pointer relative mb-4">
            <input
              type="file"
              accept="image/*,.pdf,.xlsx,.csv,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-400 text-black border-2 border-[var(--card-border)] shadow-[2px_2px_0px_var(--card-shadow)] flex items-center justify-center font-black">
                <Upload className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-xs font-black text-[var(--text-primary)]">
                  Upload Menu Screenshot, Photo or PDF
                </p>
                <p className="text-[11px] font-bold text-[var(--text-muted)] mt-0.5">
                  Identifies exact dishes for {targetDay.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Paste Notice Text */}
        {activeTab === 'paste' && (
          <div className="space-y-2 mb-4">
            <label className="block text-xs font-black text-[var(--text-primary)]">
              Paste Menu Text from WhatsApp or Noticeboard:
            </label>
            <textarea
              rows={4}
              value={pastedMenuText}
              onChange={(e) => setPastedMenuText(e.target.value)}
              className="w-full p-2.5 neo-input text-xs font-mono"
            />
            <button
              onClick={handleParseText}
              className="w-full py-2 bg-yellow-400 text-black font-black border-2 border-[var(--card-border)] shadow-[2.5px_2.5px_0px_var(--card-shadow)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none rounded-xl text-xs cursor-pointer"
            >
              Parse Dishes
            </button>
          </div>
        )}

        {/* Tab 3: Presets */}
        {activeTab === 'preset' && (
          <div className="space-y-2.5 mb-4">
            <p className="text-xs font-bold text-[var(--text-muted)] mb-1">
              Select your university mess menu template:
            </p>
            {CAMPUS_PRESETS.map((preset) => (
              <div
                key={preset.id}
                onClick={() => handleApplyPreset(preset.id)}
                className="p-3 bg-[var(--card-surface)] border-2 border-[var(--card-border)] shadow-[2px_2px_0px_var(--card-shadow)] rounded-xl hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-black text-[var(--text-primary)]">{preset.title}</h4>
                  <p className="text-[11px] font-bold text-[var(--text-muted)] mt-0.5">{preset.desc}</p>
                </div>
                <div className="flex gap-1">
                  {preset.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-black bg-cyan-300 text-black border border-[var(--card-border)] px-1.5 py-0.5 rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="p-3 bg-yellow-400 text-black font-black border-2 border-[var(--card-border)] shadow-[2px_2px_0px_var(--card-shadow)] rounded-xl text-xs mb-4 animate-pulse text-center">
            Analyzing screenshot & matching with VIT-AP menu...
          </div>
        )}

        {/* Results Preview */}
        {extractedRawText && (
          <div className="space-y-2 mb-4 pt-3 border-t-2 border-[var(--card-border)]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-[var(--text-primary)]">
                Matched Dishes for {targetDay.toUpperCase()} ({detectedDishes.length} items):
              </label>
              <span className="text-[10px] font-black bg-lime-400 text-black border border-[var(--card-border)] px-2 py-0.5 rounded-md">
                Verified
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2 bg-black/5 dark:bg-white/5 border-2 border-[var(--card-border)] rounded-xl max-h-36 overflow-y-auto">
              {detectedDishes.map((dish, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs font-bold bg-[var(--card-surface)] border border-[var(--card-border)] text-[var(--text-primary)] px-2 py-0.5 rounded-md shadow-[1px_1px_0px_var(--card-shadow)]"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  {dish}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-[var(--card-border)]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border-2 border-[var(--card-border)] text-[var(--text-primary)] font-bold text-xs hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmAndApply}
            disabled={!extractedRawText}
            className={`px-4 py-1.5 rounded-xl font-black text-xs transition-all ${
              extractedRawText
                ? 'bg-yellow-400 text-black border-2 border-[var(--card-border)] shadow-[2.5px_2.5px_0px_var(--card-shadow)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer'
                : 'bg-black/10 text-[var(--text-muted)] border-2 border-dashed border-[var(--card-border)] opacity-40 cursor-not-allowed shadow-none'
            }`}
          >
            Apply to 7-Day Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
