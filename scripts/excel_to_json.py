import pandas as pd
import json
import os
import re

def clean_string(val):
    if pd.isna(val):
        return ""
    return str(val).strip()

def looks_like_description(val):
    if not val:
        return False
    # If the text is long or contains descriptive words, it's a description, not a size list
    lower_val = val.lower()
    if len(val) > 30:
        return True
    if "esencias para" in lower_val or "consultar" in lower_val or "fragancia" in lower_val or "perfume" in lower_val:
        return True
    return False

def parse_presentations(val):
    if not val or looks_like_description(val):
        return []
    
    # Split by / or ,
    parts = re.split(r'[/,]', val)
    cleaned_parts = []
    for p in parts:
        p_clean = p.strip()
        if p_clean:
            cleaned_parts.append(p_clean)
    return cleaned_parts

def main():
    excel_file = 'Lista productos resumida.xlsx'
    if not os.path.exists(excel_file):
        print(f"Error: No se encontró el archivo {excel_file}")
        return

    print(f"Leyendo {excel_file}...")
    df = pd.read_excel(excel_file)
    
    # Trim column names
    df.columns = [str(c).strip() for c in df.columns]
    
    # Ensure expected columns exist
    prod_col = 'PRODUCTO'
    cat_col = 'CLASIFICACIÓN'
    pres_col = 'PRESENTACIÓN'
    desc_col = 'Unnamed: 3'

    items = []
    for idx, row in df.iterrows():
        name = clean_string(row.get(prod_col))
        if not name:
            continue
            
        category = clean_string(row.get(cat_col))
        if not category:
            category = "General"
            
        pres_raw = clean_string(row.get(pres_col))
        desc_raw = clean_string(row.get(desc_col))
        
        description = desc_raw
        presentations = []
        
        if looks_like_description(pres_raw):
            if not description:
                description = pres_raw
        else:
            presentations = parse_presentations(pres_raw)
            
        items.append({
            "name": name,
            "category": category,
            "presentations": presentations,
            "description": description
        })
        
    output_file = 'import-data.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
        
    print(f"Se generó {output_file} con {len(items)} productos.")

if __name__ == '__main__':
    main()
