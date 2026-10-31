"""Domain models for the Hostel Mess Nutrition Platform."""
from dataclasses import dataclass, field
from enum import Enum
from typing import List, Optional, Dict, Any


class MealType(str, Enum):
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    SNACKS = "snacks"
    DINNER = "dinner"


class FoodCategory(str, Enum):
    GRAIN = "grain"
    PULSE = "pulse"
    CURRY = "curry"
    DAIRY = "dairy"
    FRUIT = "fruit"
    BEVERAGE = "beverage"
    SUPPLEMENT = "supplement"
    SNACK = "snack"
    NON_VEG = "non_veg"


class GoalType(str, Enum):
    MAINTENANCE = "maintenance"
    WEIGHT_LOSS = "weight_loss"
    MUSCLE_GAIN = "muscle_gain"
    ENDURANCE = "endurance"


class ActivityLevel(str, Enum):
    SEDENTARY = "sedentary"          # 1.2
    LIGHTLY_ACTIVE = "lightly_active" # 1.375
    MODERATELY_ACTIVE = "moderately_active" # 1.55
    VERY_ACTIVE = "very_active"      # 1.725
    EXTRA_ACTIVE = "extra_active"    # 1.9


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


@dataclass(frozen=True)
class MacroNutrients:
    calories: float
    protein_g: float
    carbs_g: float
    fats_g: float
    fiber_g: float = 0.0

    def multiply(self, factor: float) -> "MacroNutrients":
        return MacroNutrients(
            calories=round(self.calories * factor, 2),
            protein_g=round(self.protein_g * factor, 2),
            carbs_g=round(self.carbs_g * factor, 2),
            fats_g=round(self.fats_g * factor, 2),
            fiber_g=round(self.fiber_g * factor, 2),
        )

    def add(self, other: "MacroNutrients") -> "MacroNutrients":
        return MacroNutrients(
            calories=round(self.calories + other.calories, 2),
            protein_g=round(self.protein_g + other.protein_g, 2),
            carbs_g=round(self.carbs_g + other.carbs_g, 2),
            fats_g=round(self.fats_g + other.fats_g, 2),
            fiber_g=round(self.fiber_g + other.fiber_g, 2),
        )

    def to_dict(self) -> Dict[str, float]:
        return {
            "calories": self.calories,
            "protein_g": self.protein_g,
            "carbs_g": self.carbs_g,
            "fats_g": self.fats_g,
            "fiber_g": self.fiber_g,
        }


@dataclass
class FoodItem:
    id: str
    name: str
    hindi_name: Optional[str]
    category: FoodCategory
    serving_unit: str  # e.g., "piece", "katori (150ml)", "plate", "glass (200ml)", "scoop (30g)"
    serving_size_g: float
    macros: MacroNutrients
    aliases: List[str] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)
    price_inr: Optional[float] = None  # Relevant for canteen supplements

    def get_macros_for_quantity(self, quantity: float = 1.0) -> MacroNutrients:
        return self.macros.multiply(quantity)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "hindi_name": self.hindi_name,
            "category": self.category.value,
            "serving_unit": self.serving_unit,
            "serving_size_g": self.serving_size_g,
            "macros": self.macros.to_dict(),
            "aliases": self.aliases,
            "tags": self.tags,
            "price_inr": self.price_inr,
        }


@dataclass
class MealItemSelection:
    food_item: FoodItem
    quantity: float = 1.0

    @property
    def total_macros(self) -> MacroNutrients:
        return self.food_item.get_macros_for_quantity(self.quantity)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "food_item": self.food_item.to_dict(),
            "quantity": self.quantity,
            "total_macros": self.total_macros.to_dict(),
        }


@dataclass
class Meal:
    meal_type: MealType
    items: List[MealItemSelection] = field(default_factory=list)

    def add_item(self, food: FoodItem, quantity: float = 1.0) -> None:
        self.items.append(MealItemSelection(food_item=food, quantity=quantity))

    @property
    def total_macros(self) -> MacroNutrients:
        total = MacroNutrients(calories=0, protein_g=0, carbs_g=0, fats_g=0, fiber_g=0)
        for item in self.items:
            total = total.add(item.total_macros)
        return total

    def to_dict(self) -> Dict[str, Any]:
        return {
            "meal_type": self.meal_type.value,
            "items": [item.to_dict() for item in self.items],
            "total_macros": self.total_macros.to_dict(),
        }


@dataclass
class DailyMenu:
    day_of_week: str  # "monday", "tuesday", etc.
    meals: Dict[MealType, Meal] = field(default_factory=dict)

    def get_meal(self, meal_type: MealType) -> Optional[Meal]:
        return self.meals.get(meal_type)

    def set_meal(self, meal_type: MealType, meal: Meal) -> None:
        self.meals[meal_type] = meal

    @property
    def total_macros(self) -> MacroNutrients:
        total = MacroNutrients(calories=0, protein_g=0, carbs_g=0, fats_g=0, fiber_g=0)
        for meal in self.meals.values():
            total = total.add(meal.total_macros)
        return total

    def to_dict(self) -> Dict[str, Any]:
        return {
            "day_of_week": self.day_of_week,
            "meals": {k.value: v.to_dict() for k, v in self.meals.items()},
            "total_macros": self.total_macros.to_dict(),
        }


