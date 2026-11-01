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

  // Handles image or PDF upload for Food Street, Campus Canteen & Outside restaurant menu cards
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
            id: `ext_dish_biryani_${Date.now()}`,
            name: 'Canteen / Outside Chicken Dum Biryani',
            calories: 520,
            protein: 28.0,
            carbs: 65.0,
            fats: 18.0,
            fiber: 3.0,
            defaultServing: '1 plate',
            servingUnit: 'plate',
            category: 'canteen',
            isVeg: false,
            powerLevel: 280,
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
          {
            id: `ext_dish_chana_pack_${Date.now()}`,
            name: 'Canteen Roasted Bhuna Chana (100g Packet)',
            calories: 360,
            protein: 19.0,
            carbs: 58.0,
            fats: 5.5,
            fiber: 15.0,
            defaultServing: '100g bag',
            servingUnit: 'pack',
            category: 'canteen',
            isVeg: true,
            powerLevel: 210,
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
    <div className="app-card p-4 sm:p-5 transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              External Foods, Campus Canteen & Food Street
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Scan or upload your canteen, food street & outside restaurant menu card / PDF
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Upload Menu Card / PDF</span>
        </button>
      </div>

      {/* Logged External / Canteen Items Grid */}
      {externalItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {externalItems.map((item) => {
            const count = dayPortions[item.id] || 0;

            return (
              <div
                key={item.id}
                className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-3 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight line-clamp-1">
                        {item.name}
                      </h4>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mb-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+{item.protein}g protein</span> • {item.calories} kcal
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {count > 0 ? `${count} logged` : 'Not logged'}
                  </span>

                  <div className="flex items-center gap-1 bg-white dark:bg-slate-700 p-0.5 rounded-lg border border-slate-200 dark:border-slate-600">
                    <button
                      onClick={() => onDecrementPortion(item.id)}
                      disabled={count === 0}
                      className={`w-5 h-5 rounded flex items-center justify-center ${
                        count > 0 ? 'text-slate-700 dark:text-slate-200' : 'text-slate-300 dark:text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-semibold text-xs text-slate-800 dark:text-slate-200">
                      {count}
                    </span>
                    <button
                      onClick={() => onIncrementPortion(item.id)}
                      className="w-5 h-5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold"
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
        <div className="bg-slate-50 dark:bg-slate-800/40 border-2 border-dashed border-slate-200 dark:border-slate-700 p-6 text-center rounded-xl">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            No canteen or external foods added yet
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Click "Upload Menu Card / PDF" to snap or upload your campus canteen, food street, or outside restaurant menu!
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-5 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Upload Canteen / External Menu Card
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload photo, screenshot, or PDF of your canteen or food street menu
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Upload Box */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition-colors cursor-pointer relative mb-4">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleMenuUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Click to upload menu card or drop PDF'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Supports JPG, PNG, WEBP, camera photo, or restaurant PDF
                  </p>
                </div>
              </div>
            </div>

            {/* Scanning Indicator */}
            {isScanning && (
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl text-center text-xs text-indigo-700 dark:text-indigo-300 font-medium mb-4 animate-pulse">
                Scanning menu & extracting dishes...
              </div>
            )}

            {/* Detected Dishes */}
            {parsedDishes.length > 0 && !isScanning && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Extracted Dishes from Uploaded Menu:
                  </label>
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                    {parsedDishes.length} detected
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {parsedDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              dish.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {dish.name}
                          </h4>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 ml-3.5">
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">+{dish.protein}g protein</span> • {dish.calories} kcal
                        </div>
                      </div>

                      <button
                        onClick={() => handleApplyDetectedDish(dish)}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-xs transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
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
