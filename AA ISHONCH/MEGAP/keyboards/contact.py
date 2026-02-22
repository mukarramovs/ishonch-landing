from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder
from utils.text import t

def get_contact_menu(lang: str = 'ru') -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    builder.row(KeyboardButton(text=t("back", lang=lang)), KeyboardButton(text=t("main_menu", lang=lang)))
    return builder.as_markup(resize_keyboard=True)
