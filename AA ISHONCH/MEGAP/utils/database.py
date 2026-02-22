import sqlite3
from datetime import datetime
from typing import List, Dict, Optional
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "applications.db")

def init_database():
    """Initialize database and create tables if they don't exist"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create applications table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            username TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            service_type TEXT NOT NULL,
            desired_item TEXT,
            comment TEXT,
            status TEXT DEFAULT 'pending',
            admin_comment TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create special_orders table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS special_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            username TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            product_name TEXT NOT NULL,
            region TEXT NOT NULL,
            branch TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            admin_comment TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create promotions table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS promotions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            image_id TEXT,
            link TEXT,
            end_date TEXT NOT NULL,
            is_active INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create banners table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS banners (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_id TEXT NOT NULL,
            text TEXT,
            button_text TEXT,
            button_link TEXT,
            priority INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create promotions table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS promotions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title_ru TEXT NOT NULL,
            title_uz TEXT NOT NULL,
            description_ru TEXT NOT NULL,
            description_uz TEXT NOT NULL,
            image_url TEXT,
            link TEXT,
            is_active INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create banners table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS banners (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title_ru TEXT,
            title_uz TEXT,
            image_url TEXT NOT NULL,
            link TEXT,
            is_active INTEGER DEFAULT 1,
            priority INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY,
            username TEXT,
            full_name TEXT,
            language TEXT DEFAULT 'ru',
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Check if language column exists in users table (migration)
    try:
        cursor.execute("SELECT language FROM users LIMIT 1")
    except sqlite3.OperationalError:
        cursor.execute("ALTER TABLE users ADD COLUMN language TEXT DEFAULT 'ru'")
    
    # Create settings table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    """)
    
    # CRM: Leads table (website contact form)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            source TEXT DEFAULT 'website',
            product_name TEXT,
            product_id INTEGER,
            status TEXT DEFAULT 'new',
            admin_comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # CRM: Web orders table (catalog orders)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS web_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            product_name TEXT,
            product_id INTEGER,
            price INTEGER,
            installment_months INTEGER,
            monthly_payment INTEGER,
            user_id INTEGER,
            source TEXT DEFAULT 'website',
            status TEXT DEFAULT 'new',
            admin_comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Web Users table (for website accounts)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS web_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            region TEXT,
            favorite_branch_id TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Products Catalog table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            brand TEXT NOT NULL,
            price INTEGER NOT NULL,
            old_price INTEGER,
            category TEXT NOT NULL,
            image TEXT NOT NULL,
            description TEXT,
            specs TEXT,
            is_new INTEGER DEFAULT 0,
            discount_percent INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Initialize default settings if not exists
    default_settings = {
        'maintenance_mode': '0',
        'enable_installment': '1',
        'enable_special_orders': '1',
        'enable_branches': '1',
        'enable_application': '1',
        'enable_credits': '1',
        'enable_product_loan': '1',
        'enable_payment': '1',
        'enable_promotions': '1'
    }
    
    for key, value in default_settings.items():
        cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", (key, value))
    
    conn.commit()
    conn.close()
    print("✅ Database initialized successfully")

# ============= SETTINGS =============

def get_setting(key: str, default: str = '0') -> str:
    """Get setting value"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT value FROM settings WHERE key = ?", (key,))
    row = cursor.fetchone()
    
    conn.close()
    return row[0] if row else default

def set_setting(key: str, value: str) -> bool:
    """Set setting value"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", (key, value))
    
    conn.commit()
    conn.close()
    return True

def get_all_settings() -> Dict[str, str]:
    """Get all settings as dictionary"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT key, value FROM settings")
    rows = cursor.fetchall()
    
    conn.close()
    return {row[0]: row[1] for row in rows}

# ============= USERS =============

def add_user(user_id: int, username: str, full_name: str, language: str = 'ru') -> bool:
    """Add a new user if not exists"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT user_id FROM users WHERE user_id = ?", (user_id,))
    if cursor.fetchone():
        conn.close()
        return False
        
    cursor.execute("""
        INSERT INTO users (user_id, username, full_name, language)
        VALUES (?, ?, ?, ?)
    """, (user_id, username, full_name, language))
    
    conn.commit()
    conn.close()
    return True

