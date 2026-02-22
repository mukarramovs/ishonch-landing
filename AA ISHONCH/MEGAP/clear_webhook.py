import asyncio
from aiogram import Bot
from config import BOT_TOKEN

async def clear_webhook():
    bot = Bot(token=BOT_TOKEN)
    try:
        # Delete webhook
        await bot.delete_webhook(drop_pending_updates=True)
        print("✅ Webhook deleted successfully!")
        print("✅ Pending updates cleared!")
        
        # Get current bot info
        me = await bot.get_me()
        print(f"✅ Bot @{me.username} is ready to use polling!")
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        await bot.session.close()

if __name__ == '__main__':
    asyncio.run(clear_webhook())
