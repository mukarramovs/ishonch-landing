from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder
from utils.text import t

def get_installment_menu(lang: str = 'ru') -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    
    # Similar to Product Loan: Apply or Back
    builder.row(
        KeyboardButton(text=t("apply_installment", lang=lang)),
        KeyboardButton(text=t("back", lang=lang))
    )
    builder.row(
        KeyboardButton(text=t("main_menu", lang=lang))
    )
    
    return builder.as_markup(resize_keyboard=True)