def get_all_users() -> List[int]:
    """Get all user IDs"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT user_id FROM users")
    rows = cursor.fetchall()
    
    conn.close()
    return [row[0] for row in rows]

def count_users() -> int:
    """Count total users"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM users")
    count = cursor.fetchone()[0]
    
    conn.close()
    return count

def get_user_language(user_id: int) -> str:
    """Get user's preferred language"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT language FROM users WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()
    
    conn.close()
    return row[0] if row else 'ru'

def set_user_language(user_id: int, language: str) -> bool:
    """Set user's preferred language"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("UPDATE users SET language = ? WHERE user_id = ?", (language, user_id))
    
    success = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return success

# ============= APPLICATIONS =============

def save_application(user_id: int, username: str, name: str, phone: str, 
                     service_type: str, desired_item: str, comment: str) -> int:
    """Save a new application and return its ID"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO applications (user_id, username, name, phone, service_type, desired_item, comment, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    """, (user_id, username, name, phone, service_type, desired_item, comment))
    
    app_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return app_id

def get_user_applications(user_id: int) -> List[Dict]:
    """Get all applications for a specific user"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT * FROM applications 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    """, (user_id,))
    
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

def get_application_by_id(app_id: int) -> Optional[Dict]:
    """Get a specific application by ID"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM applications WHERE id = ?", (app_id,))
    row = cursor.fetchone()
    conn.close()
    
    return dict(row) if row else None

def update_application_status(app_id: int, new_status: str, admin_comment: str = None) -> bool:
    """Update application status and optionally admin comment"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    if admin_comment is not None:
        cursor.execute("""
            UPDATE applications 
            SET status = ?, admin_comment = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        """, (new_status, admin_comment, app_id))
    else:
        cursor.execute("""
            UPDATE applications 
            SET status = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        """, (new_status, app_id))
    
    success = cursor.rowcount > 0
    conn.commit()
    conn.close()
    
    return success

def get_all_applications(status: Optional[str] = None) -> List[Dict]:
    """Get all applications, optionally filtered by status"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    if status:
        cursor.execute("""
            SELECT * FROM applications 
            WHERE status = ? 
            ORDER BY created_at DESC
        """, (status,))
    else:
        cursor.execute("SELECT * FROM applications ORDER BY created_at DESC")
    
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

# ============= SPECIAL ORDERS =============

def save_special_order(user_id: int, username: str, name: str, phone: str,
                       product_name: str, region: str, branch: str) -> int:
    """Save a new special order and return its ID"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO special_orders (user_id, username, name, phone, product_name, region, branch, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    """, (user_id, username, name, phone, product_name, region, branch))
    
    order_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return order_id

def get_user_special_orders(user_id: int) -> List[Dict]:
    """Get all special orders for a specific user"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT * FROM special_orders 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    """, (user_id,))
    
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

def get_special_order_by_id(order_id: int) -> Optional[Dict]:
    """Get a specific special order by ID"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM special_orders WHERE id = ?", (order_id,))
    row = cursor.fetchone()
    conn.close()
    
    return dict(row) if row else None

def update_special_order_status(order_id: int, new_status: str, admin_comment: str = None) -> bool:
    """Update special order status and optionally admin comment"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    if admin_comment is not None:
        cursor.execute("""
            UPDATE special_orders 
            SET status = ?, admin_comment = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        """, (new_status, admin_comment, order_id))
    else:
        cursor.execute("""
            UPDATE special_orders 
            SET status = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        """, (new_status, order_id))
    
    success = cursor.rowcount > 0
    conn.commit()
    conn.close()
    
    return success

