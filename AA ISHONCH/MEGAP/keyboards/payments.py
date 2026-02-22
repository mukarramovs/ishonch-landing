from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder
from utils.text import t

def get_payment_menu(lang: str = 'ru') -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    
    builder.row(
        KeyboardButton(text=t("payment_btn_click", lang=lang)),
        KeyboardButton(text=t("payment_btn_payme", lang=lang))
    )
    builder.row(
        KeyboardButton(text=t("payment_btn_plum", lang=lang)),
        KeyboardButton(text=t("payment_btn_sellopay", lang=lang))
    )
    builder.row(
        KeyboardButton(text=t("payment_btn_operator", lang=lang))
    )
    builder.row(
        KeyboardButton(text=t("back", lang=lang))
    )
    
    return builder.as_markup(resize_keyboard=True)
