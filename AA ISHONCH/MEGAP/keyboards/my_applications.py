from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder, InlineKeyboardBuilder
from utils.text import t

def get_my_applications_menu(lang: str = 'ru') -> ReplyKeyboardMarkup:
    """Main menu for My Applications section"""
    builder = ReplyKeyboardBuilder()
    
    builder.row(
        KeyboardButton(text=t("my_apps_refresh", lang=lang))
    )
    builder.row(
        KeyboardButton(text=t("my_apps_back", lang=lang))
    )
    
    return builder.as_markup(resize_keyboard=True)

def get_application_details_keyboard(app_id: int) -> InlineKeyboardMarkup:
    """Inline keyboard for viewing application details"""
    builder = InlineKeyboardBuilder()
    
    builder.row(
        InlineKeyboardButton(text="📋 Подробнее", callback_data=f"app_details_{app_id}")
    )
    
    return builder.as_markup()
