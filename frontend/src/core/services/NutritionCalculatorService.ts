import {
  FitnessGoal,
  Gender,
  MacroNutrients,
  DeficitAnalysis,
  FoodItem,
} from '../types/nutrition';
import { INutritionCalculatorService } from '../contracts/interfaces';

export class NutritionCalculatorService implements INutritionCalculatorService {
  /**
   * Computes targets based on Mifflin-St Jeor + macro distribution for Indian college students
   */
  public calculateDailyTargets(
    weightKg: number,
    heightCm: number,
    gender: Gender,
    goal: FitnessGoal,
    age: number = 20
  ): MacroNutrients {
    // Mifflin-St Jeor formula for BMR
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    // Moderate activity level default for active campus students walking between classes / gym (1.4x)
    let tdee = bmr * 1.4;

    let targetCalories = Math.round(tdee);
    let proteinTargetGrams = 0;

    switch (goal) {
      case 'muscle_gain':
        // +350-400 kcal surplus, 1.8g - 2.0g protein / kg bodyweight
        targetCalories = Math.round(tdee + 350);
        proteinTargetGrams = Math.round(weightKg * 1.9);
        break;
      case 'fat_loss':
        // 400 kcal deficit, 2.0g protein / kg bodyweight to preserve lean mass
        targetCalories = Math.round(Math.max(1400, tdee - 400));
        proteinTargetGrams = Math.round(weightKg * 2.0);
        break;
      case 'maintenance':
      default:
        // Maintenance calories, 1.5g protein / kg
        targetCalories = Math.round(tdee);
        proteinTargetGrams = Math.round(weightKg * 1.5);
        break;
    }

    // Fats ~ 25% of calories
    const fatCalories = targetCalories * 0.25;
    const fatsGrams = Math.round(fatCalories / 9);

    // Remaining calories to carbs
    const proteinCalories = proteinTargetGrams * 4;
    const remainingCarbCalories = Math.max(0, targetCalories - (fatCalories + proteinCalories));
    const carbsGrams = Math.round(remainingCarbCalories / 4);

    // Healthy fiber benchmark
    const fiberGrams = Math.round((targetCalories / 1000) * 14);

    return {
      calories: targetCalories,
      protein: proteinTargetGrams,
      carbs: carbsGrams,
      fats: fatsGrams,
      fiber: fiberGrams,
    };
  }

  public calculateDeficit(target: MacroNutrients, consumed: MacroNutrients): DeficitAnalysis {
    const deficitCalories = Math.round(target.calories - consumed.calories);
    const deficitProtein = Math.round((target.protein - consumed.protein) * 10) / 10;
    const deficitCarbs = Math.round((target.carbs - consumed.carbs) * 10) / 10;
    const deficitFats = Math.round((target.fats - consumed.fats) * 10) / 10;
    const deficitFiber = Math.round((target.fiber - consumed.fiber) * 10) / 10;

    const proteinMetPercentage = target.protein > 0
      ? Math.min(200, Math.round((consumed.protein / target.protein) * 100))
      : 0;

    const caloriesMetPercentage = target.calories > 0
      ? Math.min(200, Math.round((consumed.calories / target.calories) * 100))
      : 0;

    // Gamified power score formula
    const powerLevelTotal = Math.round(
      consumed.protein * 45 +
      consumed.calories * 1.2 +
      consumed.fiber * 20
    );

    // Rank badges & anime flair
    let rankBadge: DeficitAnalysis['rankBadge'];

    if (proteinMetPercentage >= 100 && caloriesMetPercentage >= 90) {
      rankBadge = {
        rank: 'Super Saiyan God',
        title: 'OVER 9,000! ASCENDED BRO',
        color: 'from-amber-400 via-rose-500 to-purple-600',
        glow: 'shadow-[0_0_25px_rgba(245,158,11,0.6)]',
        flairMessage: '⚡ Power Level Maxed! You achieved divine protein hypertrophy!',
      };
    } else if (proteinMetPercentage >= 80) {
      rankBadge = {
        rank: 'S-Rank',
        title: 'S-Rank Elite Slayer',
        color: 'from-cyan-400 to-blue-600',
        glow: 'shadow-[0_0_20px_rgba(6,182,212,0.5)]',
        flairMessage: '🔥 S-Rank Hunter status! Just a pinch of whey or eggs to break the limiter!',
      };
    } else if (proteinMetPercentage >= 60) {
      rankBadge = {
        rank: 'A-Rank',
        title: 'A-Rank Titan Warrior',
        color: 'from-emerald-400 to-teal-600',
        glow: 'shadow-[0_0_15px_rgba(52,211,153,0.4)]',
        flairMessage: '⚡ Solid power accumulation! Fuel up at canteen to charge your ultimate!',
      };
    } else if (proteinMetPercentage >= 40) {
      rankBadge = {
        rank: 'B-Rank',
        title: 'B-Rank Chunin Scout',
        color: 'from-yellow-400 to-amber-600',
        glow: 'shadow-[0_0_12px_rgba(251,191,36,0.3)]',
        flairMessage: '⚠️ Alert: Moderate protein deficit! Grab boiled eggs or chana right now!',
      };
    } else if (proteinMetPercentage >= 20) {
      rankBadge = {
        rank: 'C-Rank',
        title: 'C-Rank Genin Trainee',
        color: 'from-orange-500 to-red-500',
        glow: 'shadow-[0_0_10px_rgba(249,115,22,0.3)]',
        flairMessage: '🚨 Critical Deficit! You are running on carbs and vibes!',
      };
    } else {
      rankBadge = {
        rank: 'E-Rank',
        title: 'E-Rank Novice',
        color: 'from-red-600 to-rose-800',
        glow: 'shadow-[0_0_10px_rgba(225,29,72,0.3)]',
        flairMessage: '💀 Hunger Hollow Warning! Empty stomach detected. Log your mess tray!',
      };
    }

    return {
      target,
      consumed,
      deficit: {
        calories: deficitCalories,
        protein: deficitProtein,
        carbs: deficitCarbs,
        fats: deficitFats,
        fiber: deficitFiber,
      },
      proteinMetPercentage,
      caloriesMetPercentage,
      powerLevelTotal,
      rankBadge,
    };
  }

  public calculateFoodPortion(food: FoodItem, count: number): MacroNutrients {
    const multiplier = Math.max(0, count);
    return {
      calories: Math.round(food.calories * multiplier),
      protein: Math.round(food.protein * multiplier * 10) / 10,
      carbs: Math.round(food.carbs * multiplier * 10) / 10,
      fats: Math.round(food.fats * multiplier * 10) / 10,
      fiber: Math.round(food.fiber * multiplier * 10) / 10,
    };
  }
}
