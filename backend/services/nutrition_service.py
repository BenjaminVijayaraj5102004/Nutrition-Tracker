"""Services implementing business logic, calculations, OCR parsing, and deficit analysis."""
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import re

from backend.models.domain import (
    MacroNutrients,
    FoodItem,
    MealItemSelection,
    Meal,
    MealType,
    DailyMenu,
    UserProfile,
    DeficitReport,
    SupplementRecommendation,
)
from backend.repositories.food_repository import IFoodRepository


# =====================================================================
# 1. NUTRITION CALCULATOR SERVICE (STRATEGY PATTERN FOR MACROS & BMR/TDEE)
# =====================================================================

class IMacroCalculationStrategy(ABC):
    @abstractmethod
    def calculate(self, items: List[MealItemSelection]) -> MacroNutrients:
        pass


class StandardMacroCalculationStrategy(IMacroCalculationStrategy):
    """Calculates cumulative sum of macronutrients for selected items with portion multiplier."""
    def calculate(self, items: List[MealItemSelection]) -> MacroNutrients:
        total = MacroNutrients(calories=0.0, protein_g=0.0, carbs_g=0.0, fats_g=0.0, fiber_g=0.0)
        for selection in items:
            total = total.add(selection.total_macros)
        return total


class NutritionCalculatorService:
    """Service responsible for portion calculations, meal aggregates, and BMR/TDEE."""

    def __init__(self, strategy: Optional[IMacroCalculationStrategy] = None):
        self._strategy = strategy or StandardMacroCalculationStrategy()

    def calculate_meal_macros(self, meal: Meal) -> MacroNutrients:
        return self._strategy.calculate(meal.items)

    def calculate_selections(self, selections: List[MealItemSelection]) -> MacroNutrients:
        return self._strategy.calculate(selections)

    def calculate_daily_macros(self, daily_menu: DailyMenu) -> MacroNutrients:
        total = MacroNutrients(calories=0.0, protein_g=0.0, carbs_g=0.0, fats_g=0.0, fiber_g=0.0)
        for meal in daily_menu.meals.values():
            total = total.add(self.calculate_meal_macros(meal))
        return total

    def compute_user_targets(self, user: UserProfile) -> Dict[str, Any]:
        bmr = user.calculate_bmr()
        tdee = user.calculate_tdee()
        targets = user.get_target_macros()
        return {
            "bmr": round(bmr, 1),
            "tdee": round(tdee, 1),
            "target_macros": targets.to_dict(),
        }


# =====================================================================
# 2. MENU PARSER SERVICE (TEXT & OCR TOKEN CLEANER + FUZZY MATCHING)
# =====================================================================

class IMenuParserService(ABC):
    @abstractmethod
    def parse_raw_text(self, text: str) -> List[MealItemSelection]:
        pass

    @abstractmethod
    def parse_meal_text(self, meal_type: MealType, text: str) -> Meal:
        pass


