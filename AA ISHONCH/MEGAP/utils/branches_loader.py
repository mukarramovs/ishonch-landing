import pandas as pd
import os

EXCEL_FILE = "Do'kon manzillari_Xududlar_bo'yicha.xlsx"

# Columns from physical file (header at row 1)
# 2: Filial
# 3: Manzil
# 4: Mo'ljal
# 5: Google link(location)

USER_VILOYATS = [
    "Ферганская область",
    "Андижанская область",
    "Наманганская область",
    "Самаркандская область",
    "Бухарская область",
    "Навоийская область",
    "Хорезмская область",
    "Кашкадарьинская область",
    "Сурхандарьинская область",
    "Джизакская область",
    "Сырдарьинская область",
    "Ташкентская область"
]

def load_branches():
    """Loads branches data from Excel and organizes by Viloyat."""
    if not os.path.exists(EXCEL_FILE):
        print(f"File not found: {EXCEL_FILE}")
        return {}

    try:
        # Read with header=1 because row 0 is Unnamed, row 1 is actual header
        df = pd.read_excel(EXCEL_FILE, header=1)
        
        # Columns found: 'Filial', 'Manzil', "Mo'ljal", 'Google link(location)'
        # Let's verify if they exist or use indices to be safe.
        # Based on previous output:
        # Unnamed: 2 -> Filial
        # Unnamed: 3 -> Manzil
        # Unnamed: 4 -> Mo'ljal
        # Unnamed: 5 -> Google link(location)
        
        branches_by_viloyat = {v: [] for v in USER_VILOYATS}
        
        for index, row in df.iterrows():
            # Skip empty rows or rows where ID is NaN (if any)
            if pd.isna(row.iloc[2]): # Filial name is empty
                continue
                
            name = str(row.iloc[2]).strip()
            address = str(row.iloc[3]).strip() if pd.notna(row.iloc[3]) else ""
            landmark = str(row.iloc[4]).strip() if pd.notna(row.iloc[4]) else None
            map_url = str(row.iloc[5]).strip() if pd.notna(row.iloc[5]) else None
            
            # Simple keyword matching for Viloyat
            address_lower = address.lower()
            viloyat = "Другое" # Fallback
            
            if "fargʻona" in address_lower or "farg'ona" in address_lower or "uchko'prik" in address_lower or "beshariq" in address_lower or "qo'qon" in address_lower:
                  viloyat = "Ферганская область"
            elif "andijon" in address_lower or "asaka" in address_lower:
                  viloyat = "Андижанская область"
            elif "namangan" in address_lower or "chust" in address_lower:
                  viloyat = "Наманганская область"
            elif "samarqand" in address_lower or "urgut" in address_lower:
                  viloyat = "Самаркандская область"
            elif "buxoro" in address_lower or "g'ijduvon" in address_lower:
                  viloyat = "Бухарская область"
            elif "navoiy" in address_lower or "zarafshon" in address_lower:
                  viloyat = "Навоийская область"
            elif "xorazm" in address_lower or "urganch" in address_lower or "xiva" in address_lower:
                  viloyat = "Хорезмская область"
            elif "qashqadaryo" in address_lower or "qarshi" in address_lower or "shahrisabz" in address_lower:
                  viloyat = "Кашкадарьинская область"
            elif "surxondaryo" in address_lower or "termiz" in address_lower or "denov" in address_lower:
                  viloyat = "Сурхандарьинская область"
            elif "jizzax" in address_lower or "zarbdor" in address_lower:
                  viloyat = "Джизакская область"
            elif "sirdaryo" in address_lower or "guliston" in address_lower or "yangiyer" in address_lower:
                  viloyat = "Сырдарьинская область"
            elif "toshkent" in address_lower or "chirchiq" in address_lower or "bekobod" in address_lower or "angren" in address_lower or "olmaliq" in address_lower:
                  viloyat = "Ташкентская область"
            
            # Check if found viloyat is in our target list
            if viloyat in branches_by_viloyat:
                branches_by_viloyat[viloyat].append({
                    "name": name,
                    "address": address,
                    "landmark": landmark,
                    "map_url": map_url
                })
        
        # Remove empty categories to keep menu clean
        return {k: v for k, v in branches_by_viloyat.items() if v}

    except Exception as e:
        print(f"Error parse branches: {e}")
        return {}
