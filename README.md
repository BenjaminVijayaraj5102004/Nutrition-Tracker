# MessNutri - Hostel Mess Nutrition Intelligence Platform

MessNutri is an intelligent web application designed for college hostel students. It digitizes weekly hostel mess menus from photo uploads, calculates daily nutrient intake (calories, protein, carbs, fats, and fiber), identifies personal nutritional deficits against body weight goals, and recommends instant campus canteen/grocery fixes.

## Architecture

Following strict layered architecture and OOP software factory principles:

- `frontend/`: Responsive, mobile-first web app (HTML5, modern CSS/Tailwind, JavaScript/TypeScript, Tesseract.js client OCR) ready for Netlify.
- `backend/`: Python backend engine:
  - `api/`: REST API endpoints and routing controllers.
  - `services/`: Business logic services (OCR extraction, nutrition matching, deficit calculator).
  - `models/`: Domain entities and data transfer schemas.
  - `repositories/`: Indian Food Composition database access.
- `docker/`: Containerization setup for reproducible local and cloud deployment.
