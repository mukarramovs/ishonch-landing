from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder
from utils.text import t

def get_terms_menu(lang: str = 'ru') -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    builder.row(
        KeyboardButton(text=t("terms_user_agreement", lang=lang)),
        KeyboardButton(text=t("terms_privacy_policy", lang=lang))
    )
    builder.row(KeyboardButton(text=t("back", lang=lang)), KeyboardButton(text=t("main_menu", lang=lang)))
    return builder.as_markup(resize_keyboard=True)
