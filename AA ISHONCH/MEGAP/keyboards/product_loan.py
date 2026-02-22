from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder
from utils.text import t

def get_product_loan_menu(lang: str = 'ru') -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    
    builder.row(
        KeyboardButton(text=t("product_loan_apply", lang=lang)),
        KeyboardButton(text=t("back", lang=lang))
    )
    builder.row(
        KeyboardButton(text=t("main_menu", lang=lang))
    )
    
    return builder.as_markup(resize_keyboard=True)