def get_all_special_orders(status: Optional[str] = None) -> List[Dict]:
    """Get all special orders, optionally filtered by status"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    if status:
        cursor.execute("""
            SELECT * FROM special_orders 
            WHERE status = ? 
            ORDER BY created_at DESC
        """, (status,))
    else:
        cursor.execute("SELECT * FROM special_orders ORDER BY created_at DESC")
    
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]

# ============= UTILITY FUNCTIONS =============

def get_status_emoji(status: str) -> str:
    """Get emoji for status"""
    status_emojis = {
        'pending': '🕐',
        'accepted': '✅',
        'processing': '⚙️',
        'completed': '✔️',
        'rejected': '❌'
    }
    return status_emojis.get(status, '❓')

def get_status_text(status: str) -> str:
    """Get Russian text for status"""
    status_texts = {
        'pending': 'На рассмотрении',
        'accepted': 'Принята',
        'processing': 'В обработке',
        'completed': 'Завершена',
        'rejected': 'Отклонена'
    }
    return status_texts.get(status, 'Неизвестно')

# ============= WEBSITE PROMOTIONS & BANNERS =============

def create_web_promotion(title_ru, title_uz, desc_ru, desc_uz, image_url=None, link=None):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO promotions (title_ru, title_uz, description_ru, description_uz, image_url, link)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (title_ru, title_uz, desc_ru, desc_uz, image_url, link))
    conn.commit()
    conn.close()

def get_active_web_promotions():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM promotions WHERE is_active = 1 ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def delete_web_promotion(promo_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM promotions WHERE id = ?", (promo_id,))
    conn.commit()
    conn.close()

def create_web_banner(title_ru, title_uz, image_url, link=None, priority=0):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO banners (title_ru, title_uz, image_url, link, priority)
        VALUES (?, ?, ?, ?, ?)
    """, (title_ru, title_uz, image_url, link, priority))
    conn.commit()
    conn.close()

def get_active_web_banners():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM banners WHERE is_active = 1 ORDER BY priority DESC, created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def delete_web_banner(banner_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM banners WHERE id = ?", (banner_id,))
    conn.commit()
    conn.close()

# ============= CATALOG : PRODUCTS =============

def get_all_products():
    """Retrieve all products from the catalog"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_product(product_id: str):
    """Retrieve a single product by ID"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def create_product(product_id: str, name: str, brand: str, price: int, old_price: int, 
                  category: str, image: str, description: str, specs: str, is_new: int = 0, discount_percent: int = 0):
    """Create a new product in the catalog"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO products (id, name, brand, price, old_price, category, image, description, specs, is_new, discount_percent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (product_id, name, brand, price, old_price, category, image, description, specs, is_new, discount_percent))
    conn.commit()
    conn.close()
    return True

def update_product(product_id: str, name: str, brand: str, price: int, old_price: int, 
                  category: str, image: str, description: str, specs: str, is_new: int, discount_percent: int = 0):
    """Update an existing product"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE products 
        SET name = ?, brand = ?, price = ?, old_price = ?, category = ?, 
            image = ?, description = ?, specs = ?, is_new = ?, discount_percent = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (name, brand, price, old_price, category, image, description, specs, is_new, discount_percent, product_id))
    rows_affected = cursor.rowcount
    conn.commit()
    conn.close()
    return rows_affected > 0

def bulk_update_discount(category: str, brand: str, discount_percent: int):
    """Apply discount to all products matching category and/or brand"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    query = "UPDATE products SET discount_percent = ?"
    params = [discount_percent]

    conditions = []
    if category and category.lower() != 'all':
        conditions.append("category = ?")
        params.append(category)
    if brand and brand.lower() != 'all':
        conditions.append("brand = ?")
        params.append(brand)
    
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
        
    cursor.execute(query, params)
    rows_affected = cursor.rowcount
    conn.commit()
    conn.close()
    return rows_affected

def delete_product(product_id: str):
    """Delete a product from the catalog"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
    rows_affected = cursor.rowcount
    conn.commit()
    conn.close()
    return rows_affected > 0

# ============= CRM: LEADS =============

def save_lead(name: str, phone: str, source: str = 'website',
              product_name: str = None, product_id: int = None) -> int:
    """Save a new lead from website and return its ID"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO leads (name, phone, source, product_name, product_id)
        VALUES (?, ?, ?, ?, ?)
    """, (name, phone, source, product_name, product_id))
    lead_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return lead_id

