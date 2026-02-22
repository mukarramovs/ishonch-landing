from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder
from utils.text import t

def get_special_order_menu(lang: str = 'ru') -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    builder.row(KeyboardButton(text=t("main_menu", lang=lang)))
    return builder.as_markup(resize_keyboard=True)

def get_viloyats_keyboard(viloyats: list, lang: str = 'ru') -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    for viloyat in viloyats:
        builder.button(text=viloyat)
    builder.adjust(2)
    builder.row(KeyboardButton(text=t("cancel", lang=lang)))
    return builder.as_markup(resize_keyboard=True)

def get_branches_keyboard(branches: list, lang: str = 'ru') -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    for branch in branches:
        builder.button(text=branch['name'])
    builder.adjust(1)
    builder.row(KeyboardButton(text=t("branch_back_to_regions", lang=lang)))
    builder.row(KeyboardButton(text=t("cancel", lang=lang)))
    return builder.as_markup(resize_keyboard=True)

def get_contact_share_keyboard(lang: str = 'ru') -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    builder.row(KeyboardButton(text=t("share_phone", lang=lang), request_contact=True))
    builder.row(KeyboardButton(text=t("cancel", lang=lang)))
    return builder.as_markup(resize_keyboard=True)

def get_cancel_only(lang: str = 'ru') -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    builder.row(KeyboardButton(text=t("cancel", lang=lang)))
    return builder.as_markup(resize_keyboard=True)