class MenuParserService(IMenuParserService):
    """Parses raw text (such as mess notice board OCR output or student input) into structured meals."""

    # Words to ignore (connectors, days, generic headers)
    STOPWORDS = {
        "and", "with", "or", "&", "the", "a", "an", "served", "special",
        "mess", "hostel", "menu", "today", "day", "daily", "unlimited", "limited",
        "breakfast", "lunch", "dinner", "snacks", "evening", "morning", "night",
        "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
    }

    # Number word conversion dictionary
    NUMBER_WORDS = {
        "one": 1.0, "two": 2.0, "three": 3.0, "four": 4.0, "five": 5.0,
        "half": 0.5, "double": 2.0, "single": 1.0, "triple": 3.0,
        "1": 1.0, "2": 2.0, "3": 3.0, "4": 4.0, "5": 5.0, "6": 6.0, "7": 7.0, "8": 8.0
    }

    def __init__(self, food_repository: IFoodRepository):
        self._repo = food_repository

    def _extract_quantity(self, phrase: str) -> (float, str):
        """Extract leading or embedded quantity (e.g. '3 rotis', '2 bananas', 'half cup') and clean the phrase."""
        tokens = phrase.strip().split()
        if not tokens:
            return 1.0, phrase

        first_token = tokens[0].lower()
        if first_token in self.NUMBER_WORDS:
            cleaned = " ".join(tokens[1:])
            return self.NUMBER_WORDS[first_token], cleaned

        # Check numeric token like '3' or '2.5'
        try:
            val = float(first_token)
            cleaned = " ".join(tokens[1:])
            return val, cleaned
        except ValueError:
            pass

        # Check trailing quantity like 'roti x 3' or 'banana (2)'
        trailing_match = re.search(r"x\s*(\d+(\.\d+)?)$|\((\d+(\.\d+)?)\)$", phrase, re.IGNORECASE)
        if trailing_match:
            num_str = trailing_match.group(1) or trailing_match.group(3)
            cleaned = re.sub(r"x\s*(\d+(\.\d+)?)$|\((\d+(\.\d+)?)\)$", "", phrase, flags=re.IGNORECASE).strip()
            return float(num_str), cleaned

        return 1.0, phrase

    def parse_raw_text(self, text: str) -> List[MealItemSelection]:
        """Split text by commas, newlines, colons, slashes, plus signs, bullets, and match food items."""
        # Replace connectors like ' and ' or ' & ' with commas to separate items
        normalized = re.sub(r"\b(and|&)\b", ",", text, flags=re.IGNORECASE)
        # Normalize delimiters (colons, newlines, slashes, plus signs, bullets, etc.)
        cleaned_text = re.sub(r"[:•\*\n\r\t\|\/\+;]+", ",", normalized)
        raw_chunks = [c.strip() for c in cleaned_text.split(",") if c.strip()]

        selections: List[MealItemSelection] = []
        for chunk in raw_chunks:
            qty, item_phrase = self._extract_quantity(chunk)
            
            # Remove stopwords
            sub_tokens = [w for w in item_phrase.split() if w.lower() not in self.STOPWORDS]
            search_query = " ".join(sub_tokens).strip()

            if not search_query:
                continue

            matched_item = self._repo.find_best_match(search_query, threshold=0.55)
            if matched_item:
                selections.append(MealItemSelection(food_item=matched_item, quantity=qty))

        return selections

    def parse_meal_text(self, meal_type: MealType, text: str) -> Meal:
        selections = self.parse_raw_text(text)
        return Meal(meal_type=meal_type, items=selections)


# =====================================================================
# 3. DEFICIT ANALYZER SERVICE (DEFICIT BREAKDOWN + CANTEEN / GROCERY ENGINE)
# =====================================================================

class IDeficitAnalyzerService(ABC):
    @abstractmethod
    def analyze(self, actual: MacroNutrients, user: UserProfile) -> DeficitReport:
        pass


