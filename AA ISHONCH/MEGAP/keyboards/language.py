from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from utils.text import AVAILABLE_LANGUAGES

def get_language_keyboard() -> ReplyKeyboardMarkup:
    """Return keyboard with available languages"""
    buttons = []
    # Create rows of 2 buttons
    row = []
    for lang_code, lang_name in AVAILABLE_LANGUAGES.items():
        row.append(KeyboardButton(text=lang_name))
        if len(row) == 2:
            buttons.append(row)
            row = []
    if row:
        buttons.append(row)
        
    return ReplyKeyboardMarkup(keyboard=buttons, resize_keyboard=True)
