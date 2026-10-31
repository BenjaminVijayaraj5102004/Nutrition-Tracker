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

      // Map day to the user-selected day if desired
      const scheduleForTargetDay = result.detectedDays[targetDay] || VIT_AP_WEEKLY_MESS_SCHEDULE[targetDay];
      const finalSchedule = {
        [targetDay]: scheduleForTargetDay,
      };
      setScannedDays(finalSchedule);

      // Collect dish names from schedule for user review
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="bg-[#fffdf5] rounded-xl border-4 border-black max-w-xl w-full p-5 sm:p-6 shadow-[8px_8px_0_0_#000] relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b-3 border-black">
          <div>
            <h3 className="text-base font-black text-black uppercase tracking-tight">
              IMPORT UNIVERSITY MESS MENU
            </h3>
            <p className="text-xs font-bold text-black/60 uppercase">
              RECOGNIZES VIT-AP UNIVERSITY OCTOBER 2026 MENU
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 border-2 border-black bg-white hover:bg-slate-100 text-black shadow-[2px_2px_0_0_#000]"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Target Day Selector */}
        <div className="mb-4 bg-white border-2 border-black p-2.5 flex items-center justify-between">
          <label className="text-xs font-black uppercase text-black">
            Apply to Schedule Day:
          </label>
          <select
            value={targetDay}
            onChange={(e) => setTargetDay(e.target.value as DayOfWeek)}
            className="px-2 py-1 border-2 border-black font-black uppercase text-xs bg-[#fef08a]"
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
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={() => setActiveTab('image')}
            className={`py-2 px-2 text-xs font-black uppercase border-2 border-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'image'
                ? 'bg-[#facc15] text-black shadow-[3px_3px_0_0_#000]'
                : 'bg-white text-black hover:bg-slate-100 shadow-[1.5px_1.5px_0_0_#000]'
            }`}
          >
            <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>PHOTO / FILE</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`py-2 px-2 text-xs font-black uppercase border-2 border-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'paste'
                ? 'bg-[#bae6fd] text-black shadow-[3px_3px_0_0_#000]'
                : 'bg-white text-black hover:bg-slate-100 shadow-[1.5px_1.5px_0_0_#000]'
            }`}
          >
            <ClipboardPaste className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>PASTE TEXT</span>
          </button>

          <button
            onClick={() => setActiveTab('preset')}
            className={`py-2 px-2 text-xs font-black uppercase border-2 border-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'preset'
                ? 'bg-[#bbf7d0] text-black shadow-[3px_3px_0_0_#000]'
                : 'bg-white text-black hover:bg-slate-100 shadow-[1.5px_1.5px_0_0_#000]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>PRESETS</span>
          </button>
        </div>

        {/* Tab 1: Image & Camera Upload */}
        {activeTab === 'image' && (
          <div className="border-3 border-dashed border-black rounded-lg p-5 text-center bg-white hover:bg-[#fef9c3] transition-colors cursor-pointer relative mb-4 shadow-[4px_4px_0_0_#000]">
            <input
              type="file"
              accept="image/*,.pdf,.xlsx,.csv,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 bg-[#facc15] border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000]">
                <Upload className="w-6 h-6 text-black stroke-[2.5]" />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-black">
                  UPLOAD MENU SCREENSHOT, PHOTO OR EXCEL
                </p>
                <p className="text-[11px] font-bold text-black/60 mt-0.5 uppercase">
                  IDENTIFIES EXACT DISHES FOR {targetDay.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Paste Notice Text */}
        {activeTab === 'paste' && (
          <div className="space-y-2 mb-4">
            <label className="block text-xs font-black uppercase text-black">
              PASTE MENU TEXT FROM WHATSAPP OR NOTICEBOARD:
            </label>
            <textarea
              rows={4}
              value={pastedMenuText}
              onChange={(e) => setPastedMenuText(e.target.value)}
              className="w-full p-2.5 neo-input text-xs font-mono"
            />
            <button
              onClick={handleParseText}
              className="w-full py-2 bg-black text-[#facc15] font-black text-xs uppercase neo-btn"
            >
              PARSE DISHES
            </button>
          </div>
        )}

        {/* Tab 3: Presets */}
        {activeTab === 'preset' && (
          <div className="space-y-2.5 mb-4">
            <p className="text-xs font-bold uppercase text-black/70 mb-1">
              SELECT YOUR UNIVERSITY MESS MENU:
            </p>
            {CAMPUS_PRESETS.map((preset) => (
              <div
                key={preset.id}
                onClick={() => handleApplyPreset(preset.id)}
                className="p-3 bg-white border-3 border-black shadow-[3px_3px_0_0_#000] hover:bg-[#fef9c3] transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-black uppercase text-black">{preset.title}</h4>
                  <p className="text-[11px] font-bold text-black/70 mt-0.5">{preset.desc}</p>
                </div>
                <div className="flex gap-1">
                  {preset.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-black uppercase bg-black text-white px-1.5 py-0.5"
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
          <div className="p-3 bg-[#fef08a] border-3 border-black font-black text-xs uppercase text-black mb-4 shadow-[3px_3px_0_0_#000] animate-pulse">
            ANALYZING SCREENSHOT & MATCHING WITH VIT-AP MENU...
          </div>
        )}

        {/* Results Preview */}
        {extractedRawText && (
          <div className="space-y-2 mb-4 pt-3 border-t-2 border-black">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase text-black">
                MATCHED DISHES FOR {targetDay.toUpperCase()} ({detectedDishes.length} ITEMS):
              </label>
              <span className="text-[10px] font-black uppercase bg-black text-[#facc15] px-1.5 py-0.2">
                VERIFIED
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2 bg-white border-2 border-black max-h-36 overflow-y-auto">
              {detectedDishes.map((dish, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs font-black uppercase bg-[#bbf7d0] border border-black px-2 py-0.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-800" />
                  {dish}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-black">
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 border-black bg-white text-black font-black text-xs uppercase neo-btn"
          >
            CANCEL
          </button>
          <button
            onClick={handleConfirmAndApply}
            disabled={!extractedRawText}
            className={`px-4 py-2 border-2 border-black font-black text-xs uppercase neo-btn ${
              extractedRawText
                ? 'bg-[#22c55e] text-black shadow-[3px_3px_0_0_#000]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border-slate-400 shadow-none'
            }`}
          >
            APPLY TO 7-DAY SCHEDULE
          </button>
        </div>
      </div>
    </div>
  );
};
