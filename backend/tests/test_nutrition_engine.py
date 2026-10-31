"""Unit tests for Indian Food Repository, Nutrition Calculator, Menu Parser, and Deficit Analyzer."""
import pytest
from backend.models.domain import (
    UserProfile,
    Gender,
    ActivityLevel,
    GoalType,
    FoodCategory,
    MealType,
    MacroNutrients,
    MealItemSelection,
    Meal,
)
from backend.repositories.food_repository import InMemoryIndianFoodRepository
from backend.services.nutrition_service import (
    NutritionCalculatorService,
    MenuParserService,
    DeficitAnalyzerService,
)


@pytest.fixture
def food_repo():
    return InMemoryIndianFoodRepository()


@pytest.fixture
def sample_user():
    return UserProfile(
        user_id="std_101",
        name="Rohan",
        age=20,
        gender=Gender.MALE,
        weight_kg=70.0,
        height_cm=175.0,
        activity_level=ActivityLevel.MODERATELY_ACTIVE,
        goal=GoalType.MUSCLE_GAIN,
        target_protein_g_per_kg=2.0,
    )


def test_repository_contains_all_core_hostel_items(food_repo):
    """Verify that breakfast, lunch/dinner, campus fruits, and canteen supplements exist in repository."""
    breakfast_keys = ["idli", "sambar", "coconut_chutney", "plain_dosa", "poha", "upma", "aloo_paratha", "aloo_puri", "bread_butter", "bread_jam", "chai_tea", "coffee", "plain_milk"]
    lunch_keys = ["roti", "steamed_rice", "jeera_rice", "dal_tadka", "dal_makhani", "rasam", "curd", "paneer_butter_masala", "matar_paneer", "chole", "rajma", "soya_chunks_curry", "aloo_gobi", "bhindi_masala", "egg_curry", "chicken_curry"]
    fruit_keys = ["banana", "papaya", "apple", "orange", "watermelon", "guava"]
    canteen_keys = ["boiled_egg", "egg_omelette", "milk_packet_500ml", "roasted_chana", "peanut_butter", "whey_protein_scoop", "sattu_drink"]

    for key in breakfast_keys + lunch_keys + fruit_keys + canteen_keys:
        item = food_repo.get_by_id(key)
        assert item is not None, f"Item {key} not found in repository"
        assert item.macros.calories > 0


def test_repository_fuzzy_matching(food_repo):
    """Test OCR fuzzy string matching against food names and aliases."""
    # Test common mess menu variations
    match1 = food_repo.find_best_match("chappathi")
    assert match1 is not None and match1.id == "roti"

    match2 = food_repo.find_best_match("dal tadka yellow")
    assert match2 is not None and match2.id == "dal_tadka"

    match3 = food_repo.find_best_match("steamed rice bowl")
    assert match3 is not None and match3.id == "steamed_rice"

    match4 = food_repo.find_best_match("amla/guava")
    assert match4 is not None and match4.id == "guava"

    match5 = food_repo.find_best_match("bhuna chana")
    assert match5 is not None and match5.id == "roasted_chana"


def test_bmr_and_tdee_calculation(sample_user):
    """Test Mifflin-St Jeor formula for a 20yo male, 70kg, 175cm."""
    # BMR = 10 * 70 + 6.25 * 175 - 5 * 20 + 5
    # BMR = 700 + 1093.75 - 100 + 5 = 1698.75
    bmr = sample_user.calculate_bmr()
    assert abs(bmr - 1698.75) < 0.1

    # TDEE for Moderately Active (1.55) = 1698.75 * 1.55 = 2633.06
    tdee = sample_user.calculate_tdee()
    assert abs(tdee - 2633.06) < 1.0

    # Muscle gain adds 350 kcal
    targets = sample_user.get_target_macros()
    assert abs(targets.calories - 2983.1) < 2.0
    # Protein = 70 * 2.0 = 140g
    assert targets.protein_g == 140.0


def test_portion_multiplier_and_meal_totals(food_repo):
    """Verify portion multiplier accurately scales macros."""
    calc = NutritionCalculatorService()
    roti = food_repo.get_by_id("roti")
    dal = food_repo.get_by_id("dal_tadka")

    # 4 rotis and 2 katoris of dal
    meal = Meal(meal_type=MealType.LUNCH)
    meal.add_item(roti, quantity=4.0)
    meal.add_item(dal, quantity=2.0)

    totals = calc.calculate_meal_macros(meal)
    expected_calories = (roti.macros.calories * 4) + (dal.macros.calories * 2)
    expected_protein = (roti.macros.protein_g * 4) + (dal.macros.protein_g * 2)

    assert abs(totals.calories - expected_calories) < 0.01
    assert abs(totals.protein_g - expected_protein) < 0.01


def test_menu_parser_service_ocr_text(food_repo):
    """Verify parsing multi-item messy text notice board output."""
    parser = MenuParserService(food_repo)
    raw_ocr = "Hostel Special Lunch: 3 rotis, 1 cup Steamed Rice, Dal Tadka, Curd and 1 Banana"

    selections = parser.parse_raw_text(raw_ocr)
    detected_ids = [s.food_item.id for s in selections]

    assert "roti" in detected_ids
    assert "steamed_rice" in detected_ids
    assert "dal_tadka" in detected_ids
    assert "curd" in detected_ids
    assert "banana" in detected_ids

    # Verify quantity extracted for rotis was 3
    roti_selection = next(s for s in selections if s.food_item.id == "roti")
    assert roti_selection.quantity == 3.0


def test_deficit_analyzer_recommends_budget_supplements(food_repo, sample_user):
    """Verify that severe protein deficit triggers targeted hostel recommendations like boiled eggs / whey / sattu."""
    analyzer = DeficitAnalyzerService(food_repo)
    
    # Low protein meal: 400 kcal, only 10g protein (User target is 140g protein)
    actual_macros = MacroNutrients(calories=1200.0, protein_g=30.0, carbs_g=180.0, fats_g=35.0, fiber_g=8.0)
    report = analyzer.analyze(actual_macros, sample_user)

    assert report.deficit_protein_g > 100.0
    assert report.status == "severe_protein_deficit"
    assert len(report.recommendations) >= 2

    # Check recommended supplement IDs
    rec_ids = [r.food_item.id for r in report.recommendations]
    assert any(x in rec_ids for x in ["boiled_egg", "whey_protein_scoop", "sattu_drink"])
