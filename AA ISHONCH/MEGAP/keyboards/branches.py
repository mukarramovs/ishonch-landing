from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder, InlineKeyboardBuilder
from utils.text import t

def get_viloyats_keyboard(viloyats: list, lang: str = 'ru') -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    
    # Add viloyat buttons in rows of 2
    for i in range(0, len(viloyats), 2):
        row_btns = [KeyboardButton(text=v) for v in viloyats[i:i+2]]
        builder.row(*row_btns)
        
    builder.row(KeyboardButton(text=t("back", lang=lang)), KeyboardButton(text=t("main_menu", lang=lang)))
    return builder.as_markup(resize_keyboard=True)

def get_branches_keyboard(branches: list, lang: str = 'ru') -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    
    # Branches as buttons. Assuming 'name' is unique enough or we handle it by text match.
    # If many branches, maybe pagination? For now, list all.
    for i in range(0, len(branches), 2):
        row_names = [b['name'] for b in branches[i:i+2]]
        row_btns = [KeyboardButton(text=name) for name in row_names]
        builder.row(*row_btns)
        
    builder.row(KeyboardButton(text=t("branch_back_to_regions", lang=lang)), KeyboardButton(text=t("main_menu", lang=lang)))
    return builder.as_markup(resize_keyboard=True)

def get_branch_actions(map_url: str = None, lang: str = 'ru') -> InlineKeyboardMarkup:
    # Requires inline buttons for actions in the card message?
    # User request:
    # - 📍 Открыть на карте (if link)
    # - 📝 Оставить заявку (callback?)
    # - 👤 Связаться с менеджером (callback?)
    # - ⬅️ Назад к списку филиалов (callback?)
    # - 🏠 Главное меню (callback?)
    
    # WAIT! The user request implies a Reply Keyboard flow usually ("Back" button in chat).
    # But "Open on Map" MUST be an Inline URL button.
    # Mixing Inline and Reply is possible. 
    # Usually: Menu navigation via Reply, specific actions via Inline.
    # OR: Text message with Inline Buttons.
    
    # Let's use Inline for "Open Map" and "Actions".
    # And allow Reply for "Back".
    
    builder = InlineKeyboardBuilder()
    
    if map_url and "http" in map_url:
        builder.row(InlineKeyboardButton(text=t("branch_open_map", lang=lang), url=map_url))
        
    builder.row(InlineKeyboardButton(text=t("branch_apply", lang=lang), callback_data="apply_branch"))
    builder.row(InlineKeyboardButton(text=t("branch_contact", lang=lang), callback_data="contact_branch"))
    
    # Navigation usually better in Reply if previous steps were Reply.
    # But user asked for specific buttons in the card.
    
    return builder.as_markup()

def get_branch_reply_nav(lang: str = 'ru') -> ReplyKeyboardMarkup:
    # Navigation buttons that should always be available in Branch Card view
    builder = ReplyKeyboardBuilder()
    builder.row(KeyboardButton(text=t("branch_back_to_list", lang=lang)), KeyboardButton(text=t("main_menu", lang=lang)))
    return builder.as_markup(resize_keyboard=True)
