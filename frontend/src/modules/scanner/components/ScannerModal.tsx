import React, { useState } from 'react';
import {
  Upload,
  X,
  Check,
  Camera,
  FileText,
  FileSpreadsheet,
  Link2,
  Sparkles,
  ClipboardPaste,
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

type UploadTab = 'image' | 'paste' | 'preset' | 'pdf_csv';

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [extractedRawText, setExtractedRawText] = useState<string>('');
  const [detectedDishes, setDetectedDishes] = useState<string[]>([]);
  const [scannedDays, setScannedDays] = useState<any>(null);

  // Raw text paste input state
  const [pastedMenuText, setPastedMenuText] = useState<string>(
    'Monday:\nBreakfast: Poha, Milk, Banana\nLunch: Roti, Rice, Dal Tadka, Curd\nSnacks: Apple\nDinner: Roti, Steamed Rice, Chole Masala'
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      setImagePreview(reader.result as string);
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
    reader.readAsDataURL(file);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-5 sm:p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Import Hostel Mess Menu
            </h3>
            <p className="text-xs text-slate-500">
              Multiple methods to import your weekly or daily hostel mess chart
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('image')}
            className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'image'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photo / File</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'paste'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>Paste Text</span>
          </button>

          <button
            onClick={() => setActiveTab('preset')}
            className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'preset'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Presets</span>
          </button>
        </div>

        {/* Tab 1: Image & Camera Upload */}
        {activeTab === 'image' && (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors cursor-pointer relative mb-4">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Take photo, browse image, or drop file
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Supports Camera capture, JPG, PNG, or PDF mess notice
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Paste WhatsApp / Notice Text */}
        {activeTab === 'paste' && (
          <div className="space-y-2 mb-4">
            <label className="block text-xs font-medium text-slate-700">
              Paste Mess Menu Text (from WhatsApp, College Notice or Email):
            </label>
            <textarea
              rows={4}
              value={pastedMenuText}
              onChange={(e) => setPastedMenuText(e.target.value)}
              placeholder="e.g. Monday: Roti, Dal, Rice, Paneer, Curd, Banana..."
              className="w-full p-2.5 paper-input text-xs font-mono"
            />
            <button
              onClick={handleParseText}
              className="w-full py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-white hover:bg-slate-900 transition-colors"
            >
              Parse Menu Text
            </button>
          </div>
        )}

        {/* Tab 3: University Common Presets */}
        {activeTab === 'preset' && (
          <div className="space-y-2 mb-4">
            <p className="text-xs text-slate-500 mb-2">
              Select your university mess template for instant setup:
            </p>
            {CAMPUS_PRESETS.map((preset) => (
              <div
                key={preset.id}
                onClick={() => handleApplyPreset(preset.id)}
                className="p-3 border border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">{preset.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{preset.desc}</p>
                </div>
                <div className="flex gap-1">
                  {preset.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
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
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-center text-xs text-indigo-700 mb-4 animate-pulse">
            Analyzing and matching food items with Indian nutrition database...
          </div>
        )}

        {/* Results Preview */}
        {extractedRawText && (
          <div className="space-y-2 mb-4 pt-2 border-t border-slate-100">
            <label className="block text-xs font-medium text-slate-700">
              Matched Dishes ({detectedDishes.length} identified):
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl max-h-28 overflow-y-auto">
              {detectedDishes.map((dish, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs bg-white border border-slate-200 text-slate-800 px-2 py-0.5 rounded-md shadow-2xs"
                >
                  <Check className="w-3 h-3 text-emerald-600" />
                  {dish}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmAndApply}
            disabled={!extractedRawText}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              extractedRawText
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Apply to Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
