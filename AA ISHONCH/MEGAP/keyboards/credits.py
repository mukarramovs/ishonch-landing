from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder
from utils.text import t

def get_credits_menu(lang: str = 'ru') -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    
    builder.row(
        KeyboardButton(text=t("credits_conditions", lang=lang)),
        KeyboardButton(text=t("credits_requirements", lang=lang))
    )
    builder.row(
        KeyboardButton(text=t("credits_terms", lang=lang)),
        KeyboardButton(text=t("menu_leave_application", lang=lang))
    )
    builder.row(
        KeyboardButton(text=t("back", lang=lang)),
        KeyboardButton(text=t("main_menu", lang=lang))
    )
    
    return builder.as_markup(resize_keyboard=True)

def get_back_menu(lang: str = 'ru') -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    builder.row(
        KeyboardButton(text=t("back", lang=lang)),
        KeyboardButton(text=t("main_menu", lang=lang))
    )
    return builder.as_markup(resize_keyboard=True)