@dataclass
class WeeklySchedule:
    hostel_name: str
    schedule: Dict[str, DailyMenu] = field(default_factory=dict)

    def add_daily_menu(self, daily_menu: DailyMenu) -> None:
        self.schedule[daily_menu.day_of_week.lower()] = daily_menu

    def get_daily_menu(self, day: str) -> Optional[DailyMenu]:
        return self.schedule.get(day.lower())

    def to_dict(self) -> Dict[str, Any]:
        return {
            "hostel_name": self.hostel_name,
            "schedule": {k: v.to_dict() for k, v in self.schedule.items()},
        }


@dataclass
class UserProfile:
    user_id: str
    name: str
    age: int
    gender: Gender
    weight_kg: float
    height_cm: float
    activity_level: ActivityLevel
    goal: GoalType
    target_protein_g_per_kg: Optional[float] = None

    def calculate_bmr(self) -> float:
        """Calculate BMR using the Mifflin-St Jeor formula."""
        # Mifflin-St Jeor:
        # Men: 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) + 5
        # Women: 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) - 161
        base = (10 * self.weight_kg) + (6.25 * self.height_cm) - (5 * self.age)
        if self.gender == Gender.MALE:
            return base + 5
        elif self.gender == Gender.FEMALE:
            return base - 161
        else:
            return base - 78  # Average of male and female offset

    def calculate_tdee(self) -> float:
        """Calculate Total Daily Energy Expenditure (TDEE)."""
        multipliers = {
            ActivityLevel.SEDENTARY: 1.2,
            ActivityLevel.LIGHTLY_ACTIVE: 1.375,
            ActivityLevel.MODERATELY_ACTIVE: 1.55,
            ActivityLevel.VERY_ACTIVE: 1.725,
            ActivityLevel.EXTRA_ACTIVE: 1.9,
        }
        return self.calculate_bmr() * multipliers.get(self.activity_level, 1.2)

    def get_target_macros(self) -> MacroNutrients:
        """Compute target calories and macros based on goal."""
        tdee = self.calculate_tdee()
        
        if self.goal == GoalType.WEIGHT_LOSS:
            target_calories = max(1200.0, tdee - 500)
            protein_ratio = self.target_protein_g_per_kg or 1.8
        elif self.goal == GoalType.MUSCLE_GAIN:
            target_calories = tdee + 350
            protein_ratio = self.target_protein_g_per_kg or 2.0
        elif self.goal == GoalType.ENDURANCE:
            target_calories = tdee + 200
            protein_ratio = self.target_protein_g_per_kg or 1.6
        else:  # MAINTENANCE
            target_calories = tdee
            protein_ratio = self.target_protein_g_per_kg or 1.4

        target_protein = self.weight_kg * protein_ratio
        
        # 25% of calories from fat
        fat_calories = target_calories * 0.25
        target_fats = fat_calories / 9.0

        # Remaining calories from carbohydrates
        protein_calories = target_protein * 4.0
        remaining_carbs_calories = max(0.0, target_calories - protein_calories - fat_calories)
        target_carbs = remaining_carbs_calories / 4.0

        return MacroNutrients(
            calories=round(target_calories, 1),
            protein_g=round(target_protein, 1),
            carbs_g=round(target_carbs, 1),
            fats_g=round(target_fats, 1),
            fiber_g=round(30.0, 1),
        )

    def to_dict(self) -> Dict[str, Any]:
        return {
            "user_id": self.user_id,
            "name": self.name,
            "age": self.age,
            "gender": self.gender.value,
            "weight_kg": self.weight_kg,
            "height_cm": self.height_cm,
            "activity_level": self.activity_level.value,
            "goal": self.goal.value,
            "target_protein_g_per_kg": self.target_protein_g_per_kg,
            "bmr": round(self.calculate_bmr(), 1),
            "tdee": round(self.calculate_tdee(), 1),
            "target_macros": self.get_target_macros().to_dict(),
        }


@dataclass
class SupplementRecommendation:
    food_item: FoodItem
    recommended_quantity: float
    reason: str
    estimated_cost_inr: Optional[float] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "food_item": self.food_item.to_dict(),
            "recommended_quantity": self.recommended_quantity,
            "serving_description": f"{self.recommended_quantity} x {self.food_item.serving_unit}",
            "macros_provided": self.food_item.get_macros_for_quantity(self.recommended_quantity).to_dict(),
            "reason": self.reason,
            "estimated_cost_inr": (self.food_item.price_inr * self.recommended_quantity) if self.food_item.price_inr else None,
        }


@dataclass
class DeficitReport:
    target: MacroNutrients
    actual: MacroNutrients
    deficit_calories: float
    deficit_protein_g: float
    deficit_carbs_g: float
    deficit_fats_g: float
    deficit_fiber_g: float
    status: str  # "on_track", "protein_deficient", "calorie_deficit", "surplus"
    recommendations: List[SupplementRecommendation] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "target": self.target.to_dict(),
            "actual": self.actual.to_dict(),
            "deficits": {
                "calories": round(self.deficit_calories, 1),
                "protein_g": round(self.deficit_protein_g, 1),
                "carbs_g": round(self.deficit_carbs_g, 1),
                "fats_g": round(self.deficit_fats_g, 1),
                "fiber_g": round(self.deficit_fiber_g, 1),
            },
            "status": self.status,
            "recommendations": [rec.to_dict() for rec in self.recommendations],
        }
