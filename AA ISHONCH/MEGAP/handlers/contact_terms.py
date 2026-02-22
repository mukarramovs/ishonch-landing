from aiogram import Router, F, types
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from keyboards.contact import get_contact_menu
from keyboards.terms import get_terms_menu
from keyboards.main_menu import get_main_menu
from utils.text import t, get_all_texts
from utils.database import get_user_language

router = Router()

class InfoStates(StatesGroup):
    contact = State()
    terms = State()

# --- Contact Section ---
@router.message(F.text.in_(get_all_texts("menu_contact_manager")))
async def contact_info(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    lang = get_user_language(user_id)
    await state.set_state(InfoStates.contact)
    await message.answer(
        t("contact_info", lang=lang),
        parse_mode="Markdown",
        reply_markup=get_contact_menu(lang=lang)
    )

@router.message(InfoStates.contact, F.text.in_(get_all_texts("back")))
async def back_from_contact(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(t("main_menu_response", user_id=message.from_user.id), reply_markup=get_main_menu(message.from_user.id))

@router.message(InfoStates.contact, F.text.in_(get_all_texts("main_menu")))
async def main_menu_from_contact(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(t("main_menu_response", user_id=message.from_user.id), reply_markup=get_main_menu(message.from_user.id))

# --- Terms Section ---
@router.message(F.text.in_(get_all_texts("menu_terms")))
async def terms_info(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    lang = get_user_language(user_id)
    await state.set_state(InfoStates.terms)
    await message.answer(
        t("terms_intro", lang=lang),
        parse_mode="Markdown",
        reply_markup=get_terms_menu(lang=lang)
    )

@router.message(InfoStates.terms, F.text.in_(get_all_texts("terms_user_agreement")))
async def show_user_agreement(message: types.Message):
    await message.answer(t("terms_user_agreement_text", user_id=message.from_user.id), parse_mode="Markdown")

@router.message(InfoStates.terms, F.text.in_(get_all_texts("terms_privacy_policy")))
async def show_privacy_policy(message: types.Message):
    await message.answer(t("terms_privacy_policy_text", user_id=message.from_user.id), parse_mode="Markdown")

@router.message(InfoStates.terms, F.text.in_(get_all_texts("back")))
async def back_from_terms(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(t("main_menu_response", user_id=message.from_user.id), reply_markup=get_main_menu(message.from_user.id))

@router.message(InfoStates.terms, F.text.in_(get_all_texts("main_menu")))
async def main_menu_from_terms(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(t("main_menu_response", user_id=message.from_user.id), reply_markup=get_main_menu(message.from_user.id))
