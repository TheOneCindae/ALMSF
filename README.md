# ALMSF

ALMSF is a full-stack IR spectroscopy app.  
It accepts CSV signal data, applies adaptive filtering/noise analysis, and shows results in a web dashboard.

## Tech Stack

- **Backend:** Python, FastAPI, Pandas, NumPy, SciPy (optional MATLAB engine fallback support)
- **Frontend:** React, Vite, Tailwind CSS, Recharts, ESLint

## Dependencies

### Backend

Install Python packages:

```bash
pip install fastapi uvicorn pandas numpy scipy python-multipart
```

### Frontend

From `/home/runner/work/ALMSF/ALMSF/frontend`:

```bash
npm install
```

## How to Run

Run backend and frontend in separate terminals.

### 1) Start backend API

From `/home/runner/work/ALMSF/ALMSF/backend`:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2) Start frontend app

From `/home/runner/work/ALMSF/ALMSF/frontend`:

```bash
npm run dev
```

### 3) Open app

- Visit `http://localhost:5173`
- Upload a CSV file (example: `ethyl_acetate_ester_CO_raw.csv`)
- Run filtering from the dashboard
