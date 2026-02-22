from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder

def get_service_types() -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    builder.row(KeyboardButton(text="Кредит наличными"))
    builder.row(KeyboardButton(text="Кредит на товар"))
    builder.row(KeyboardButton(text="Рассрочка"))
    builder.row(KeyboardButton(text="Автокредит"))
    builder.row(KeyboardButton(text="❌ Отмена"))
    return builder.as_markup(resize_keyboard=True)

def get_agreement_keyboard() -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    builder.row(KeyboardButton(text="✅ Подтверждаю"))
    builder.row(KeyboardButton(text="❌ Отмена"))
    return builder.as_markup(resize_keyboard=True)

def get_confirmation_keyboard() -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    builder.row(KeyboardButton(text="✅ Отправить заявку"))
    builder.row(KeyboardButton(text="❌ Отменить"))
    return builder.as_markup(resize_keyboard=True)

def get_cancel_only() -> ReplyKeyboardMarkup:
    builder = ReplyKeyboardBuilder()
    builder.row(KeyboardButton(text="❌ Отмена"))
    return builder.as_markup(resize_keyboard=True)
