# MessNutri: Hostel Mess Nutrition Intelligence Platform

> An intelligent, zero-login nutrition tracking web application built specifically for university students living in college hostels. It digitizes hostel mess menus, calculates daily macronutrients (protein, calories, carbs, fats, fiber), detects personal nutritional deficits against body weight goals, and recommends instant campus canteen fixes.

---

## ⚡ The Problem It Solves

Millions of college students living in university hostels have no control over what is cooked in their mess. They consistently face two major challenges:
1. **The Protein Gap:** Hostel food is heavily carbohydrate-dense (rice, poori, potatoes, watered dal) and severely deficient in protein.
2. **Lack of Tracking Tools:** Standard fitness apps (like MyFitnessPal) require tedious manual calorie logging with Western food items and expensive subscription paywalls.

**MessNutri** fixes this by:
- Importing weekly hostel mess schedules via **photo upload, WhatsApp notice text, or campus presets**.
- Automatically mapping Indian mess staples (rotis, dal tadka, paneer, rajma, chole, curd, campus fruits) to accurate ICMR/NIN nutritional values.
- Calculating personalized protein and calorie requirements based on student body weight using the **Mifflin-St Jeor formula**.
- Pinpointing exact daily deficits (e.g., *"Short by 54g of protein today!"*).
- Providing **1-click campus canteen recommendations** (boiled eggs, milk packets, peanut butter toast, roasted chana, sattu) to bridge the gap affordably.

---

## 🎨 Design Philosophy: Neo-Brutalism & Bento Grid

MessNutri features a bold **Neo-Brutalist** layout combined with an asymmetric **Bento Grid**:
- **High-Contrast Outlines:** 3px and 4px solid black borders with crisp, hard-edged box shadows (`shadow-[4px_4px_0_0_#000]`).
- **Tactile Palette:** Vibrant canary yellow, mint green, sky blue, and cream backgrounds.
- **Asymmetric Bento Proportions:** Highlights the critical protein deficit in an expansive 7-column hero tile alongside energy and macro meters.
- **Micro-interactions:** Physical tactile button presses (`translate(2px, 2px)`).

---

## 🚀 Key Features

### 1. Zero-Friction Onboarding & Persistence
- No account creation, passwords, or cloud database setup required.
- Preferences, custom weekly schedules, and daily meal portions are saved automatically to the browser (`localStorage`).

### 2. Multi-Method Mess Menu Importer
- **Method 1 (Photo / File / Camera):** Upload or capture a photo of the mess noticeboard chart or circular.
- **Method 2 (Paste Notice Text):** Paste mess menus directly from WhatsApp groups or student council emails.
- **Method 3 (Campus Presets):** 1-click loading of North Indian Veg, South Indian Standard, or High Protein Add-on menus.

### 3. Interactive 7-Day Mess Calendar & Portion Steppers
- Monday through Sunday rotation tabs that automatically highlight today's schedule.
- Meal sections for **Breakfast**, **Lunch**, **Evening Snacks**, and **Dinner**.
- Tactile `-` and `+` steppers to track exact portion counts (rotis, bowls of rice, fruit servings, glasses of milk).

### 4. Real-Time Deficit Gauge & Canteen Fixes
- Visual progress meters comparing consumed macros against body weight goals.
- Instant alert banners highlighting protein deficits.
- **Campus Canteen Drawer:** 1-click add buttons for student staples (boiled eggs, 2-egg omelettes, milk packets, roasted chana, peanut butter, whey protein).

---

## 🏗️ Architecture & Tech Stack

MessNutri is built with a clean, decoupled layered architecture following the software factory specification:

```
Nutrition-Tracker/
├── backend/                             # Python Backend Engine
│   ├── api/
│   │   └── main.py                      # FastAPI REST endpoints (/api/foods, /api/menu/parse)
│   ├── models/
│   │   └── domain.py                    # OOP Domain Models (Mifflin-St Jeor BMR/TDEE, DeficitReport)
│   ├── repositories/
│   │   └── food_repository.py           # Indian Food Composition Database (35+ hostel staples & fruits)
│   ├── services/
│   │   └── nutrition_service.py         # Strategy Pattern Calculator & OCR Fuzzy Token Parser
│   └── tests/                           # Unit & API integration test suite
├── docker/                              # Multi-stage Containerization
│   ├── Dockerfile                       # Python FastAPI container
│   └── docker-compose.yml               # Service orchestration
├── frontend/                            # Responsive Neo-Brutalist Web Application
│   ├── src/
│   │   ├── modules/
│   │   │   ├── profile/ProfileBar.tsx   # Body weight stats & fitness goal drawer
│   │   │   ├── nutrition/BentoOverview.tsx # Neo-Brutalist Bento Grid deficit display
│   │   │   ├── calendar/MessCalendarTabs.tsx # 7-day Monday–Sunday segmented tab bar
│   │   │   ├── meals/MealSection.tsx    # Meal categories with portion counter tiles
│   │   │   ├── meals/PortionCounter.tsx # Tactile portion steppers
│   │   │   ├── canteen/CanteenDrawer.tsx # Campus canteen 1-click add drawer
│   │   │   └── scanner/ScannerModal.tsx # Multi-method menu importer
│   │   └── core/
│   │       ├── data/foodDatabase.ts     # Offline-ready client food database
│   │       └── services/                # LocalStorage & calculation service layer
│   └── dist/                            # Production build bundle
└── netlify.toml                         # Netlify single-page deployment rules
```

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ (for backend services and Docker runner)

### Frontend (Instant Local Run)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Or test production preview
npm run build
npm run preview
```
Visit `http://localhost:5173` (or `http://localhost:4173` for preview).

### Backend (Python Engine)
```bash
# Run unit test suite
python backend/tests/test_nutrition_engine.py

# Run FastAPI server
uvicorn backend.api.main:app --reload --port 8000
```

### Docker
```bash
cd docker
docker-compose up --build
```

---

## 🌐 Netlify Deployment

MessNutri is configured for 1-click deployment on **Netlify**:
- Build command: `npm run build`
- Publish directory: `frontend/dist`
- Redirect rules configured in `netlify.toml` for Single Page Application client routing.

---

## 📜 License
MIT License. Built for university students everywhere.
