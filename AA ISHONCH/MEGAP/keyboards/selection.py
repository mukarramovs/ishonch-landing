from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder
from utils.text import t

def get_selection_goals(lang: str = 'ru') -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    builder.row(KeyboardButton(text=t("selection_goal_personal", lang=lang)), KeyboardButton(text=t("selection_goal_business", lang=lang)))
    builder.row(KeyboardButton(text=t("selection_goal_auto", lang=lang)), KeyboardButton(text=t("selection_goal_education", lang=lang)))
    builder.row(KeyboardButton(text=t("cancel", lang=lang)))
    return builder.as_markup(resize_keyboard=True)

def get_selection_terms(lang: str = 'ru') -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    builder.row(KeyboardButton(text=t("selection_term_3m", lang=lang)), KeyboardButton(text=t("selection_term_6m", lang=lang)))
    builder.row(KeyboardButton(text=t("selection_term_12m", lang=lang)), KeyboardButton(text=t("selection_term_24m", lang=lang)))
    builder.row(KeyboardButton(text=t("cancel", lang=lang)))
    return builder.as_markup(resize_keyboard=True)

def get_cancel_only(lang: str = 'ru') -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    builder.row(KeyboardButton(text=t("cancel", lang=lang)))
    return builder.as_markup(resize_keyboard=True)

def get_selection_result(lang: str = 'ru') -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    builder.row(KeyboardButton(text=t("menu_leave_application", lang=lang)))
    builder.row(KeyboardButton(text=t("menu_contact_manager", lang=lang)))
    builder.row(KeyboardButton(text=t("main_menu", lang=lang)))
    return builder.as_markup(resize_keyboard=True)
