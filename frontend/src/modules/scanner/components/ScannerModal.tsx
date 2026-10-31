import React, { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { ServiceFactory } from '../../../core/services/ServiceFactory';
import { DayOfWeek } from '../../../core/types/nutrition';
import { INDIAN_MESS_FOOD_DATABASE } from '../../../core/data/foodDatabase';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySchedule: (scannedSchedule: any) => void;
  currentDay: DayOfWeek;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onApplySchedule,
  currentDay,
}) => {
  if (!isOpen) return null;

  const scannerService = ServiceFactory.getScannerService();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [extractedRawText, setExtractedRawText] = useState<string>('');
  const [detectedDishes, setDetectedDishes] = useState<string[]>([]);
  const [scannedDays, setScannedDays] = useState<any>(null);
  const [targetDay, setTargetDay] = useState<DayOfWeek>(currentDay);

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
              Upload Hostel Mess Menu
            </h3>
            <p className="text-xs text-slate-500">
              Upload a photo of your mess noticeboard chart to detect dishes
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Zone */}
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors cursor-pointer relative mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">
                Click to browse or drag & drop photo
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                PNG, JPG or JPEG from your camera or gallery
              </p>
            </div>
          </div>
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-center text-xs text-indigo-700 mb-4 animate-pulse">
            Analyzing menu photo and matching items with Indian food database...
          </div>
        )}

        {/* Results Preview */}
        {extractedRawText && (
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Detected Dishes ({detectedDishes.length} items found)
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl max-h-32 overflow-y-auto">
                {detectedDishes.map((dish, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs bg-white border border-slate-200 text-slate-800 px-2.5 py-1 rounded-md shadow-2xs"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    {dish}
                  </span>
                ))}
              </div>
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
