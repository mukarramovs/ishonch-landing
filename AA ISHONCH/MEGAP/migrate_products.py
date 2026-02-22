import sqlite3
import json
import re
import os

DB_PATH = '/Users/shoxrux/Desktop/ishonch-landing/AA ISHONCH/MEGAP/applications.db'
JS_PATH = '/Users/shoxrux/Desktop/ishonch-landing/products_data.js'

def run_migration():
    print("Starting product migration...")
    
    if not os.path.exists(JS_PATH):
        print(f"Error: Could not find {JS_PATH}")
        return

    with open(JS_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Extract the JS array using regex
    match = re.search(r'const ISHONCH_PRODUCTS = (\[.*?\]);', content, re.DOTALL)
    if not match:
        print("Error: Could not find ISHONCH_PRODUCTS array in file")
        return
        
    js_array_str = match.group(1)
    
    # We need to convert JS object syntax to valid JSON
    # 1. Remove single-line comments // ...
    json_str = re.sub(r'//.*', '', js_array_str)
    
    # 2. Add quotes around keys (e.g., id: -> "id":)
    # This regex looks for word characters followed by a colon, not preceded by a quote
    json_str = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)\s*:', r'\1"\2":', json_str)
    
    # 3. Replace single quotes with double quotes
    # Be careful not to replace single quotes inside words (like O'zbekiston)
    # A simple but slightly risky way: replace ' with " if it's bounding a string.
    # Actually, the data mostly uses double quotes already! Let's just fix the trailing commas
    
    # 4. Fix trailing commas before } or ]
    json_str = re.sub(r',\s*}', '}', json_str)
    json_str = re.sub(r',\s*]', ']', json_str)
    
    try:
        products = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON: {e}")
        # One last ditch effort using chompjs if available, but we rely on regex for local env
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print(f"Found {len(products)} products to migrate.")
    
    success_count = 0
    for p in products:
        try:
            cursor.execute("""
                INSERT OR REPLACE INTO products (id, name, brand, price, old_price, category, image, description, specs, is_new)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                str(p.get('id')),
                p.get('name'),
                p.get('brand'),
                p.get('price'),
                p.get('oldPrice'),
                p.get('category'),
                p.get('image'),
                p.get('description', ''),
                p.get('specs', ''),
                1 if p.get('badge') == 'new' else 0 # Translate badge to is_new roughly
            ))
            success_count += 1
        except Exception as e:
            print(f"Failed to insert product {p.get('id')}: {e}")
            
    conn.commit()
    conn.close()
    
    print(f"Migration complete. Successfully inserted/updated {success_count} products.")

if __name__ == '__main__':
    run_migration()
