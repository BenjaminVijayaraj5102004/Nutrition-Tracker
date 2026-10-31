import React, { useState, useRef } from 'react';
import { IOcrScannerService } from '../../../core/contracts/interfaces';
import { FoodItem } from '../../../core/types/nutrition';
import { INDIAN_MESS_FOOD_DATABASE } from '../../../core/data/foodDatabase';
import { Camera, Upload, CheckCircle2, AlertCircle, Sparkles, X, FileText } from 'lucide-react';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  scannerService: IOcrScannerService;
  onApplySchedule: (schedule: Record<string, { breakfast: string[]; lunch: string[]; snacks: string[]; dinner: string[] }>) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  scannerService,
  onApplySchedule,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<{
    rawText: string;
    detectedDays: Record<string, { breakfast: string[]; lunch: string[]; snacks: string[]; dinner: string[] }>;
    matchedFoodIds: string[];
    confidence: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setImagePreview(url);
      setScannedResult(null);
    }
  };

  const handleStartScan = async () => {
    if (!file) return;
    setIsScanning(true);
    try {
      const result = await scannerService.scanMenuImage(file);
      setScannedResult(result);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirmApply = () => {
    if (scannedResult && scannedResult.detectedDays) {
      onApplySchedule(scannedResult.detectedDays);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-violet-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-600/30 text-violet-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Smart Mess Menu Scanner</h3>
              <p className="text-xs text-slate-400">Upload hostel noticeboard menu photo for instant OCR digitization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* File Picker Zone */}
          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-violet-500/40 hover:border-cyan-400/70 rounded-xl p-8 text-center cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition-all flex flex-col items-center justify-center gap-3"
            >
              <div className="p-3 bg-violet-950/70 text-cyan-400 rounded-full border border-cyan-500/30">
                <Upload className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Upload Mess Menu Photo or Take Snapshot</p>
                <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP hostel timetable pictures</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-slate-700 max-h-56 flex items-center justify-center bg-black">
                <img
                  src={imagePreview}
                  alt="Mess Menu Preview"
                  className="object-contain max-h-56 w-auto"
                />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setFile(null);
                    setScannedResult(null);
                  }}
                  className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/80 text-xs font-bold text-rose-400 border border-rose-800 hover:bg-rose-950/80"
                >
                  Retake Photo
                </button>
              </div>

              {!scannedResult && (
                <button
                  onClick={handleStartScan}
                  disabled={isScanning}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 text-white shadow-lg shadow-violet-900/40 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {isScanning ? 'Extracting Mess Menu OCR...' : 'Run Neural Menu Scanner'}
                </button>
              )}
            </div>
          )}

          {/* OCR Review & Dish Recognition Results */}
          {scannedResult && (
            <div className="space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Digitization Successful! (Confidence {Math.round(scannedResult.confidence * 100)}%)</span>
                </div>
                <span className="font-mono text-cyan-300 font-bold">
                  {scannedResult.matchedFoodIds.length} Dishes Detected
                </span>
              </div>

              {/* Detected items tag list */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  Identified Indian Mess Dishes:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {scannedResult.matchedFoodIds.map((id) => {
                    const food = INDIAN_MESS_FOOD_DATABASE.find((f: FoodItem) => f.id === id);
                    if (!food) return null;
                    return (
                      <span
                        key={id}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center gap-1"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        {food.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Extracted text preview drawer */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 max-h-32 overflow-y-auto whitespace-pre-wrap">
                {scannedResult.rawText}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-950">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            Cancel
          </button>
          {scannedResult && (
            <button
              onClick={handleConfirmApply}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-950/60 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save To Weekly Schedule
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
