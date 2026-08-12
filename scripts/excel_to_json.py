import pandas as pd
import json
import os
import re

def clean_string(val):
    if pd.isna(val):
        return ""
    return str(val).strip()

def looks_like_note(val):
    if not val:
        return False
    lower_val = val.lower()
    # Notes typically contain keywords like 'consultar', 'varios', 'fragancia'
    if "consultar" in lower_val or "varias" in lower_val or "fragancia" in lower_val or "perfume" in lower_val:
        return True
    # If it is long and doesn't contain standard presentation delimiters, it might be a note
    if len(val) > 40 and '/' not in val and ',' not in val and '|' not in val:
        return True
    return False

def parse_presentations(val):
    if not val or looks_like_note(val):
        return []
    
    # Split by / or , or |
    parts = re.split(r'[/,|]', val)
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
    print("Columnas encontradas:", list(df.columns))
    
    # Dynamically find columns to handle encoding or custom names
    prod_col = next((c for c in df.columns if 'producto' in c.lower()), None)
    cat_col = next((c for c in df.columns if 'clasific' in c.lower() or 'categor' in c.lower()), None)
    pres_col = next((c for c in df.columns if 'presentac' in c.lower()), None)
    desc_col = next((c for c in df.columns if 'descrip' in c.lower() or 'detalle' in c.lower()), None)
    
    if not prod_col:
        prod_col = df.columns[0]
    if not cat_col:
        cat_col = df.columns[1] if len(df.columns) > 1 else 'CLASIFICACIÓN'
    if not pres_col:
        pres_col = df.columns[2] if len(df.columns) > 2 else 'PRESENTACIÓN'
    if not desc_col and len(df.columns) > 3:
        desc_col = df.columns[3]

    print(f"Mapeo de columnas: Producto -> '{prod_col}', Categoría -> '{cat_col}', Presentación -> '{pres_col}', Descripción -> '{desc_col}'")

    # Force wacker silicon products to the correct category
    wacker_products = {
        'ee 35 n emulsion de siliconas',
        'aceite de siliconas ak-1000',
        'antiespuma was/erol',
        'hdk',
        'cenusil',
        'catalyst (catalizador)'
    }

    items = []
    for idx, row in df.iterrows():
        name = clean_string(row.get(prod_col))
        if not name:
            continue
            
        category = clean_string(row.get(cat_col))
        if not category:
            category = "General"
            
        # Map specific products or raw category names to the unified category
        clean_name_lower = name.strip().lower()
        if clean_name_lower in wacker_products or category.strip().lower() == 'siliconas wacker':
            category = 'siliconas y antiespumantes wacker'
        elif category.strip().lower() == 'vasana':
            category = 'Esencias Vasana'
            
        pres_raw = clean_string(row.get(pres_col))
        desc_raw = clean_string(row.get(desc_col)) if desc_col else ""
        
        description = desc_raw
        presentations = []
        
        if looks_like_note(pres_raw):
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
