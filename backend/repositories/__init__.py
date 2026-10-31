"""Repositories package exports."""
from backend.repositories.food_repository import (
    IFoodRepository,
    InMemoryIndianFoodRepository,
)

__all__ = [
    "IFoodRepository",
    "InMemoryIndianFoodRepository",
]
