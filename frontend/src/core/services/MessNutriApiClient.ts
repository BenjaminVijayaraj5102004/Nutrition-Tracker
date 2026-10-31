/**
 * Real API Client for MessNutri Python Backend
 * Base URL: http://127.0.0.1:8000
 * Graceful fallback to client-side logic when backend server is offline.
 */

const API_BASE_URL = 'http://127.0.0.1:8000';

export interface BackendHealthResponse {
  status: string;
  service: string;
  version: string;
}

export interface BackendFoodItem {
  id: string;
  name: string;
  hindi_name?: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  serving_size: string;
  is_veg: boolean;
}

export interface BackendNutritionCalculationResult {
  items: Array<{
    food_item: BackendFoodItem;
    quantity: number;
    subtotal: {
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
      fiber: number;
    };
  }>;
  total_macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
  deficit_report?: {
    daily_protein_target: number;
    consumed_protein: number;
    protein_deficit: number;
    daily_calorie_target: number;
    consumed_calories: number;
    calorie_deficit: number;
    recommended_supplements: Array<{
      food_id: string;
      name: string;
      cost_rupees: number;
      protein_provided: number;
      calories: number;
      rationale: string;
    }>;
  };
}

export class MessNutriApiClient {
  private static baseUrl = API_BASE_URL;

  /**
   * Check connection to Python FastAPI backend
   */
  public static async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) return false;
      const data: BackendHealthResponse = await res.json();
      return data.status === 'healthy';
    } catch {
      return false;
    }
  }

  /**
   * Fetch active food items catalog from Python repository
   */
  public static async fetchFoods(): Promise<BackendFoodItem[] | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/foods`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.foods || [];
    } catch {
      return null;
    }
  }

  /**
   * Fetch canteen supplements from Python repository
   */
  public static async fetchSupplements(): Promise<BackendFoodItem[] | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/supplements`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.supplements || [];
    } catch {
      return null;
    }
  }

  /**
   * Calculate cumulative nutrition and deficit report via Python backend engine
   */
  public static async calculateNutrition(
    items: Array<{ id: string; quantity: number }>,
    userProfile?: {
      weight_kg: number;
      height_cm: number;
      gender: string;
      goal: string;
    }
  ): Promise<BackendNutritionCalculationResult | null> {
    try {
      const payload: any = { items };
      if (userProfile) {
        payload.user_profile = {
          user_id: 'student_web',
          name: 'Student',
          age: 20,
          gender: userProfile.gender,
          weight_kg: userProfile.weight_kg,
          height_cm: userProfile.height_cm,
          activity_level: 'moderately_active',
          goal: userProfile.goal,
        };
      }

      const res = await fetch(`${this.baseUrl}/api/nutrition/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Parse OCR or pasted text via Python backend NLP/Fuzzy tokenizer
   */
  public static async parseMenuText(rawText: string): Promise<{
    matchedDishes: string[];
    detectedIds: string[];
    totalMacros: any;
  } | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/menu/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_text: rawText }),
      });

      if (!res.ok) return null;
      const data = await res.json();
      const matchedDishes = (data.parsed_items || []).map((it: any) => it.food_item.name);
      const detectedIds = (data.parsed_items || []).map((it: any) => it.food_item.id);

      return {
        matchedDishes,
        detectedIds,
        totalMacros: data.total_macros,
      };
    } catch {
      return null;
    }
  }
}
