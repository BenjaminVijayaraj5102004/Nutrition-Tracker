export interface IStorageService {
  getItem<T>(key: string, defaultValue: T): T;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
  clear(): void;
}

export interface INutritionCalculatorService {
  calculateDailyTargets(weightKg: number, heightCm: number, gender: string, goal: string): {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
  calculateDeficit(targets: any, consumed: any): any;
  calculateFoodPortion(food: any, count: number): any;
}

export interface IOcrScannerService {
  scanMenuImage(file: File | Blob): Promise<{
    rawText: string;
    detectedDays: Record<string, { breakfast: string[]; lunch: string[]; snacks: string[]; dinner: string[] }>;
    matchedFoodIds: string[];
    confidence: number;
  }>;
}

export interface IAudioEffectsService {
  playLevelUp(): void;
  playAdd(): void;
  playAlert(): void;
  playPowerSurge(): void;
}
