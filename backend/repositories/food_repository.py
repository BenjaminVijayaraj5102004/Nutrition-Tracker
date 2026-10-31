"""Repository pattern for Indian Food Composition database focusing on hostel mess, campus fruits, and canteen items."""
from abc import ABC, abstractmethod
from typing import List, Optional, Dict
from difflib import SequenceMatcher

from backend.models.domain import FoodItem, FoodCategory, MacroNutrients


class IFoodRepository(ABC):
    @abstractmethod
    def get_by_id(self, item_id: str) -> Optional[FoodItem]:
        pass

    @abstractmethod
    def get_all(self) -> List[FoodItem]:
        pass

    @abstractmethod
    def search_by_name(self, query: str) -> List[FoodItem]:
        pass

    @abstractmethod
    def find_best_match(self, query: str, threshold: float = 0.55) -> Optional[FoodItem]:
        pass

    @abstractmethod
    def get_by_category(self, category: FoodCategory) -> List[FoodItem]:
        pass

    @abstractmethod
    def get_canteen_supplements(self) -> List[FoodItem]:
        pass

    @abstractmethod
    def get_campus_fruits(self) -> List[FoodItem]:
        pass


class InMemoryIndianFoodRepository(IFoodRepository):
    """Repository storing standard Indian mess food, fruits, and canteen items."""

    def __init__(self):
        self._items: Dict[str, FoodItem] = {}
        self._populate_database()

    def _add(self, item: FoodItem) -> None:
        self._items[item.id] = item

    def _populate_database(self) -> None:
        # -------------------------------------------------------------
        # 1. BREAKFAST ITEMS
        # -------------------------------------------------------------
        self._add(FoodItem(
            id="idli",
            name="Idli",
            hindi_name="इडली",
            category=FoodCategory.GRAIN,
            serving_unit="piece (50g)",
            serving_size_g=50.0,
            macros=MacroNutrients(calories=58.0, protein_g=2.0, carbs_g=12.0, fats_g=0.2, fiber_g=0.8),
            aliases=["steamed idli", "rice idli", "idly"],
            tags=["breakfast", "south-indian", "fermented", "steamed", "low-fat"]
        ))
        self._add(FoodItem(
            id="sambar",
            name="Sambar",
            hindi_name="सांभर",
            category=FoodCategory.PULSE,
            serving_unit="katori (150ml)",
            serving_size_g=150.0,
            macros=MacroNutrients(calories=110.0, protein_g=4.5, carbs_g=18.0, fats_g=2.5, fiber_g=3.2),
            aliases=["sambhar", "south indian sambar", "dal sambar"],
            tags=["breakfast", "lunch", "dinner", "dal", "lentil", "south-indian"]
        ))
        self._add(FoodItem(
            id="coconut_chutney",
            name="Coconut Chutney",
            hindi_name="नारियल की चटनी",
            category=FoodCategory.CURRY,
            serving_unit="tablespoon (30g)",
            serving_size_g=30.0,
            macros=MacroNutrients(calories=65.0, protein_g=0.8, carbs_g=2.2, fats_g=6.0, fiber_g=1.4),
            aliases=["nariyal chutney", "white chutney"],
            tags=["breakfast", "condiment", "south-indian"]
        ))
        self._add(FoodItem(
            id="plain_dosa",
            name="Plain Dosa",
            hindi_name="सादा डोसा",
            category=FoodCategory.GRAIN,
            serving_unit="piece (80g)",
            serving_size_g=80.0,
            macros=MacroNutrients(calories=165.0, protein_g=3.8, carbs_g=28.0, fats_g=4.2, fiber_g=1.2),
            aliases=["dosa", "sada dosa"],
            tags=["breakfast", "south-indian", "fermented"]
        ))
        self._add(FoodItem(
            id="masala_dosa",
            name="Masala Dosa",
            hindi_name="मसाला डोसा",
            category=FoodCategory.GRAIN,
            serving_unit="piece (140g)",
            serving_size_g=140.0,
            macros=MacroNutrients(calories=285.0, protein_g=5.5, carbs_g=45.0, fats_g=9.5, fiber_g=2.8),
            aliases=["alu dosa", "potato masala dosa"],
            tags=["breakfast", "south-indian"]
        ))
        self._add(FoodItem(
            id="poha",
            name="Poha",
            hindi_name="पोहा",
            category=FoodCategory.GRAIN,
            serving_unit="plate (150g)",
            serving_size_g=150.0,
            macros=MacroNutrients(calories=220.0, protein_g=4.2, carbs_g=42.0, fats_g=4.0, fiber_g=2.5),
            aliases=["kanda poha", "flattened rice", "aval"],
            tags=["breakfast", "quick", "iron-rich"]
        ))
        self._add(FoodItem(
            id="upma",
            name="Upma",
            hindi_name="उपमा",
            category=FoodCategory.GRAIN,
            serving_unit="plate (150g)",
            serving_size_g=150.0,
            macros=MacroNutrients(calories=210.0, protein_g=4.8, carbs_g=36.0, fats_g=5.2, fiber_g=2.0),
            aliases=["rava upma", "sooji upma"],
            tags=["breakfast", "semolina"]
        ))
        self._add(FoodItem(
            id="aloo_paratha",
            name="Aloo Paratha",
            hindi_name="आलू पराठा",
            category=FoodCategory.GRAIN,
            serving_unit="piece (120g)",
            serving_size_g=120.0,
            macros=MacroNutrients(calories=290.0, protein_g=5.8, carbs_g=44.0, fats_g=10.5, fiber_g=3.8),
            aliases=["paratha", "alu paratha", "stuffed paratha"],
            tags=["breakfast", "north-indian"]
        ))
        self._add(FoodItem(
            id="aloo_puri",
            name="Aloo Puri",
            hindi_name="आलू पूरी",
            category=FoodCategory.GRAIN,
            serving_unit="serving (2 puris + sabzi, 180g)",
            serving_size_g=180.0,
            macros=MacroNutrients(calories=380.0, protein_g=6.2, carbs_g=52.0, fats_g=16.8, fiber_g=3.5),
            aliases=["poori aloo", "puri sabji", "puri bhaji", "poori bhaji"],
            tags=["breakfast", "fried", "north-indian"]
        ))
        self._add(FoodItem(
            id="bread_butter",
            name="Bread Butter",
            hindi_name="ब्रेड बटर",
            category=FoodCategory.GRAIN,
            serving_unit="2 slices with butter (60g)",
            serving_size_g=60.0,
            macros=MacroNutrients(calories=210.0, protein_g=4.5, carbs_g=26.0, fats_g=10.0, fiber_g=1.2),
            aliases=["bread toast", "toasted bread butter", "butter bread"],
            tags=["breakfast", "quick"]
        ))
        self._add(FoodItem(
            id="bread_jam",
            name="Bread Jam",
            hindi_name="ब्रेड जैम",
            category=FoodCategory.GRAIN,
            serving_unit="2 slices with jam (65g)",
            serving_size_g=65.0,
            macros=MacroNutrients(calories=185.0, protein_g=4.0, carbs_g=39.0, fats_g=1.5, fiber_g=1.1),
            aliases=["jam bread", "toast jam"],
            tags=["breakfast", "sweet"]
        ))
        self._add(FoodItem(
            id="chai_tea",
            name="Tea (Chai)",
            hindi_name="चाय",
            category=FoodCategory.BEVERAGE,
            serving_unit="cup (120ml)",
            serving_size_g=120.0,
            macros=MacroNutrients(calories=65.0, protein_g=1.8, carbs_g=9.5, fats_g=2.2, fiber_g=0.0),
            aliases=["chai", "tea", "milk tea", "masala chai"],
            tags=["beverage", "hot", "breakfast", "snacks"]
        ))
        self._add(FoodItem(
            id="coffee",
            name="Coffee",
            hindi_name="कॉफ़ी",
            category=FoodCategory.BEVERAGE,
            serving_unit="cup (120ml)",
            serving_size_g=120.0,
            macros=MacroNutrients(calories=75.0, protein_g=2.0, carbs_g=10.5, fats_g=2.5, fiber_g=0.0),
            aliases=["filter coffee", "milk coffee", "nescafe"],
            tags=["beverage", "hot", "breakfast"]
        ))
        self._add(FoodItem(
            id="plain_milk",
            name="Milk",
            hindi_name="दूध",
            category=FoodCategory.DAIRY,
            serving_unit="glass (200ml)",
            serving_size_g=200.0,
            macros=MacroNutrients(calories=130.0, protein_g=6.6, carbs_g=9.8, fats_g=7.2, fiber_g=0.0),
            aliases=["toned milk", "hot milk", "doodh"],
            tags=["dairy", "breakfast", "calcium"]
        ))

        # -------------------------------------------------------------
        # 2. LUNCH & DINNER ITEMS
        # -------------------------------------------------------------
        self._add(FoodItem(
            id="roti",
            name="Roti / Chapati",
            hindi_name="रोटी / चपाती",
            category=FoodCategory.GRAIN,
            serving_unit="piece (35g)",
            serving_size_g=35.0,
            macros=MacroNutrients(calories=85.0, protein_g=3.1, carbs_g=17.5, fats_g=0.4, fiber_g=2.4),
            aliases=["chapati", "phulka", "fulka", "roti", "wheat roti"],
            tags=["staple", "lunch", "dinner", "whole-wheat"]
        ))
        self._add(FoodItem(
            id="steamed_rice",
            name="Steamed Rice",
            hindi_name="चावल",
            category=FoodCategory.GRAIN,
            serving_unit="katori / cup (150g)",
            serving_size_g=150.0,
            macros=MacroNutrients(calories=195.0, protein_g=3.8, carbs_g=43.5, fats_g=0.6, fiber_g=0.6),
            aliases=["white rice", "boiled rice", "chawal", "plain rice"],
            tags=["staple", "lunch", "dinner"]
        ))
        self._add(FoodItem(
            id="jeera_rice",
            name="Jeera Rice",
            hindi_name="जीरा राइस",
            category=FoodCategory.GRAIN,
            serving_unit="katori / cup (150g)",
            serving_size_g=150.0,
            macros=MacroNutrients(calories=225.0, protein_g=4.0, carbs_g=44.0, fats_g=3.8, fiber_g=0.8),
            aliases=["cumin rice", "fried rice"],
            tags=["lunch", "dinner", "special"]
        ))
        self._add(FoodItem(
            id="dal_tadka",
            name="Dal Tadka",
            hindi_name="दाल तड़का",
            category=FoodCategory.PULSE,
            serving_unit="katori (150ml)",
            serving_size_g=150.0,
            macros=MacroNutrients(calories=150.0, protein_g=7.5, carbs_g=21.0, fats_g=4.2, fiber_g=4.5),
            aliases=["toor dal", "yellow dal", "dal fry", "arhar dal"],
            tags=["staple", "lunch", "dinner", "lentil", "vegetarian-protein"]
        ))
        self._add(FoodItem(
            id="dal_makhani",
            name="Dal Makhani",
            hindi_name="दाल मखनी",
            category=FoodCategory.PULSE,
            serving_unit="katori (150ml)",
            serving_size_g=150.0,
            macros=MacroNutrients(calories=260.0, protein_g=8.8, carbs_g=24.0, fats_g=14.5, fiber_g=5.2),
            aliases=["urad dal", "black dal", "makhani dal"],
            tags=["lunch", "dinner", "rich", "north-indian"]
        ))
        self._add(FoodItem(
            id="rasam",
            name="Rasam",
            hindi_name="रसम",
            category=FoodCategory.CURRY,
            serving_unit="katori (150ml)",
            serving_size_g=150.0,
            macros=MacroNutrients(calories=45.0, protein_g=1.5, carbs_g=8.0, fats_g=0.8, fiber_g=1.2),
            aliases=["tomato rasam", "pepper rasam"],
            tags=["south-indian", "lunch", "dinner", "digestive"]
        ))
        self._add(FoodItem(
            id="curd",
            name="Curd / Dahi",
            hindi_name="दही",
            category=FoodCategory.DAIRY,
            serving_unit="katori (100g)",
            serving_size_g=100.0,
            macros=MacroNutrients(calories=62.0, protein_g=3.5, carbs_g=4.5, fats_g=3.2, fiber_g=0.0),
            aliases=["dahi", "plain yogurt", "curds"],
            tags=["staple", "lunch", "dairy", "probiotic"]
        ))
        self._add(FoodItem(
            id="paneer_butter_masala",
            name="Paneer Butter Masala",
            hindi_name="पनीर बटर मसाला",
            category=FoodCategory.CURRY,
            serving_unit="katori (150g)",
            serving_size_g=150.0,
            macros=MacroNutrients(calories=290.0, protein_g=11.5, carbs_g=12.0, fats_g=22.0, fiber_g=2.0),
            aliases=["paneer makhani", "shahi paneer", "pbm"],
            tags=["paneer", "vegetarian-protein", "lunch", "dinner", "special"]
        ))
        self._add(FoodItem(
            id="matar_paneer",
            name="Matar Paneer",
            hindi_name="मटर पनीर",
            category=FoodCategory.CURRY,
            serving_unit="katori (150g)",
            serving_size_g=150.0,
            macros=MacroNutrients(calories=220.0, protein_g=9.8, carbs_g=15.0, fats_g=13.0, fiber_g=3.5),
            aliases=["mutter paneer", "peas paneer"],
            tags=["paneer", "lunch", "dinner"]
        ))
        self._add(FoodItem(
            id="chole",
            name="Chole (Chickpeas Curry)",
            hindi_name="छोले",
            category=FoodCategory.PULSE,
            serving_unit="katori (150g)",
            serving_size_g=150.0,
            macros=MacroNutrients(calories=215.0, protein_g=9.5, carbs_g=32.0, fats_g=5.5, fiber_g=6.8),
            aliases=["chana masala", "kabuli chana", "chhole"],
            tags=["lunch", "dinner", "protein-rich", "fiber-rich"]
        ))
        self._add(FoodItem(
            id="rajma",
            name="Rajma (Kidney Beans Curry)",
            hindi_name="राजमा",
            category=FoodCategory.PULSE,
            serving_unit="katori (150g)",
            serving_size_g=150.0,
            macros=MacroNutrients(calories=205.0, protein_g=9.2, carbs_g=31.0, fats_g=4.8, fiber_g=7.2),
            aliases=["rajma curry", "kidney beans curry"],
            tags=["lunch", "dinner", "protein-rich", "fiber-rich"]
        ))
        self._add(FoodItem(
            id="soya_chunks_curry",
            name="Soya Chunks Curry",
            hindi_name="सोया चंक्स करी",
            category=FoodCategory.CURRY,
            serving_unit="katori (150g)",
            serving_size_g=150.0,
            macros=MacroNutrients(calories=180.0, protein_g=14.8, carbs_g=14.0, fats_g=6.5, fiber_g=4.8),
            aliases=["soya sabzi", "meal maker curry", "nutrella curry", "soy chunks"],
            tags=["lunch", "dinner", "high-protein", "vegetarian-protein"]
        ))
        self._add(FoodItem(
            id="aloo_gobi",
            name="Aloo Gobi",
            hindi_name="आलू गोभी",
            category=FoodCategory.CURRY,
            serving_unit="katori (120g)",
            serving_size_g=120.0,
            macros=MacroNutrients(calories=140.0, protein_g=2.8, carbs_g=18.0, fats_g=6.5, fiber_g=3.2),
            aliases=["alu gobi", "potato cauliflower"],
            tags=["dry sabzi", "lunch", "dinner"]
        ))
        self._add(FoodItem(
            id="bhindi_masala",
            name="Bhindi Masala (Okra)",
            hindi_name="भिंडी मसाला",
            category=FoodCategory.CURRY,
            serving_unit="katori (120g)",
            serving_size_g=120.0,
            macros=MacroNutrients(calories=125.0, protein_g=2.5, carbs_g=14.0, fats_g=7.0, fiber_g=3.8),
            aliases=["bhindi fry", "ladyfinger sabzi", "okra"],
            tags=["dry sabzi", "lunch", "dinner"]
        ))
        self._add(FoodItem(
            id="egg_curry",
            name="Egg Curry",
            hindi_name="अंडा करी",
            category=FoodCategory.NON_VEG,
            serving_unit="serving (2 eggs + gravy, 180g)",
            serving_size_g=180.0,
            macros=MacroNutrients(calories=245.0, protein_g=14.2, carbs_g=8.0, fats_g=17.5, fiber_g=1.2),
            aliases=["anda curry", "egg masala"],
            tags=["non-veg", "high-protein", "lunch", "dinner"]
        ))
        self._add(FoodItem(
            id="chicken_curry",
            name="Chicken Curry",
            hindi_name="चिकन करी",
            category=FoodCategory.NON_VEG,
            serving_unit="serving (150g with 2 pieces)",
            serving_size_g=150.0,
            macros=MacroNutrients(calories=270.0, protein_g=24.5, carbs_g=6.0, fats_g=16.5, fiber_g=1.0),
            aliases=["murgh curry", "mess chicken curry"],
            tags=["non-veg", "high-protein", "lunch", "dinner"]
        ))

        # -------------------------------------------------------------
        # 3. CAMPUS FRUITS
        # -------------------------------------------------------------
        self._add(FoodItem(
            id="banana",
            name="Banana",
            hindi_name="केला",
            category=FoodCategory.FRUIT,
            serving_unit="medium piece (118g)",
            serving_size_g=118.0,
            macros=MacroNutrients(calories=105.0, protein_g=1.3, carbs_g=27.0, fats_g=0.3, fiber_g=3.1),
            aliases=["bananas", "kela"],
            tags=["fruit", "campus-fruit", "potassium", "pre-workout"]
        ))
        self._add(FoodItem(
            id="papaya",
            name="Papaya",
            hindi_name="पपीता",
            category=FoodCategory.FRUIT,
            serving_unit="cup diced (145g)",
            serving_size_g=145.0,
            macros=MacroNutrients(calories=62.0, protein_g=0.7, carbs_g=15.5, fats_g=0.4, fiber_g=2.5),
            aliases=["papita", "cut papaya"],
            tags=["fruit", "campus-fruit", "digestive-enzyme", "vitamin-c"]
        ))
        self._add(FoodItem(
            id="apple",
            name="Apple",
            hindi_name="सेब",
            category=FoodCategory.FRUIT,
            serving_unit="medium piece (180g)",
            serving_size_g=180.0,
            macros=MacroNutrients(calories=95.0, protein_g=0.5, carbs_g=25.0, fats_g=0.3, fiber_g=4.4),
            aliases=["apples", "seb"],
            tags=["fruit", "campus-fruit", "fiber", "antioxidant"]
        ))
        self._add(FoodItem(
            id="orange",
            name="Orange",
            hindi_name="संतरा",
            category=FoodCategory.FRUIT,
            serving_unit="medium piece (130g)",
            serving_size_g=130.0,
            macros=MacroNutrients(calories=62.0, protein_g=1.2, carbs_g=15.4, fats_g=0.2, fiber_g=3.1),
            aliases=["oranges", "santra", "mosambi"],
            tags=["fruit", "campus-fruit", "vitamin-c", "hydration"]
        ))
        self._add(FoodItem(
            id="watermelon",
            name="Watermelon",
            hindi_name="तरबूज",
            category=FoodCategory.FRUIT,
            serving_unit="bowl diced (200g)",
            serving_size_g=200.0,
            macros=MacroNutrients(calories=60.0, protein_g=1.2, carbs_g=15.0, fats_g=0.3, fiber_g=0.8),
            aliases=["tarbooj", "cut watermelon"],
            tags=["fruit", "campus-fruit", "hydration", "summer"]
        ))
        self._add(FoodItem(
            id="guava",
            name="Guava",
            hindi_name="अमरूद",
            category=FoodCategory.FRUIT,
            serving_unit="medium piece (100g)",
            serving_size_g=100.0,
            macros=MacroNutrients(calories=68.0, protein_g=2.6, carbs_g=14.3, fats_g=0.9, fiber_g=5.4),
            aliases=["amrood", "amrud"],
            tags=["fruit", "campus-fruit", "vitamin-c", "super-fiber"]
        ))

        # -------------------------------------------------------------
        # 4. CANTEEN SUPPLEMENTS & BUDGET NUTRITION
        # -------------------------------------------------------------
        self._add(FoodItem(
            id="boiled_egg",
            name="Boiled Egg",
            hindi_name="उबला अंडा",
            category=FoodCategory.SUPPLEMENT,
            serving_unit="piece (50g)",
            serving_size_g=50.0,
            macros=MacroNutrients(calories=78.0, protein_g=6.3, carbs_g=0.6, fats_g=5.3, fiber_g=0.0),
            aliases=["boiled eggs", "egg", "hard boiled egg"],
            tags=["canteen", "high-protein", "budget-protein", "essential-aminos"],
            price_inr=8.0
        ))
        self._add(FoodItem(
            id="egg_omelette",
            name="Egg Omelette (2 eggs)",
            hindi_name="आमलेट",
            category=FoodCategory.SUPPLEMENT,
            serving_unit="serving (2 eggs, 100g)",
            serving_size_g=100.0,
            macros=MacroNutrients(calories=185.0, protein_g=12.5, carbs_g=2.0, fats_g=14.2, fiber_g=0.2),
            aliases=["omelette", "double egg omelet", "anda omelet"],
            tags=["canteen", "high-protein", "snack"],
            price_inr=30.0
        ))
        self._add(FoodItem(
            id="milk_packet_500ml",
            name="Toned Milk Packet (Amul / Nandini 500ml)",
            hindi_name="दूध का पैकेट (500ml)",
            category=FoodCategory.SUPPLEMENT,
            serving_unit="packet (500ml)",
            serving_size_g=500.0,
            macros=MacroNutrients(calories=290.0, protein_g=16.0, carbs_g=24.0, fats_g=15.0, fiber_g=0.0),
            aliases=["milk packet", "amul taaza", "amul blue", "nandini milk"],
            tags=["canteen", "high-protein", "budget-protein", "calcium"],
            price_inr=27.0
        ))
        self._add(FoodItem(
            id="roasted_chana",
            name="Roasted Chana (Bhuna Chana)",
            hindi_name="भुना चना",
            category=FoodCategory.SUPPLEMENT,
            serving_unit="handful / bowl (50g)",
            serving_size_g=50.0,
            macros=MacroNutrients(calories=185.0, protein_g=9.5, carbs_g=29.0, fats_g=2.5, fiber_g=8.0),
            aliases=["bhuna chana", "roasted chickpeas", "chana dry"],
            tags=["canteen", "high-protein", "high-fiber", "room-snack"],
            price_inr=15.0
        ))
        self._add(FoodItem(
            id="peanut_butter",
            name="Peanut Butter",
            hindi_name="पीनट बटर",
            category=FoodCategory.SUPPLEMENT,
            serving_unit="tablespoon (32g)",
            serving_size_g=32.0,
            macros=MacroNutrients(calories=190.0, protein_g=8.0, carbs_g=6.0, fats_g=16.0, fiber_g=2.0),
            aliases=["pb", "mungfali butter"],
            tags=["canteen", "healthy-fats", "bulking", "calorie-dense"],
            price_inr=20.0
        ))
        self._add(FoodItem(
            id="whey_protein_scoop",
            name="Whey Protein Scoop",
            hindi_name="व्हे प्रोटीन",
            category=FoodCategory.SUPPLEMENT,
            serving_unit="scoop (30g)",
            serving_size_g=30.0,
            macros=MacroNutrients(calories=120.0, protein_g=24.0, carbs_g=2.5, fats_g=1.5, fiber_g=0.5),
            aliases=["whey", "protein powder", "whey isolate", "whey concentrate"],
            tags=["canteen", "pure-protein", "post-workout", "fast-digesting"],
            price_inr=70.0
        ))
        self._add(FoodItem(
            id="sattu_drink",
            name="Sattu Drink (Roasted Gram Flour)",
            hindi_name="सत्तू शर्बत / नमकीन सत्तू",
            category=FoodCategory.SUPPLEMENT,
            serving_unit="glass (40g powder + water 250ml)",
            serving_size_g=290.0,
            macros=MacroNutrients(calories=165.0, protein_g=10.2, carbs_g=25.0, fats_g=2.2, fiber_g=7.5),
            aliases=["sattu", "sattu sharbat", "chana sattu", "desi protein shake"],
            tags=["canteen", "budget-protein", "desi-protein", "summer-drink"],
            price_inr=20.0
        ))

    def get_by_id(self, item_id: str) -> Optional[FoodItem]:
        return self._items.get(item_id.lower().strip())

    def get_all(self) -> List[FoodItem]:
        return list(self._items.values())

    def search_by_name(self, query: str) -> List[FoodItem]:
        q = query.lower().strip()
        matches = []
        for item in self._items.values():
            if q in item.name.lower() or (item.hindi_name and q in item.hindi_name) or any(q in alias.lower() for alias in item.aliases):
                matches.append(item)
        return matches

    def find_best_match(self, query: str, threshold: float = 0.55) -> Optional[FoodItem]:
        """Fuzzy match raw string tokens against names and aliases."""
        q = query.lower().strip()
        # Direct exact match on ID or name
        if q in self._items:
            return self._items[q]
        for item in self._items.values():
            if item.name.lower() == q or q in [a.lower() for a in item.aliases]:
                return item

        # Fuzzy matching
        best_item = None
        best_ratio = 0.0
        for item in self._items.values():
            # Check similarity with main name
            ratio = SequenceMatcher(None, q, item.name.lower()).ratio()
            if ratio > best_ratio:
                best_ratio = ratio
                best_item = item

            # Check similarity with aliases
            for alias in item.aliases:
                alias_ratio = SequenceMatcher(None, q, alias.lower()).ratio()
                if alias_ratio > best_ratio:
                    best_ratio = alias_ratio
                    best_item = item

            # Check if query is a substring of item or alias
            if q in item.name.lower() or any(q in alias.lower() for alias in item.aliases):
                substring_score = 0.75 + (len(q) / max(len(item.name), 1)) * 0.2
                if substring_score > best_ratio:
                    best_ratio = substring_score
                    best_item = item

        if best_ratio >= threshold:
            return best_item
        return None

    def get_by_category(self, category: FoodCategory) -> List[FoodItem]:
        return [item for item in self._items.values() if item.category == category]

    def get_canteen_supplements(self) -> List[FoodItem]:
        return [item for item in self._items.values() if item.category == FoodCategory.SUPPLEMENT or "canteen" in item.tags]

    def get_campus_fruits(self) -> List[FoodItem]:
        return [item for item in self._items.values() if item.category == FoodCategory.FRUIT or "campus-fruit" in item.tags]
