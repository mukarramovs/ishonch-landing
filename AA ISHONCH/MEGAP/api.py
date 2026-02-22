from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import httpx
import uvicorn

from utils.database import (
    get_active_web_promotions, get_active_web_banners,
    save_lead, save_web_order, update_lead_status, update_web_order_status,
    get_lead_by_id, get_web_order_by_id, init_database,
    create_or_update_web_user, get_web_user_by_phone,
    get_all_products, get_product, create_product, update_product, delete_product, bulk_update_discount
)
from config import BOT_TOKEN, GROUP_INQUIRIES, GROUP_ORDERS

app = FastAPI(title="ISHONCH CRM API")

# Enable CORS for the landing page
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TELEGRAM_API = f"https://api.telegram.org/bot{BOT_TOKEN}"


# ============= Models =============

class LeadRequest(BaseModel):
    name: str
    phone: str
    source: Optional[str] = "website"
    product_name: Optional[str] = None

class OrderRequest(BaseModel):
    name: str
    phone: str
    product_name: Optional[str] = None
    product_id: Optional[int] = None
    price: Optional[int] = None
    installment_months: Optional[int] = None
    monthly_payment: Optional[int] = None
    payment_type: Optional[str] = None
    user_id: Optional[int] = None

class WebUserRequest(BaseModel):
    full_name: str
    phone: str
    region: Optional[str] = None
    favorite_branch_id: Optional[str] = None

class WebUserLogin(BaseModel):
    phone: str

class ProductRequest(BaseModel):
    id: str
    name: str
    brand: str
    price: int
    old_price: Optional[int] = None
    category: str
    image: str
    description: Optional[str] = ""
    specs: Optional[str] = ""
    is_new: Optional[int] = 0
    discount_percent: Optional[int] = 0

class BulkDiscountRequest(BaseModel):
    category: Optional[str] = "all"
    brand: Optional[str] = "all"
    discount_percent: int

# ============= Telegram Helper =============

async def send_to_telegram(chat_id: str, text: str, reply_markup: dict = None):
    """Send message to Telegram group"""
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "Markdown"
    }
    if reply_markup:
        import json
        payload["reply_markup"] = json.dumps(reply_markup)
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post(f"{TELEGRAM_API}/sendMessage", json=payload)
            return resp.json()
        except Exception as e:
            print(f"Telegram send error: {e}")
            return None


def format_price(n):
    """Format number with spaces: 18500000 → 18 500 000"""
    return f"{n:,}".replace(",", " ")


# ============= Existing Endpoints =============

@app.get("/api/promotions")
async def get_promotions():
    return get_active_web_promotions()

@app.get("/api/banners")
async def get_banners():
    return get_active_web_banners()

# ============= Product Endpoints =============

@app.get("/api/products")
async def api_get_products():
    """Get all published products"""
    return get_all_products()

@app.get("/api/products/{product_id}")
async def api_get_product(product_id: str):
    """Get single product"""
    prod = get_product(product_id)
    if not prod:
        return {"error": "Product not found"}
    return prod

@app.post("/api/products")
async def api_create_product(data: ProductRequest):
    """Admin: create product"""
    try:
        create_product(
            data.id, data.name, data.brand, data.price, data.old_price,
            data.category, data.image, data.description, data.specs, data.is_new, data.discount_percent
        )
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.put("/api/products/{product_id}")
async def api_update_product(product_id: str, data: ProductRequest):
    """Admin: update product"""
    try:
        # We allow changing the ID if needed theoretically, but safer to match path.
        update_product(
            product_id, data.name, data.brand, data.price, data.old_price,
            data.category, data.image, data.description, data.specs, data.is_new, data.discount_percent
        )
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/products/bulk-discount")
async def api_apply_bulk_discount(data: BulkDiscountRequest):
    """Admin: apply discount to multiple products"""
    try:
        affected = bulk_update_discount(data.category, data.brand, data.discount_percent)
        return {"success": True, "affected": affected}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.delete("/api/products/{product_id}")
async def api_delete_product(product_id: str):
    """Admin: delete product"""
    try:
        delete_product(product_id)
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

# ============= CRM Endpoints =============