class DeficitAnalyzerService(IDeficitAnalyzerService):
    """Compares mess food intake against student personal goals, detects deficits, and recommends canteen items."""

    def __init__(self, food_repository: IFoodRepository):
        self._repo = food_repository

    def analyze(self, actual: MacroNutrients, user: UserProfile) -> DeficitReport:
        target = user.get_target_macros()

        deficit_calories = target.calories - actual.calories
        deficit_protein = target.protein_g - actual.protein_g
        deficit_carbs = target.carbs_g - actual.carbs_g
        deficit_fats = target.fats_g - actual.fats_g
        deficit_fiber = target.fiber_g - actual.fiber_g

        # Determine nutritional status
        if deficit_protein > 15.0:
            status = "severe_protein_deficit"
        elif deficit_protein > 5.0:
            status = "moderate_protein_deficit"
        elif deficit_calories > 350.0:
            status = "calorie_deficit"
        elif deficit_calories < -400.0:
            status = "calorie_surplus"
        else:
            status = "on_track"

        recommendations = self._generate_recommendations(deficit_protein, deficit_calories, deficit_fiber)

        return DeficitReport(
            target=target,
            actual=actual,
            deficit_calories=deficit_calories,
            deficit_protein_g=deficit_protein,
            deficit_carbs_g=deficit_carbs,
            deficit_fats_g=deficit_fats,
            deficit_fiber_g=deficit_fiber,
            status=status,
            recommendations=recommendations,
        )

    def _generate_recommendations(
        self,
        protein_deficit: float,
        calorie_deficit: float,
        fiber_deficit: float,
    ) -> List[SupplementRecommendation]:
        """Produce targeted, cost-effective hostel recommendations."""
        recommendations: List[SupplementRecommendation] = []

        if protein_deficit > 8.0:
            # 1. Budget whole-food protein (Boiled Eggs or Milk or Sattu)
            boiled_egg = self._repo.get_by_id("boiled_egg")
            if boiled_egg:
                eggs_needed = min(4.0, max(2.0, round(protein_deficit / boiled_egg.macros.protein_g)))
                recommendations.append(SupplementRecommendation(
                    food_item=boiled_egg,
                    recommended_quantity=eggs_needed,
                    reason=f"Covers ~{round(eggs_needed * boiled_egg.macros.protein_g, 1)}g bioavailable protein for under ₹{round(eggs_needed * (boiled_egg.price_inr or 8))}.",
                    estimated_cost_inr=eggs_needed * (boiled_egg.price_inr or 8.0)
                ))

            # 2. Vegetarian high-protein desi drink (Sattu)
            sattu = self._repo.get_by_id("sattu_drink")
            if sattu:
                recommendations.append(SupplementRecommendation(
                    food_item=sattu,
                    recommended_quantity=1.0,
                    reason="Budget vegetarian plant protein delivering 10g protein and 7.5g digestive gut fiber.",
                    estimated_cost_inr=sattu.price_inr or 20.0
                ))

            # 3. Fast whey option if high deficit
            if protein_deficit >= 20.0:
                whey = self._repo.get_by_id("whey_protein_scoop")
                if whey:
                    recommendations.append(SupplementRecommendation(
                        food_item=whey,
                        recommended_quantity=1.0,
                        reason="Instant 24g pure whey isolate/concentrate scoop to bridge steep gym deficit quickly.",
                        estimated_cost_inr=whey.price_inr or 70.0
                    ))

            # 4. Milk packet option
            milk = self._repo.get_by_id("milk_packet_500ml")
            if milk and len(recommendations) < 3:
                recommendations.append(SupplementRecommendation(
                    food_item=milk,
                    recommended_quantity=1.0,
                    reason="500ml toned packet provides 16g slow-digesting casein protein, ideal before bed.",
                    estimated_cost_inr=milk.price_inr or 27.0
                ))

        # Check fiber deficit or healthy snack
        if fiber_deficit > 8.0:
            chana = self._repo.get_by_id("roasted_chana")
            if chana:
                recommendations.append(SupplementRecommendation(
                    food_item=chana,
                    recommended_quantity=1.0,
                    reason="Roasted chana in your hostel room adds 8g dietary fiber plus 9.5g protein with zero mess cooking.",
                    estimated_cost_inr=chana.price_inr or 15.0
                ))

            guava = self._repo.get_by_id("guava")
            if guava and len(recommendations) < 4:
                recommendations.append(SupplementRecommendation(
                    food_item=guava,
                    recommended_quantity=1.0,
                    reason="Campus fruit stall guava delivers 5.4g fiber and mega-dose vitamin C.",
                    estimated_cost_inr=15.0
                ))

        # Check bulking / calorie deficit
        if calorie_deficit > 300.0:
            pb = self._repo.get_by_id("peanut_butter")
            banana = self._repo.get_by_id("banana")
            if pb and banana:
                recommendations.append(SupplementRecommendation(
                    food_item=pb,
                    recommended_quantity=1.0,
                    reason="Add 1 tbsp peanut butter with a campus banana for ~300 clean calorie boost.",
                    estimated_cost_inr=pb.price_inr or 20.0
                ))

        return recommendations
