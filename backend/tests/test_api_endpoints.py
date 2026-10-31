"""Integration test suite for FastAPI endpoints using TestClient."""
import pytest
from fastapi.testclient import TestClient
from backend.api.main import app

client = TestClient(app)


def test_health_check_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "MessNutri" in data["service"]


def test_list_foods_endpoint():
    response = client.get("/api/foods")
    assert response.status_code == 200
    foods = response.json().get("foods", [])
    assert len(foods) >= 30
    names = [f["name"] for f in foods]
    assert any("Roti" in n for n in names)
    assert any("Idli" in n for n in names)
    assert any("Banana" in n for n in names)


def test_list_supplements_endpoint():
    response = client.get("/api/supplements")
    assert response.status_code == 200
    supplements = response.json().get("supplements", [])
    assert len(supplements) >= 5
    ids = [s["id"] for s in supplements]
    assert "boiled_egg" in ids
    assert "whey_protein_scoop" in ids
    assert "sattu_drink" in ids


def test_list_campus_fruits_endpoint():
    response = client.get("/api/fruits")
    assert response.status_code == 200
    fruits = response.json().get("fruits", [])
    assert len(fruits) >= 5
    ids = [f["id"] for f in fruits]
    assert "banana" in ids
    assert "papaya" in ids
    assert "guava" in ids


def test_nutrition_calculate_endpoint():
    payload = {
        "items": [
            {"id": "roti", "quantity": 3},
            {"id": "dal_tadka", "quantity": 1},
            {"id": "curd", "quantity": 1}
        ],
        "user_profile": {
            "user_id": "test_user",
            "name": "Arjun",
            "age": 21,
            "gender": "male",
            "weight_kg": 72.0,
            "height_cm": 178.0,
            "activity_level": "very_active",
            "goal": "muscle_gain"
        }
    }
    response = client.post("/api/nutrition/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "total_macros" in data
    assert data["total_macros"]["calories"] > 0
    assert "deficit_report" in data
    assert data["deficit_report"]["status"] in ["severe_protein_deficit", "moderate_protein_deficit", "calorie_deficit", "on_track"]


def test_menu_parse_endpoint():
    payload = {
        "raw_text": "Morning Mess: 3 Idli, 1 Sambar, Coconut Chutney and 1 Tea",
        "meal_type": "breakfast",
        "user_profile": {
            "user_id": "test_user_2",
            "name": "Priya",
            "age": 20,
            "gender": "female",
            "weight_kg": 55.0,
            "height_cm": 162.0,
            "activity_level": "moderately_active",
            "goal": "maintenance"
        }
    }
    response = client.post("/api/menu/parse", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["detected_items"]) >= 3
    detected_names = [d["food_item"]["name"] for d in data["detected_items"]]
    assert any("Idli" in name for name in detected_names)
    assert any("Sambar" in name for name in detected_names)


def test_user_profile_targets_endpoint():
    payload = {
        "user_id": "test_user_3",
        "name": "Vikram",
        "age": 22,
        "gender": "male",
        "weight_kg": 65.0,
        "height_cm": 170.0,
        "activity_level": "sedentary",
        "goal": "weight_loss"
    }
    response = client.post("/api/user/profile-targets", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "bmr" in data
    assert "tdee" in data
    assert "target_macros" in data
    assert data["target_macros"]["protein_g"] > 0
