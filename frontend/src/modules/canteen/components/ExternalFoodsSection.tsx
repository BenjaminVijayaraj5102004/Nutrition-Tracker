import React, { useState } from 'react';
import { FoodItem } from '../../../core/types/nutrition';
import { Store, Plus, Camera, Trash2, Utensils, Sparkles } from 'lucide-react';

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
  const [dishName, setDishName] = useState<string>('');
  const [categoryTag, setCategoryTag] = useState<string>('Food Street Tandoori / Curry');
  const [estCalories, setEstCalories] = useState<number>(350);
  const [estProtein, setEstProtein] = useState<number>(24);
  const [estCarbs, setEstCarbs] = useState<number>(30);
  const [estFats, setEstFats] = useState<number>(14);
  const [servingUnit, setServingUnit] = useState<string>('1 plate');
  const [isVeg, setIsVeg] = useState<boolean>(false);
  const [scannedMenuPreview, setScannedMenuPreview] = useState<string | null>(null);

  // Quick presets from university food street
  const FOOD_STREET_PRESETS = [
    { name: 'Tandoori Chicken Full (4 Pcs)', calories: 520, protein: 60, carbs: 6, fats: 26, isVeg: false, serving: 'full plate' },
    { name: 'Butter Chicken + 2 Butter Naan', calories: 750, protein: 38, carbs: 70, fats: 34, isVeg: false, serving: '1 meal' },
    { name: 'Paneer Butter Masala + 2 Garlic Naan', calories: 680, protein: 24, carbs: 74, fats: 32, isVeg: true, serving: '1 meal' },
    { name: 'Chicken Shawarma Roll', calories: 380, protein: 22, carbs: 36, fats: 16, isVeg: false, serving: '1 roll' },
    { name: 'Double Egg Chicken Roll', calories: 440, protein: 28, carbs: 38, fats: 20, isVeg: false, serving: '1 roll' },
    { name: 'Zomato / Swiggy Chicken Fried Rice', calories: 560, protein: 25, carbs: 75, fats: 18, isVeg: false, serving: '1 box' },
  ];

  const handleSelectPreset = (p: typeof FOOD_STREET_PRESETS[0]) => {
    setDishName(p.name);
    setEstCalories(p.calories);
    setEstProtein(p.protein);
    setEstCarbs(p.carbs);
    setEstFats(p.fats);
    setIsVeg(p.isVeg);
    setServingUnit(p.serving);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setScannedMenuPreview(reader.result as string);
      // Auto-extract item name from file or set sample prompt
      setDishName('Food Street Special: Tandoori Platter');
      setEstProtein(35);
      setEstCalories(420);
      setIsVeg(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveItem = () => {
    if (!dishName.trim()) return;

    const newItem: FoodItem = {
      id: `ext_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: dishName.trim(),
      calories: Number(estCalories) || 200,
      protein: Number(estProtein) || 15,
      carbs: Number(estCarbs) || 25,
      fats: Number(estFats) || 10,
      fiber: 2.0,
      defaultServing: servingUnit || '1 serving',
      servingUnit: 'serving',
      category: 'canteen',
      isVeg: isVeg,
      powerLevel: Number(estProtein) * 10,
    };

    onAddCustomItem(newItem);
    onIncrementPortion(newItem.id);

    // Reset
    setDishName('');
    setScannedMenuPreview(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-[#bae6fd] border-4 border-black p-4 sm:p-5 shadow-[6px_6px_0px_0px_#000] rounded-xl">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b-2 border-black gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-black text-[#67e8f9] flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000]">
            <Store className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-black uppercase tracking-tight">
              EXTERNAL FOODS & CAMPUS FOOD STREET
            </h3>
            <p className="text-[11px] font-bold text-black/70 uppercase">
              SCAN MENU CARDS OR LOG TANDOORI, SWIGGY/ZOMATO & RESTAURANT ORDERS
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-1.5 bg-[#facc15] hover:bg-[#eab308] text-black border-2 border-black font-black text-xs uppercase neo-btn flex items-center gap-1.5"
        >
          <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>+ LOG OUTSIDE FOOD / MENU</span>
        </button>
      </div>

      {/* External Items Grid */}
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
                      title="Remove from custom list"
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
            NO OUTSIDE RESTAURANT ITEMS LOGGED FOR TODAY
          </p>
          <p className="text-[11px] font-bold text-black/50 uppercase mt-0.5">
            EATING OUT AT CAMPUS FOOD STREET OR ORDERING SWIGGY/ZOMATO? CLICK "+ LOG OUTSIDE FOOD" TO TRACK PROTEIN & CALORIES!
          </p>
        </div>
      )}

      {/* Modal to Upload Menu Card or Add Custom Food */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-[#fffdf5] rounded-xl border-4 border-black max-w-lg w-full p-5 sm:p-6 shadow-[8px_8px_0_0_#000] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b-3 border-black">
              <div>
                <h3 className="text-base font-black text-black uppercase tracking-tight">
                  LOG OUTSIDE / FOOD STREET MEAL
                </h3>
                <p className="text-xs font-bold text-black/60 uppercase">
                  UPLOAD MENU CARD PHOTO OR TYPE DISH DETAILS
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 border-2 border-black bg-white hover:bg-slate-100 text-black shadow-[2px_2px_0_0_#000]"
              >
                ✕
              </button>
            </div>

            {/* Menu Card Photo Upload */}
            <div className="mb-4">
              <label className="block text-xs font-black uppercase text-black mb-1">
                Upload Food Street Menu Card / Receipt (Optional):
              </label>
              <div className="border-3 border-dashed border-black rounded-lg p-3 text-center bg-white hover:bg-[#fef9c3] transition-colors cursor-pointer relative shadow-[3px_3px_0_0_#000]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex items-center justify-center gap-2">
                  <Camera className="w-5 h-5 text-black" />
                  <span className="text-xs font-black uppercase text-black">
                    {scannedMenuPreview ? 'MENU CARD ATTACHED' : 'SNAP PHOTO OR BROWSE MENU CARD'}
                  </span>
                </div>
              </div>
            </div>

            {/* Campus Food Street Fast Presets */}
            <div className="mb-4">
              <label className="block text-xs font-black uppercase text-black mb-1">
                Popular Campus Food Street Picks:
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-white border-2 border-black">
                {FOOD_STREET_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className="text-[10px] font-black uppercase bg-[#fef08a] hover:bg-[#facc15] border border-black px-2 py-1 text-black shadow-[1.5px_1.5px_0_0_#000]"
                  >
                    {p.name} (+{p.protein}g)
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-black uppercase text-black mb-1">
                  Dish / Order Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tandoori Chicken, Shawarma, Paneer Tikka..."
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  className="w-full p-2 neo-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase text-black mb-0.5">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={estCalories}
                    onChange={(e) => setEstCalories(Number(e.target.value))}
                    className="w-full p-1.5 neo-input text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-black mb-0.5">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={estProtein}
                    onChange={(e) => setEstProtein(Number(e.target.value))}
                    className="w-full p-1.5 neo-input text-xs font-mono text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-black mb-0.5">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    value={estCarbs}
                    onChange={(e) => setEstCarbs(Number(e.target.value))}
                    className="w-full p-1.5 neo-input text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-black mb-0.5">
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    value={estFats}
                    onChange={(e) => setEstFats(Number(e.target.value))}
                    className="w-full p-1.5 neo-input text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 text-xs font-black uppercase cursor-pointer">
                  <input
                    type="radio"
                    name="veg_nonveg"
                    checked={!isVeg}
                    onChange={() => setIsVeg(false)}
                    className="accent-black w-4 h-4"
                  />
                  <span>Non-Veg (Chicken/Egg/Fish)</span>
                </label>

                <label className="flex items-center gap-1.5 text-xs font-black uppercase cursor-pointer">
                  <input
                    type="radio"
                    name="veg_nonveg"
                    checked={isVeg}
                    onChange={() => setIsVeg(true)}
                    className="accent-black w-4 h-4"
                  />
                  <span>Vegetarian</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-black">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border-2 border-black bg-white text-black font-black text-xs uppercase neo-btn"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                disabled={!dishName.trim()}
                className={`px-4 py-2 border-2 border-black font-black text-xs uppercase neo-btn ${
                  dishName.trim()
                    ? 'bg-[#22c55e] text-black shadow-[3px_3px_0_0_#000]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Log & Add to Today
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