@app.post("/api/lead")
async def create_lead(data: LeadRequest):
    """Receive inquiry from website contact form → save + send to group"""
    lead_id = save_lead(
        name=data.name,
        phone=data.phone,
        source=data.source or "website",
        product_name=data.product_name
    )
    
    # Send to Inquiries group
    msg = (
        f"📩 *Yangi murojaat #{lead_id}*\n\n"
        f"👤 Ism: {data.name}\n"
        f"📞 Tel: {data.phone}\n"
        f"🌐 Manba: {data.source or 'Sayt'}\n"
    )
    if data.product_name:
        msg += f"📱 Mahsulot: {data.product_name}\n"
    
    reply_markup = {
        "inline_keyboard": [
            [
                {"text": "📞 Qo'ng'iroq qildim", "callback_data": f"crm_lead_called_{lead_id}"},
                {"text": "✅ Hal qilindi", "callback_data": f"crm_lead_done_{lead_id}"}
            ],
            [
                {"text": "❌ Spam", "callback_data": f"crm_lead_spam_{lead_id}"}
            ]
        ]
    }
    
    await send_to_telegram(GROUP_INQUIRIES, msg, reply_markup)
    
    return {"status": "ok", "lead_id": lead_id}


@app.post("/api/order")
async def create_order(data: OrderRequest):
    """Receive order from catalog → save + send to group"""
    order_id = save_web_order(
        name=data.name,
        phone=data.phone,
        product_name=data.product_name,
        product_id=data.product_id,
        price=data.price,
        installment_months=data.installment_months,
        monthly_payment=data.monthly_payment,
        user_id=data.user_id
    )
    
    # Send to Orders group
    msg = (
        f"🛒 *Yangi buyurtma #W-{order_id}*\n\n"
        f"👤 Mijoz: {data.name}\n"
        f"📞 Tel: {data.phone}\n"
    )
    if data.product_name:
        msg += f"📱 Tovar: {data.product_name}\n"
    if data.price:
        msg += f"💰 Narx: {format_price(data.price)} so'm\n"
    if data.payment_type == 'full':
        msg += f"💳 To'lov turi: To'liq to'lov (Muddatsiz)\n"
    elif data.installment_months and data.monthly_payment:
        msg += f"📅 Rassrochka: {data.installment_months} oy × {format_price(data.monthly_payment)} so'm\n"
    msg += f"🌐 Manba: Katalog (sayt)\n"
    
    reply_markup = {
        "inline_keyboard": [
            [
                {"text": "✅ Qabul qilindi", "callback_data": f"crm_order_accept_{order_id}"},
                {"text": "📞 Qo'ng'iroq qildim", "callback_data": f"crm_order_called_{order_id}"}
            ],
            [
                {"text": "❌ Bekor qilish", "callback_data": f"crm_order_reject_{order_id}"}
            ]
        ]
    }
    
    await send_to_telegram(GROUP_ORDERS, msg, reply_markup)
    
    return {"status": "ok", "order_id": order_id}


@app.get("/api/order/{order_id}")
async def get_order_status(order_id: int):
    """Mini tracking: get order status"""
    order = get_web_order_by_id(order_id)
    if not order:
        return {"status": "not_found"}
    return {
        "status": order["status"],
        "order_id": order["id"],
        "product_name": order.get("product_name"),
        "created_at": order.get("created_at")
    }

# ============= USER ACCOUNTS =============

@app.post("/api/register")
async def register_user(data: WebUserRequest):
    """Register or update a user profile"""
    user_id = create_or_update_web_user(
        full_name=data.full_name,
        phone=data.phone,
        region=data.region,
        favorite_branch_id=data.favorite_branch_id
    )
    return {"status": "ok", "user_id": user_id, "phone": data.phone}

@app.get("/api/user/{phone}")
async def get_user_profile(phone: str):
    """Get user profile by phone number"""
    # format phone if needed to match DB
    formatted_phone = phone
    user = get_web_user_by_phone(formatted_phone)
    if not user:
        return {"status": "not_found"}
    return {"status": "ok", "user": user}

# Standalone run (if running api.py separately)
if __name__ == "__main__":
    init_database()
    uvicorn.run(app, host="0.0.0.0", port=8000)
