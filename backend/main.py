from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import json

from matlab_orchestrator import run_signal_processing

app = FastAPI(title="KINETIC_LAB IR Processing API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def process_signal(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    try:
        contents = await file.read()
        # Read CSV with pandas. Auto-detect headers, skip comment lines starting with #.
        df = pd.read_csv(io.BytesIO(contents), comment="#")
        df.columns = df.columns.str.strip() # Remove any whitespace
        
        # Try to find the signal column based on common terms
        col_lower = df.columns.str.lower()
        signal_col_idx = -1
        
        for kw in ["absorbance", "signal", "intensity", "y"]:
            matches = [i for i, c in enumerate(col_lower) if kw in c]
            if matches:
                signal_col_idx = matches[0]
                break
                
        # If we didn't find a matching name, but there is more than 1 column, assume index 1 is Y (signal)
        if signal_col_idx == -1:
            if len(df.columns) >= 2:
                signal_col_idx = 1
            else:
                signal_col_idx = 0
                
        signal_data = df.iloc[:, signal_col_idx].tolist()
        
        # Interpolate NaNs if any (basic forward/backward fill)
        signal_series = pd.Series(signal_data).interpolate(method='linear').bfill().ffill()
        clean_signal = signal_series.tolist()
        
        # Execute processing pipeline
        result = run_signal_processing(clean_signal)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
