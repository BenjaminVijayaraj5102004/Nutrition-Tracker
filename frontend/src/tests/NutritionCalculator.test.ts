import { describe, it, expect } from 'vitest';
import { NutritionCalculatorService } from '../core/services/NutritionCalculatorService';
import { INDIAN_MESS_FOOD_DATABASE } from '../core/data/foodDatabase';
import { FoodItem } from '../core/types/nutrition';

describe('NutritionCalculatorService', () => {
  const calculator = new NutritionCalculatorService();

  it('computes daily targets correctly for muscle gain', () => {
    const targets = calculator.calculateDailyTargets(70, 175, 'male', 'muscle_gain', 20);
    // BMR ~ 10*70 + 6.25*175 - 5*20 + 5 = 700 + 1093.75 - 100 + 5 = 1698.75
    // TDEE ~ 1698.75 * 1.4 = 2378.25
    // Muscle gain: ~ 2378 + 350 = ~2728
    // Protein: 70 * 1.9 = 133g
    expect(targets.calories).toBeGreaterThan(2500);
    expect(targets.protein).toBe(133);
    expect(targets.fats).toBeGreaterThan(60);
    expect(targets.carbs).toBeGreaterThan(200);
  });

  it('computes deficit accurately with rank assignment', () => {
    const targets = { calories: 2500, protein: 140, carbs: 300, fats: 70, fiber: 35 };
    const consumed = { calories: 1250, protein: 50, carbs: 180, fats: 35, fiber: 15 };

    const deficit = calculator.calculateDeficit(targets, consumed);
    expect(deficit.deficit.calories).toBe(1250);
    expect(deficit.deficit.protein).toBe(90);
    expect(deficit.proteinMetPercentage).toBe(36);
    expect(deficit.rankBadge.rank).toBe('C-Rank');
  });

  it('multiplies food portions reliably', () => {
    const roti = INDIAN_MESS_FOOD_DATABASE.find((f: FoodItem) => f.id === 'roti_plain')!;
    const portion3 = calculator.calculateFoodPortion(roti, 3);
    expect(portion3.calories).toBe(75 * 3);
    expect(portion3.protein).toBeCloseTo(2.8 * 3, 1);
  });
});
