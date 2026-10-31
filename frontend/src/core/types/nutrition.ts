export type Gender = 'male' | 'female' | 'other';
export type FitnessGoal = 'muscle_gain' | 'fat_loss' | 'maintenance';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type MealCategory = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export interface MacroNutrients {
  calories: number; // kcal
  protein: number;  // g
  carbs: number;    // g
  fats: number;     // g
  fiber: number;    // g
}

export interface FoodItem extends MacroNutrients {
  id: string;
  name: string;
  hindiName?: string;
  category: 'staple' | 'curry' | 'dal' | 'snack' | 'fruit' | 'dairy' | 'canteen' | 'beverage';
  defaultServing: string; // e.g. "1 piece", "1 katori (150g)", "1 glass (250ml)"
  servingUnit: string;    // "piece", "katori", "glass", "scoop", "serving"
  isVeg: boolean;
  isCanteenQuickAdd?: boolean;
  powerLevel: number;     // Gamified power score (e.g. 10 - 200)
  animeTag?: string;      // e.g. "Saiyan Fuel", "Titan Core", "Chakra Boost"
}

export interface UserProfile {
  weightKg: number;
  heightCm: number;
  gender: Gender;
  goal: FitnessGoal;
  activityLevel: 'sedentary' | 'moderate' | 'active';
  dailyTargets: MacroNutrients;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export interface LoggedFoodEntry {
  id: string;
  foodId: string;
  name: string;
  servingCount: number;
  servingUnit: string;
  macros: MacroNutrients;
  timestamp: number;
}

export interface DailyMealLog {
  breakfast: LoggedFoodEntry[];
  lunch: LoggedFoodEntry[];
  snacks: LoggedFoodEntry[];
  dinner: LoggedFoodEntry[];
}

export interface WeeklyMessSchedule {
  [key: string]: {
    breakfast: string[];
    lunch: string[];
    snacks: string[];
    dinner: string[];
  };
}

export interface DeficitAnalysis {
  target: MacroNutrients;
  consumed: MacroNutrients;
  deficit: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
  proteinMetPercentage: number;
  caloriesMetPercentage: number;
  powerLevelTotal: number;
  rankBadge: {
    rank: 'E-Rank' | 'C-Rank' | 'B-Rank' | 'A-Rank' | 'S-Rank' | 'Super Saiyan God';
    title: string;
    color: string;
    glow: string;
    flairMessage: string;
  };
}
