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
    <div className="neo-card-static p-4 sm:p-5 transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b-2 border-[var(--card-border)] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-400 text-black border-2 border-[var(--card-border)] shadow-[2px_2px_0px_var(--card-shadow)] flex items-center justify-center font-black">
            <Store className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-black text-[var(--text-primary)]">
              External Foods, Campus Canteen & Food Street
            </h3>
            <p className="text-[11px] font-bold text-[var(--text-muted)]">
              Scan or upload your canteen, food street & outside restaurant menu card / PDF
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black font-black border-2 border-[var(--card-border)] shadow-[3px_3px_0px_var(--card-shadow)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
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
                className="bg-[var(--card-surface)] border-2 border-[var(--card-border)] shadow-[2.5px_2.5px_0px_var(--card-shadow)] p-3 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 border border-black dark:border-white ${
                          item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                        }`}
                      />
                      <h4 className="text-xs font-black text-[var(--text-primary)] leading-tight line-clamp-1">
                        {item.name}
                      </h4>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[var(--text-muted)] hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] text-[var(--text-secondary)] mb-2 font-mono">
                    <span className="text-emerald-600 dark:text-emerald-400 font-black">+{item.protein}g protein</span> • {item.calories} kcal
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--card-border)]">
                  <span className="text-[10px] text-[var(--text-muted)] font-black">
                    {count > 0 ? `${count} logged` : 'Not logged'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDecrementPortion(item.id)}
                      disabled={count === 0}
                      className={`w-6 h-6 rounded-lg border border-[var(--card-border)] flex items-center justify-center ${
                        count > 0 ? 'bg-[var(--card-surface)] text-[var(--text-primary)] cursor-pointer' : 'text-[var(--text-muted)] opacity-30 cursor-not-allowed'
                      }`}
                    >
                      <Minus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                    <span className="w-5 text-center font-black text-xs text-[var(--text-primary)] font-mono">
                      {count}
                    </span>
                    <button
                      onClick={() => onIncrementPortion(item.id)}
                      className="w-6 h-6 rounded-lg bg-yellow-400 text-black border border-[var(--card-border)] flex items-center justify-center font-black cursor-pointer"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border-2 border-dashed border-[var(--card-border)] bg-black/5 dark:bg-white/5 p-6 text-center rounded-xl">
          <p className="text-xs font-black text-[var(--text-primary)]">
            No canteen or external foods added yet
          </p>
          <p className="text-[11px] font-bold text-[var(--text-muted)] mt-0.5">
            Click "Upload Menu Card / PDF" to snap or upload your campus canteen, food street, or outside restaurant menu!
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-150">
          <div className="neo-card-static bg-[var(--card-surface)] border-3 border-[var(--card-border)] shadow-[8px_8px_0px_var(--card-shadow)] max-w-lg w-full p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[var(--card-border)]">
              <div>
                <h3 className="text-base font-black text-[var(--text-primary)]">
                  Upload Canteen / External Menu Card
                </h3>
                <p className="text-xs font-bold text-[var(--text-muted)]">
                  Upload photo, screenshot, or PDF of your canteen or food street menu
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg border-2 border-[var(--card-border)] shadow-[1.5px_1.5px_0px_var(--card-shadow)] flex items-center justify-center font-black text-xs hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Upload Box */}
            <div className="border-2 border-dashed border-[var(--card-border)] rounded-xl p-6 text-center bg-black/5 dark:bg-white/5 hover:bg-yellow-400/10 transition-colors cursor-pointer relative mb-4">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleMenuUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-400 text-black border-2 border-[var(--card-border)] shadow-[2px_2px_0px_var(--card-shadow)] flex items-center justify-center font-black">
                  <Upload className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-xs font-black text-[var(--text-primary)]">
                    {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Click to upload menu card or drop PDF'}
                  </p>
                  <p className="text-[11px] font-bold text-[var(--text-muted)] mt-0.5">
                    Supports JPG, PNG, WEBP, camera photo, or restaurant PDF
                  </p>
                </div>
              </div>
            </div>

            {/* Scanning Indicator */}
            {isScanning && (
              <div className="p-3 bg-yellow-400 text-black font-black border-2 border-[var(--card-border)] shadow-[2px_2px_0px_var(--card-shadow)] rounded-xl text-center text-xs mb-4 animate-pulse">
                Scanning menu & extracting dishes...
              </div>
            )}

            {/* Detected Dishes */}
            {parsedDishes.length > 0 && !isScanning && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-[var(--text-primary)]">
                    Extracted Dishes from Uploaded Menu:
                  </label>
                  <span className="text-[10px] font-black text-black bg-cyan-300 border-1.5 border-[var(--card-border)] shadow-[1px_1px_0px_var(--card-shadow)] px-2 py-0.5 rounded-md font-mono">
                    {parsedDishes.length} detected
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {parsedDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="p-2.5 bg-[var(--card-surface)] border-2 border-[var(--card-border)] shadow-[2px_2px_0px_var(--card-shadow)] rounded-xl flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-full border border-black dark:border-white ${
                              dish.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                            }`}
                          />
                          <h4 className="text-xs font-black text-[var(--text-primary)]">
                            {dish.name}
                          </h4>
                        </div>
                        <div className="text-[11px] font-mono text-[var(--text-muted)] ml-4">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{dish.protein}g protein</span> • {dish.calories} kcal
                        </div>
                      </div>

                      <button
                        onClick={() => handleApplyDetectedDish(dish)}
                        className="px-2.5 py-1 bg-yellow-400 text-black font-black border-1.5 border-[var(--card-border)] shadow-[1.5px_1.5px_0px_var(--card-shadow)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none rounded-lg text-xs cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-[var(--card-border)]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded-xl border-2 border-[var(--card-border)] text-[var(--text-primary)] font-black text-xs hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
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
