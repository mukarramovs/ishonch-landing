from aiogram import Router, types, F
from aiogram.filters import CommandStart, Command
from aiogram.fsm.context import FSMContext

from keyboards.main_menu import get_main_menu
from keyboards.language import get_language_keyboard
from utils.database import add_user, get_setting, set_user_language, get_user_language
from utils.text import t, AVAILABLE_LANGUAGES, LANG_RU, LANG_UZ, LANG_KAA
from config import ADMIN_IDS

def is_admin(user_id: int) -> bool:
    return str(user_id) in [admin_id.strip() for admin_id in ADMIN_IDS if admin_id]

router = Router()

@router.message(CommandStart())
async def cmd_start(message: types.Message):
    user = message.from_user
    
    # Check Maintenance Mode
    maintenance_mode = get_setting('maintenance_mode') == '1'
    if maintenance_mode and not is_admin(user.id):
        # Try to get user language, default to ru
        lang = get_user_language(user.id)
        await message.answer(
            t("maintenance_mode", lang=lang),
            parse_mode="Markdown",
            reply_markup=types.ReplyKeyboardRemove()
        )
        return

    # Register user (no-op if already exists)
    add_user(user.id, user.username, user.full_name)
    
    # Always prompt for language selection on /start
    await message.answer(
        "🇷🇺 Пожалуйста, выберите язык:\n"
        "🇺🇿 Iltimos, tilni tanlang:\n"
        "🏳️ Ótinish, tildi tańlań:",
        reply_markup=get_language_keyboard()
    )

@router.message(F.text.in_(AVAILABLE_LANGUAGES.values()))
async def language_selected(message: types.Message):
    user = message.from_user
    text = message.text
    
    # Find language code based on text
    selected_lang = None
    for code, name in AVAILABLE_LANGUAGES.items():
        if name == text:
            selected_lang = code
            break
            
    if selected_lang:
        set_user_language(user.id, selected_lang)
        
        await message.answer(
            t("language_selected", lang=selected_lang),
            reply_markup=get_main_menu(user.id)
        )
        # Also confirm with welcome message or just main menu?
        # Let's show welcome message to orient them
        await message.answer(
            t("welcome", lang=selected_lang),
            reply_markup=get_main_menu(user.id)
        )

# --- Temporary: get chat ID for group linking ---
@router.message(Command("idchat"))
async def cmd_idchat(message: types.Message):
    chat = message.chat
    text = (
        f"🆔 **Chat ID:** `{chat.id}`\n"
        f"📝 **Turi:** {chat.type}\n"
    )
    if chat.title:
        text += f"📌 **Nomi:** {chat.title}\n"
    if chat.username:
        text += f"🔗 **Username:** @{chat.username}\n"
    await message.answer(text, parse_mode="Markdown")
