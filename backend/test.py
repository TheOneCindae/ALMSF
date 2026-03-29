import pandas as pd

try:
    df = pd.read_csv(r"c:\Users\karan\Downloads\ALMSF\ethyl_acetate_ester_CO_raw.csv", comment="#")
    df.columns = df.columns.str.strip()
    print("Columns:", df.columns.tolist())
    
    col_lower = df.columns.str.lower()
    signal_col_idx = -1
    
    for kw in ["absorbance", "signal", "intensity", "y"]:
        matches = [i for i, c in enumerate(col_lower) if kw in c]
        if matches:
            signal_col_idx = matches[0]
            break
            
    if signal_col_idx == -1:
        if len(df.columns) >= 2:
            signal_col_idx = 1
        else:
            signal_col_idx = 0
            
    print("Found index:", signal_col_idx)
    signal_data = df.iloc[:, signal_col_idx].tolist()
    print("Data head:", signal_data[:5])
    
    # testing matlab orchestrator logic
    import numpy as np
    signal_series = pd.Series(signal_data).interpolate(method='linear').bfill().ffill()
    clean_signal = signal_series.tolist()
    print("Clean signal ok. length:", len(clean_signal))
    
    from matlab_orchestrator import run_signal_processing
    res = run_signal_processing(clean_signal)
    print("Orchestrator OK. Keys:", res.keys())
    
    import json
    json.dumps(res)
    print("JSON Serialization passed!")
except Exception as e:
    import traceback
    traceback.print_exc()
