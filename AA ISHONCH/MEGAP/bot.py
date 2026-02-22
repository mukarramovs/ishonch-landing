import asyncio
import logging
import uvicorn
from aiogram import Bot, Dispatcher
from config import BOT_TOKEN
from utils.database import init_database
from api import app as api_app  # FastAPI app

# Configure logging
logging.basicConfig(level=logging.INFO)

# Initialize bot and dispatcher
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

# Import routers
from handlers import start, menu, credits, product_loan, installment, selection, application, contact_terms, branches, special_order, my_applications, payment, admin
dp.include_router(admin.router)  # Admin first for priority
dp.include_router(credits.router)
dp.include_router(product_loan.router)
dp.include_router(installment.router)
dp.include_router(selection.router)
dp.include_router(application.router)
dp.include_router(branches.router)
dp.include_router(special_order.router)
dp.include_router(my_applications.router)
dp.include_router(contact_terms.router)
dp.include_router(payment.router)
dp.include_router(start.router)
dp.include_router(menu.router)

async def main():
    print("🤖 Bot is starting...")
    print("📊 Initializing database...")
    init_database()
    print("✅ Database ready!")

    # Start FastAPI server in background
    config = uvicorn.Config(api_app, host="0.0.0.0", port=8000, log_level="info")
    server = uvicorn.Server(config)

    # Run bot polling and API server concurrently
    print("🚀 Starting API server on port 8000...")
    await asyncio.gather(
        dp.start_polling(bot),
        server.serve()
    )

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("🛑 Bot stopped!")
