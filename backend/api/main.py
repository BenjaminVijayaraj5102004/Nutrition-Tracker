"""FastAPI controller and endpoints for MessNutri."""
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from backend.models.domain import (
    MealType,
    FoodCategory,
    GoalType,
    ActivityLevel,
    Gender,
    UserProfile,
    MealItemSelection,
    MacroNutrients,
)
from backend.repositories.food_repository import (
    IFoodRepository,
    InMemoryIndianFoodRepository,
)
from backend.services.nutrition_service import (
    NutritionCalculatorService,
    MenuParserService,
    DeficitAnalyzerService,
)

# App instance
app = FastAPI(
    title="Hostel Mess Nutrition Platform (MessNutri) API",
    description="Intelligent Indian mess food nutrition tracker, OCR menu parser, and deficit supplement recommender.",
    version="1.0.0",
)

# Enable CORS for frontend Vite/React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Singleton dependency container
_repo = InMemoryIndianFoodRepository()
_calculator = NutritionCalculatorService()
_parser = MenuParserService(_repo)
_deficit_analyzer = DeficitAnalyzerService(_repo)


def get_food_repo() -> IFoodRepository:
    return _repo


def get_calculator() -> NutritionCalculatorService:
    return _calculator


def get_parser() -> MenuParserService:
    return _parser


def get_deficit_analyzer() -> DeficitAnalyzerService:
    return _deficit_analyzer


# =====================================================================
# REQUEST & RESPONSE SCHEMAS (DTOs)
# =====================================================================

class FoodItemDTO(BaseModel):
    id: str
    quantity: float = 1.0


class UserProfileDTO(BaseModel):
    user_id: str = "student_01"
    name: str = "Alex"
    age: int = Field(20, ge=15, le=90)
    gender: Gender = Gender.MALE
    weight_kg: float = Field(68.0, gt=30, lt=250)
    height_cm: float = Field(175.0, gt=100, lt=250)
    activity_level: ActivityLevel = ActivityLevel.MODERATELY_ACTIVE
    goal: GoalType = GoalType.MUSCLE_GAIN
    target_protein_g_per_kg: Optional[float] = None


class NutritionCalculationRequest(BaseModel):
    items: List[FoodItemDTO]
    user_profile: Optional[UserProfileDTO] = None


class MenuParseRequest(BaseModel):
    raw_text: str
    meal_type: Optional[MealType] = MealType.LUNCH
    user_profile: Optional[UserProfileDTO] = None


# =====================================================================
# API ROUTES
# =====================================================================

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "MessNutri Backend Engine",
        "version": "1.0.0",
    }


@app.get("/api/foods")
def list_foods(
    category: Optional[FoodCategory] = None,
    query: Optional[str] = None,
    repo: IFoodRepository = Depends(get_food_repo),
):
    """Retrieve food items from repository with optional search or category filter."""
    if query:
        items = repo.search_by_name(query)
    elif category:
        items = repo.get_by_category(category)
    else:
        items = repo.get_all()
    return {"foods": [item.to_dict() for item in items]}


@app.get("/api/supplements")
def list_supplements(repo: IFoodRepository = Depends(get_food_repo)):
    """Retrieve campus canteen supplements and pocket-friendly protein sources."""
    items = repo.get_canteen_supplements()
    return {"supplements": [item.to_dict() for item in items]}


@app.get("/api/fruits")
def list_campus_fruits(repo: IFoodRepository = Depends(get_food_repo)):
    """Retrieve campus fruit stall options."""
    items = repo.get_campus_fruits()
    return {"fruits": [item.to_dict() for item in items]}


@app.post("/api/nutrition/calculate")
def calculate_nutrition(
    payload: NutritionCalculationRequest,
    repo: IFoodRepository = Depends(get_food_repo),
    calc: NutritionCalculatorService = Depends(get_calculator),
    analyzer: DeficitAnalyzerService = Depends(get_deficit_analyzer),
):
    """Calculate cumulative macros for a list of food item IDs and quantities, and optional deficit against user profile."""
    selections: List[MealItemSelection] = []
    not_found = []

    for item_req in payload.items:
        food = repo.get_by_id(item_req.id)
        if food:
            selections.append(MealItemSelection(food_item=food, quantity=item_req.quantity))
        else:
            not_found.append(item_req.id)

    total_macros = calc.calculate_selections(selections)

    deficit_report = None
    if payload.user_profile:
        user = UserProfile(
            user_id=payload.user_profile.user_id,
            name=payload.user_profile.name,
            age=payload.user_profile.age,
            gender=payload.user_profile.gender,
            weight_kg=payload.user_profile.weight_kg,
            height_cm=payload.user_profile.height_cm,
            activity_level=payload.user_profile.activity_level,
            goal=payload.user_profile.goal,
            target_protein_g_per_kg=payload.user_profile.target_protein_g_per_kg,
        )
        deficit_report = analyzer.analyze(total_macros, user).to_dict()

    return {
        "items": [s.to_dict() for s in selections],
        "not_found": not_found,
        "total_macros": total_macros.to_dict(),
        "deficit_report": deficit_report,
    }


@app.post("/api/menu/parse")
def parse_menu_text(
    payload: MenuParseRequest,
    parser: MenuParserService = Depends(get_parser),
    calc: NutritionCalculatorService = Depends(get_calculator),
    analyzer: DeficitAnalyzerService = Depends(get_deficit_analyzer),
):
    """Tokenize and fuzzy-match raw OCR text from a mess notice board or chat message into structured meal items."""
    if not payload.raw_text.strip():
        raise HTTPException(status_code=400, detail="Empty text supplied")

    selections = parser.parse_raw_text(payload.raw_text)
    total_macros = calc.calculate_selections(selections)

    deficit_report = None
    if payload.user_profile:
        user = UserProfile(
            user_id=payload.user_profile.user_id,
            name=payload.user_profile.name,
            age=payload.user_profile.age,
            gender=payload.user_profile.gender,
            weight_kg=payload.user_profile.weight_kg,
            height_cm=payload.user_profile.height_cm,
            activity_level=payload.user_profile.activity_level,
            goal=payload.user_profile.goal,
            target_protein_g_per_kg=payload.user_profile.target_protein_g_per_kg,
        )
        deficit_report = analyzer.analyze(total_macros, user).to_dict()

    return {
        "raw_input": payload.raw_text,
        "detected_items": [s.to_dict() for s in selections],
        "total_macros": total_macros.to_dict(),
        "deficit_report": deficit_report,
    }


@app.post("/api/user/profile-targets")
def get_user_targets(
    user_dto: UserProfileDTO,
    calc: NutritionCalculatorService = Depends(get_calculator),
):
    """Compute BMR, TDEE, and macro splits for a student profile."""
    user = UserProfile(
        user_id=user_dto.user_id,
        name=user_dto.name,
        age=user_dto.age,
        gender=user_dto.gender,
        weight_kg=user_dto.weight_kg,
        height_cm=user_dto.height_cm,
        activity_level=user_dto.activity_level,
        goal=user_dto.goal,
        target_protein_g_per_kg=user_dto.target_protein_g_per_kg,
    )
    return user.to_dict()
