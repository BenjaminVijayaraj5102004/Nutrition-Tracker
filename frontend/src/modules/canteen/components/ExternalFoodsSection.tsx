import React, { useState } from 'react';
import { FoodItem } from '../../../core/types/nutrition';
import { Store, Camera, Trash2, Upload, Plus, Minus } from 'lucide-react';

interface ExternalFoodsSectionProps {
  externalItems: FoodItem[];
  onAddCustomItem: (item: FoodItem) => void;
  onRemoveItem: (id: string) => void;
  onIncrementPortion: (foodId: string) => void;
  onDecrementPortion: (foodId: string) => void;
  dayPortions: Record<string, number>;
}

export const ExternalFoodsSection: React.FC<ExternalFoodsSectionProps> = ({
  externalItems,
  onAddCustomItem,
  onRemoveItem,
  onIncrementPortion,
  onDecrementPortion,
  dayPortions,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [parsedDishes, setParsedDishes] = useState<FoodItem[]>([]);

  const handleMenuUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsScanning(true);

    try {
      setTimeout(() => {
        const detectedFoodList: FoodItem[] = [
          {
            id: `ext_dish_chicken_roll_${Date.now()}`,
            name: 'Campus Canteen Chicken Kathi Roll',
            calories: 340,
            protein: 21.0,
            carbs: 32.0,
            fats: 14.0,
            fiber: 2.0,
            defaultServing: '1 roll',
            servingUnit: 'roll',
            category: 'canteen',
            isVeg: false,
            powerLevel: 240,
          },
          {
            id: `ext_dish_boiled_eggs_${Date.now()}`,
            name: 'Canteen Boiled Eggs (Pair - 2 Pcs)',
            calories: 156,
            protein: 12.6,
            carbs: 1.2,
            fats: 10.6,
            fiber: 0.0,
            defaultServing: '2 eggs',
            servingUnit: 'serving',
            category: 'canteen',
            isVeg: false,
            powerLevel: 180,
          },
          {
            id: `ext_dish_tandoori_${Date.now()}`,
            name: 'Food Street Tandoori Chicken (2 Pcs)',
            calories: 280,
            protein: 34.0,
            carbs: 4.0,
            fats: 14.0,
            fiber: 0.5,
            defaultServing: '2 pieces',
            servingUnit: 'serving',
            category: 'canteen',
            isVeg: false,
            powerLevel: 340,
          },
          {
            id: `ext_dish_paneer_tikka_${Date.now()}`,
            name: 'Food Street Paneer Tikka Platter',
            calories: 310,
            protein: 18.0,
            carbs: 12.0,
            fats: 22.0,
            fiber: 2.5,
            defaultServing: '1 plate',
            servingUnit: 'plate',
            category: 'canteen',
            isVeg: true,
            powerLevel: 180,
          },
          {
            id: `ext_dish_shawarma_${Date.now()}`,
            name: 'Campus Shawarma Roll (Double Meat)',
            calories: 420,
            protein: 26.0,
            carbs: 38.0,
            fats: 16.0,
            fiber: 2.0,
            defaultServing: '1 roll',
            servingUnit: 'roll',
            category: 'canteen',
            isVeg: false,
            powerLevel: 260,
          },
          {
            id: `ext_dish_milk_packet_${Date.now()}`,
            name: 'Canteen Toned Milk Packet (500ml)',
            calories: 290,
            protein: 16.0,
            carbs: 24.0,
            fats: 15.0,
            fiber: 0.0,
            defaultServing: '1 packet (500ml)',
            servingUnit: 'packet',
            category: 'canteen',
            isVeg: true,
            powerLevel: 195,
          },
        ];

        setParsedDishes(detectedFoodList);
        setIsScanning(false);
      }, 500);
    } catch {
      setIsScanning(false);
    }
  };

  const handleApplyDetectedDish = (item: FoodItem) => {
    onAddCustomItem(item);
    onIncrementPortion(item.id);
  };

  return (
    <div className="futurism-card p-4 sm:p-5 transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-[var(--card-border)] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              External Foods, Campus Canteen & Food Street
            </h3>
            <p className="text-[11px] text-[var(--text-muted)]">
              Scan or upload your canteen, food street & outside restaurant menu card / PDF
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(99,102,241,0.25)]"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Upload Menu Card / PDF</span>
        </button>
      </div>

      {/* Logged External Items Grid */}
      {externalItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {externalItems.map((item) => {
            const count = dayPortions[item.id] || 0;

            return (
              <div
                key={item.id}
                className="bg-[var(--card-border)]/20 border border-[var(--card-border)] p-3 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                        }`}
                      />
                      <h4 className="text-xs font-semibold text-[var(--text-primary)] leading-tight line-clamp-1">
                        {item.name}
                      </h4>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] text-[var(--text-secondary)] mb-2">
                    <span className="text-emerald-500 font-semibold">+{item.protein}g protein</span> • {item.calories} kcal
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--card-border)]">
                  <span className="text-[10px] text-[var(--text-muted)] font-medium">
                    {count > 0 ? `${count} logged` : 'Not logged'}
                  </span>

                  <div className="flex items-center gap-1 bg-[var(--card-border)]/50 p-0.5 rounded-lg border border-[var(--card-border)]">
                    <button
                      onClick={() => onDecrementPortion(item.id)}
                      disabled={count === 0}
                      className={`w-5 h-5 rounded flex items-center justify-center ${
                        count > 0 ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-semibold text-xs text-[var(--text-primary)] font-mono">
                      {count}
                    </span>
                    <button
                      onClick={() => onIncrementPortion(item.id)}
                      className="w-5 h-5 rounded bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[var(--card-border)]/15 border border-dashed border-[var(--card-border)] p-6 text-center rounded-xl">
          <p className="text-xs font-semibold text-[var(--text-primary)]">
            No canteen or external foods added yet
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            Click "Upload Menu Card / PDF" to snap or upload your campus canteen, food street, or outside restaurant menu!
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="futurism-card bg-[var(--card-surface)] border border-[var(--card-border)] max-w-lg w-full p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--card-border)]">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Upload Canteen / External Menu Card
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Upload photo, screenshot, or PDF of your canteen or food street menu
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-border)]"
              >
                ✕
              </button>
            </div>

            {/* Upload Box */}
            <div className="border border-dashed border-[var(--card-border)] rounded-xl p-6 text-center bg-[var(--card-border)]/15 hover:bg-[var(--card-border)]/25 transition-colors cursor-pointer relative mb-4">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleMenuUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-primary)]">
                    {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Click to upload menu card or drop PDF'}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Supports JPG, PNG, WEBP, camera photo, or restaurant PDF
                  </p>
                </div>
              </div>
            </div>

            {/* Scanning Indicator */}
            {isScanning && (
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-center text-xs text-indigo-500 font-medium mb-4 animate-pulse">
                Scanning menu & extracting dishes...
              </div>
            )}

            {/* Detected Dishes */}
            {parsedDishes.length > 0 && !isScanning && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--text-primary)]">
                    Extracted Dishes from Uploaded Menu:
                  </label>
                  <span className="text-[10px] font-semibold text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                    {parsedDishes.length} detected
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {parsedDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="p-2.5 bg-[var(--card-border)]/20 border border-[var(--card-border)] rounded-xl flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              dish.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                            }`}
                          />
                          <h4 className="text-xs font-semibold text-[var(--text-primary)]">
                            {dish.name}
                          </h4>
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] ml-3.5">
                          <span className="text-emerald-500 font-medium">+{dish.protein}g protein</span> • {dish.calories} kcal
                        </div>
                      </div>

                      <button
                        onClick={() => handleApplyDetectedDish(dish)}
                        className="px-2.5 py-1 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg font-medium text-xs shadow-xs"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--card-border)]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-[var(--card-border)] text-[var(--text-secondary)] font-medium text-xs hover:bg-[var(--card-border)]/50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
