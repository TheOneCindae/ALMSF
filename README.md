# KINETIC_LAB // Adaptive Noise-Aware IR Spectroscopy System

This repository contains a full-stack signal processing application that ingests raw IR spectroscopy CSV data, performs adaptive Variable Step Size Least Mean Squares (VSSLMS) filtering and noise classification, and visualizes the results on a responsive dynamic dashboard.

## System Architecture

The application is split into a robust **Python FastAPI / MATLAB Backend** and a high-fidelity **React/Vite Frontend** dashboard.

- **Backend** orchestrates Python simulations or raw MATLAB engine `.m` scripts seamlessly depending on environment availability.
- **Frontend** serves a rich data visualization terminal equipped with Tailwind v3 dark-mode styling and dynamic Recharts renderers.

---

## 🛠 Required Dependencies

### Backend Dependencies
The backend requires Python 3.10+ and the following PyPI packages:

```txt
fastapi
uvicorn
pandas
numpy
scipy
python-multipart
# Optional: matlabengine (if local MATLAB is bound for native .m execution hook)
```

**Installation:**
```bash
cd backend
pip install -r requirements.txt
# Alternatively: pip install fastapi uvicorn pandas numpy scipy python-multipart
```

### Frontend Dependencies
The frontend is built on **React 18** configured via **Vite**.

```json
"dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "recharts": "^2.x"
},
"devDependencies": {
    "vite": "^5.x",
    "tailwindcss": "^3.4.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x",
    "eslint": "...",
}
```

**Installation:**
```bash
cd frontend
npm install
```

---

## 🚀 How to Run the Application

You will need to maintain two separate terminal instances to run the system concurrently.

### 1. Launch the Pipeline Backend
Responsible for CSV signal extraction, LMS filtering, matching evaluation, and noise estimation.

```bash
cd backend
# With virtual environment activated:
uvicorn main:app --port 8000 --reload
```

### 2. Launch the Control Dashboard
Responsible for local state ingestion, JSON unwrapping to the dynamic matrices, and rendering the CSS architecture.

```bash
cd frontend
npm run dev
```

### 3. Usage Sequence
1. Navigate your browser to `http://localhost:5173`.
2. Select **UPLOAD CSV** in the top navigation panel.
3. Target any compliant payload containing target `signal` or `Raw_Absorbance` schema (e.g., `ethyl_acetate_ester_CO_raw.csv`).
4. Click **RUN FILTER** to trigger the background processing thread and instantly chart the result to the main UI visualizer.
