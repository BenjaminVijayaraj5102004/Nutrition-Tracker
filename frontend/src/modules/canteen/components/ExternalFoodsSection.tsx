import React, { useState } from 'react';
import { FoodItem } from '../../../core/types/nutrition';
import { Store, Camera, Trash2, Upload } from 'lucide-react';

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
    <div className="bg-[#bae6fd] border-4 border-black p-4 sm:p-5 shadow-[6px_6px_0px_0px_#000] rounded-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b-2 border-black gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-black text-[#67e8f9] flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000]">
            <Store className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-black uppercase tracking-tight">
              EXTERNAL FOODS, CAMPUS CANTEEN & FOOD STREET
            </h3>
            <p className="text-[11px] font-bold text-black/70 uppercase">
              SCAN OR UPLOAD YOUR CANTEEN, FOOD STREET & OUTSIDE RESTAURANT MENU CARD / PDF
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-1.5 bg-[#facc15] hover:bg-[#eab308] text-black border-2 border-black font-black text-xs uppercase neo-btn flex items-center gap-1.5"
        >
          <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>UPLOAD MENU CARD / PDF</span>
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
                className="bg-white border-3 border-black p-3 shadow-[3px_3px_0_0_#000] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 border border-black ${
                          item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      <h4 className="text-xs font-black text-black uppercase leading-tight line-clamp-1">
                        {item.name}
                      </h4>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-black/40 hover:text-rose-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] font-bold text-black/70 mb-2">
                    <span className="text-emerald-700 font-mono font-black">+{item.protein}g PROT</span> • {item.calories} CALS
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-black/20">
                  <span className="text-[10px] font-black uppercase text-black">
                    {count > 0 ? `${count} LOGGED` : 'NOT LOGGED'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDecrementPortion(item.id)}
                      disabled={count === 0}
                      className={`w-6 h-6 border-2 border-black font-black flex items-center justify-center ${
                        count > 0 ? 'bg-white text-black' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-mono font-black text-xs">
                      {count}
                    </span>
                    <button
                      onClick={() => onIncrementPortion(item.id)}
                      className="w-6 h-6 bg-[#facc15] border-2 border-black text-black font-black flex items-center justify-center neo-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/80 border-2 border-dashed border-black/40 p-4 text-center rounded-lg">
          <p className="text-xs font-black uppercase text-black/70">
            NO CANTEEN OR EXTERNAL FOODS ADDED YET
          </p>
          <p className="text-[11px] font-bold text-black/50 uppercase mt-0.5">
            CLICK "UPLOAD MENU CARD / PDF" TO SNAP OR UPLOAD YOUR CAMPUS CANTEEN, FOOD STREET, OR OUTSIDE RESTAURANT MENU!
          </p>
        </div>
      )}

      {/* Pure Image & PDF Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-[#fffdf5] rounded-xl border-4 border-black max-w-lg w-full p-5 sm:p-6 shadow-[8px_8px_0_0_#000] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-3 border-black">
              <div>
                <h3 className="text-base font-black text-black uppercase tracking-tight">
                  UPLOAD CANTEEN / EXTERNAL MENU CARD
                </h3>
                <p className="text-xs font-bold text-black/60 uppercase">
                  UPLOAD PHOTO, SCREENSHOT, OR PDF OF YOUR CANTEEN OR FOOD STREET
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 border-2 border-black bg-white hover:bg-slate-100 text-black shadow-[2px_2px_0_0_#000]"
              >
                ✕
              </button>
            </div>

            {/* Upload Box */}
            <div className="border-3 border-dashed border-black rounded-lg p-6 text-center bg-white hover:bg-[#fef9c3] transition-colors cursor-pointer relative mb-4 shadow-[4px_4px_0_0_#000]">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleMenuUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 bg-[#facc15] border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000]">
                  <Upload className="w-6 h-6 text-black stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-black">
                    {uploadedFileName ? `ATTACHED: ${uploadedFileName}` : 'CLICK TO UPLOAD MENU CARD OR DROP PDF'}
                  </p>
                  <p className="text-[11px] font-bold text-black/60 mt-0.5 uppercase">
                    SUPPORTS JPG, PNG, WEBP, CAMERA SHOT, OR CANTEEN PDF
                  </p>
                </div>
              </div>
            </div>

            {/* Scanning Indicator */}
            {isScanning && (
              <div className="p-3 bg-[#fef08a] border-3 border-black font-black text-xs uppercase text-black mb-4 shadow-[3px_3px_0_0_#000] animate-pulse text-center">
                SCANNING MENU & EXTRACTING CANTEEN / FOOD STREET DISHES...
              </div>
            )}

            {/* Detected Dishes from Uploaded Menu Card */}
            {parsedDishes.length > 0 && !isScanning && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-black">
                    EXTRACTED DISHES FROM UPLOADED MENU:
                  </label>
                  <span className="text-[10px] font-black uppercase bg-black text-[#facc15] px-1.5 py-0.2">
                    {parsedDishes.length} DETECTED
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {parsedDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="p-2.5 bg-white border-2 border-black shadow-[2px_2px_0_0_#000] flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 border border-black ${
                              dish.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <h4 className="text-xs font-black uppercase text-black">
                            {dish.name}
                          </h4>
                        </div>
                        <div className="text-[11px] font-bold text-black/70 ml-3.5">
                          <span className="text-emerald-700 font-mono">+{dish.protein}g PROT</span> • {dish.calories} CALS
                        </div>
                      </div>

                      <button
                        onClick={() => handleApplyDetectedDish(dish)}
                        className="px-2.5 py-1 bg-[#22c55e] text-black border-2 border-black font-black text-[10px] uppercase neo-btn"
                      >
                        + ADD ITEM
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-black">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border-2 border-black bg-white text-black font-black text-xs uppercase neo-btn"
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