def update_lead_status(lead_id: int, status: str, comment: str = None) -> bool:
    """Update lead status"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    if comment is not None:
        cursor.execute("""
            UPDATE leads SET status = ?, admin_comment = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (status, comment, lead_id))
    else:
        cursor.execute("""
            UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (status, lead_id))
    success = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return success

def get_lead_by_id(lead_id: int) -> Optional[Dict]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM leads WHERE id = ?", (lead_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

# ============= CRM: WEB ORDERS =============

def save_web_order(name: str, phone: str, product_name: str = None,
                   product_id: int = None, price: int = None,
                   installment_months: int = None, monthly_payment: int = None,
                   user_id: int = None, source: str = 'website') -> int:
    """Save a web order from catalog and return its ID"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Try adding user_id column if it doesn't exist
    try:
        cursor.execute("ALTER TABLE web_orders ADD COLUMN user_id INTEGER")
    except sqlite3.OperationalError:
        pass # Column already exists
        
    cursor.execute("""
        INSERT INTO web_orders (name, phone, product_name, product_id, price,
                                installment_months, monthly_payment, user_id, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (name, phone, product_name, product_id, price,
          installment_months, monthly_payment, user_id, source))
    order_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return order_id

def update_web_order_status(order_id: int, status: str, comment: str = None) -> bool:
    """Update web order status"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    if comment is not None:
        cursor.execute("""
            UPDATE web_orders SET status = ?, admin_comment = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (status, comment, order_id))
    else:
        cursor.execute("""
            UPDATE web_orders SET status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (status, order_id))
    success = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return success

def get_web_order_by_id(order_id: int) -> Optional[Dict]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM web_orders WHERE id = ?", (order_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

# ============= ANALYTICS =============

def get_daily_stats() -> Dict:
    """Get statistics for the current day and totals"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    stats = {
        'users_total': 0,
        'users_today': 0,
        'apps_total': 0,
        'apps_today': 0,
        'orders_total': 0,
        'orders_today': 0,
        'leads_total': 0,
        'leads_today': 0,
        'web_orders_total': 0,
        'web_orders_today': 0
    }
    
    # Users
    cursor.execute("SELECT COUNT(*) FROM users")
    stats['users_total'] = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM users WHERE date(joined_at) = date('now', 'localtime')")
    stats['users_today'] = cursor.fetchone()[0]
    
    # Applications
    cursor.execute("SELECT COUNT(*) FROM applications")
    stats['apps_total'] = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM applications WHERE date(created_at) = date('now', 'localtime')")
    stats['apps_today'] = cursor.fetchone()[0]
    
    # Special Orders
    cursor.execute("SELECT COUNT(*) FROM special_orders")
    stats['orders_total'] = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM special_orders WHERE date(created_at) = date('now', 'localtime')")
    stats['orders_today'] = cursor.fetchone()[0]
    
    # CRM: Leads
    cursor.execute("SELECT COUNT(*) FROM leads")
    stats['leads_total'] = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM leads WHERE date(created_at) = date('now', 'localtime')")
    stats['leads_today'] = cursor.fetchone()[0]
    
    # CRM: Web Orders
    cursor.execute("SELECT COUNT(*) FROM web_orders")
    stats['web_orders_total'] = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM web_orders WHERE date(created_at) = date('now', 'localtime')")
    stats['web_orders_today'] = cursor.fetchone()[0]
    
    conn.close()
    return stats


# ============= WEB USERS =============

def create_or_update_web_user(full_name: str, phone: str, region: str = None, favorite_branch_id: str = None) -> int:
    """Create a new web user or update existing one by phone"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if exists
    cursor.execute("SELECT id FROM web_users WHERE phone = ?", (phone,))
    row = cursor.fetchone()
    
    if row:
        user_id = row[0]
        # Update
        cursor.execute("""
            UPDATE web_users
            SET full_name = ?, region = ?, favorite_branch_id = ?
            WHERE id = ?
        """, (full_name, region, favorite_branch_id, user_id))
    else:
        # Create
        cursor.execute("""
            INSERT INTO web_users (full_name, phone, region, favorite_branch_id)
            VALUES (?, ?, ?, ?)
        """, (full_name, phone, region, favorite_branch_id))
        user_id = cursor.lastrowid
        
    conn.commit()
    conn.close()
    return user_id


def get_web_user_by_phone(phone: str) -> Optional[Dict]:
    """Get web user by phone"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM web_users WHERE phone = ?", (phone,))
    row = cursor.fetchone()
    
    conn.close()
    return dict(row) if row else None

