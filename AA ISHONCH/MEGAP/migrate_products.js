const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'applications.db');
const JS_PATH = path.join(__dirname, '..', '..', 'products_data.js');

console.log("Starting product migration via Node.js...");

// 1. Read the products_data.js file
let jsContent = fs.readFileSync(JS_PATH, 'utf-8');

// 2. Extract the ISHONCH_PRODUCTS array string
const match = jsContent.match(/const ISHONCH_PRODUCTS = (\[[\s\S]*?\]);/);
if (!match) {
    console.error("Could not find ISHONCH_PRODUCTS array in file.");
    process.exit(1);
}

// 3. Neatly evaluate the string since it's just a JS array
let products = [];
try {
    // eval is safe here because we own the local file and it contains static raw data
    products = eval(match[1]);
} catch (e) {
    console.error("Failed to evaluate JS array:", e);
    process.exit(1);
}

console.log(`Found ${products.length} products to migrate.`);

// 4. Connect to SQLite and insert
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
        process.exit(1);
    }
});

let successCount = 0;
let errorCount = 0;

db.serialize(() => {
    const stmt = db.prepare(`
        INSERT OR REPLACE INTO products 
        (id, name, brand, price, old_price, category, image, description, specs, is_new)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    products.forEach(p => {
        const isNew = p.badge === 'new' ? 1 : 0;
        stmt.run(
            [
                p.id.toString(),
                p.name,
                p.brand,
                p.price,
                p.oldPrice || null,
                p.category,
                p.image,
                p.description || '',
                p.specs || '',
                isNew
            ],
            (err) => {
                if (err) {
                    console.error(`Failed to insert ${p.id}:`, err.message);
                    errorCount++;
                } else {
                    successCount++;
                }
            }
        );
    });

    stmt.finalize(() => {
        console.log(`Migration complete. Successfully inserted ${successCount} products. Errors: ${errorCount}`);
        db.close();
    });
});
