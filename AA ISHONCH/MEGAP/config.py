import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
if not BOT_TOKEN:
    exit("Error: BOT_TOKEN not found in .env file")

ADMIN_IDS = os.getenv("ADMIN_IDS", "").split(",")

# CRM Group Chat IDs
GROUP_INQUIRIES = os.getenv("GROUP_INQUIRIES", "-5182082056")  # Обращения
GROUP_ORDERS = os.getenv("GROUP_ORDERS", "-5120966981")        # Заказы
