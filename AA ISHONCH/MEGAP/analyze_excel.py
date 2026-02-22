import pandas as pd

try:
    df = pd.read_excel("Do'kon manzillari_Xududlar_bo'yicha.xlsx")
    print("Columns:", df.columns.tolist())
    print("\nFirst 5 rows:")
    print(df.head().to_string())
except Exception as e:
    print(f"Error reading excel: {e}")
