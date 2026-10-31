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
import { INDIAN_MESS_FOOD_DATABASE } from '../../../core/data/foodDatabase';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySchedule: (scannedSchedule: any) => void;
  currentDay: DayOfWeek;
}

type UploadTab = 'image' | 'paste' | 'preset';

const CAMPUS_PRESETS = [
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
  {
    id: 'special_high_protein',
    title: 'High Protein / Non-Veg Mess Add-on',
    desc: 'Egg Curry, Chicken, Soy Chunks Curry, Paneer Bhurji, Milk, Bananas',
    tags: ['High Protein', 'Eggs/Chicken'],
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

  const [pastedMenuText, setPastedMenuText] = useState<string>(
    'Monday:\nBreakfast: Poha, Milk, Banana\nLunch: Roti, Rice, Dal Tadka, Curd\nSnacks: Apple\nDinner: Roti, Steamed Rice, Chole Masala'
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const result = await scannerService.scanMenuImage(file);
      setExtractedRawText(result.rawText);
      setScannedDays(result.detectedDays);

      const dishNames = result.matchedFoodIds.map((id) => {
        const item = INDIAN_MESS_FOOD_DATABASE.find((f) => f.id === id);
        return item ? item.name : id;
      });
      setDetectedDishes(dishNames);
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
      const matchedNames: string[] = [];
      const matchedIds: string[] = [];

      INDIAN_MESS_FOOD_DATABASE.forEach((food) => {
        const nameLower = food.name.toLowerCase();
        const tokens = nameLower.split(/[/(), ]/).filter((t) => t.length > 2);
        for (const token of tokens) {
          if (textLower.includes(token)) {
            matchedNames.push(food.name);
            matchedIds.push(food.id);
            break;
          }
        }
      });

      setExtractedRawText(pastedMenuText);
      setDetectedDishes(Array.from(new Set(matchedNames)));
      setScannedDays({
        monday: {
          breakfast: matchedIds.slice(0, 3),
          lunch: matchedIds.slice(2, 6),
          snacks: matchedIds.slice(1, 2),
          dinner: matchedIds.slice(3, 7),
        },
      });
      setIsProcessing(false);
    }, 400);
  };

  const handleApplyPreset = (presetId: string) => {
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
      } else if (presetId === 'special_high_protein') {
        generatedSchedule[day] = {
          breakfast: ['poha', 'milk_glass_250', 'banana_medium'],
          lunch: ['roti_plain', 'steamed_rice', 'egg_curry_2_eggs', 'dal_yellow_tadka'],
          snacks: ['roasted_chana_50g'],
          dinner: ['roti_plain', 'steamed_rice', 'soya_chunks_curry', 'curd_dahi'],
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
              IMPORT HOSTEL MESS MENU
            </h3>
            <p className="text-xs font-bold text-black/60 uppercase">
              PHOTO UPLOAD, TEXT PARSE, OR CAMPUS PRESETS
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 border-2 border-black bg-white hover:bg-slate-100 text-black shadow-[2px_2px_0_0_#000]"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
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
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 bg-[#facc15] border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000]">
                <Upload className="w-6 h-6 text-black stroke-[2.5]" />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-black">
                  UPLOAD PHOTO, CAMERA SNAP, OR PDF
                </p>
                <p className="text-[11px] font-bold text-black/60 mt-0.5 uppercase">
                  SUPPORTS JPG, PNG, WEBP, OR NOTICEBOARD PDF
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Paste WhatsApp / Notice Text */}
        {activeTab === 'paste' && (
          <div className="space-y-2 mb-4">
            <label className="block text-xs font-black uppercase text-black">
              PASTE WHATSAPP / NOTICEBOARD TEXT:
            </label>
            <textarea
              rows={4}
              value={pastedMenuText}
              onChange={(e) => setPastedMenuText(e.target.value)}
              placeholder="e.g. Monday: Roti, Dal, Rice, Paneer, Curd, Banana..."
              className="w-full p-2.5 neo-input text-xs font-mono"
            />
            <button
              onClick={handleParseText}
              className="w-full py-2 bg-black text-[#facc15] font-black text-xs uppercase neo-btn"
            >
              PARSE MENU TEXT
            </button>
          </div>
        )}

        {/* Tab 3: University Common Presets */}
        {activeTab === 'preset' && (
          <div className="space-y-2.5 mb-4">
            <p className="text-xs font-bold uppercase text-black/70 mb-1">
              SELECT A STANDARD INDIAN HOSTEL TEMPLATE:
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
            ANALYZING & MATCHING WITH NUTRITION DATABASE...
          </div>
        )}

        {/* Results Preview */}
        {extractedRawText && (
          <div className="space-y-2 mb-4 pt-3 border-t-2 border-black">
            <label className="block text-xs font-black uppercase text-black">
              DETECTED DISHES ({detectedDishes.length} MATCHES):
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-white border-2 border-black max-h-28 overflow-y-auto">
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
            APPLY TO SCHEDULE
          </button>
        </div>
      </div>
    </div>
  );
};
