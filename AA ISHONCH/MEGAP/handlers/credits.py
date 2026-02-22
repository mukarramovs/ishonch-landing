from aiogram import Router, F, types
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from keyboards.credits import get_credits_menu, get_back_menu
from keyboards.main_menu import get_main_menu
from utils.text import t, get_all_texts
from utils.database import get_setting, get_user_language

router = Router()

class CreditsState(StatesGroup):
    menu = State()
    info = State()

# Entry point
@router.message(F.text.in_(get_all_texts("menu_credits")))
async def cmd_credits(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    if get_setting('enable_credits') == '0':
        await message.answer(t("section_disabled", user_id=user_id))
        return
    await state.set_state(CreditsState.menu)
    lang = get_user_language(user_id)
    await message.answer(
        t("credits_intro", lang=lang),
        reply_markup=get_credits_menu(lang=lang)
    )

# Back to Main Menu from Credits Menu
@router.message(CreditsState.menu, F.text.in_(get_all_texts("back")))
async def back_from_credits_menu(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(t("main_menu_response", user_id=message.from_user.id), reply_markup=get_main_menu(message.from_user.id))

# Main menu from credits
@router.message(CreditsState.menu, F.text.in_(get_all_texts("main_menu")))
async def main_menu_from_credits(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(t("main_menu_response", user_id=message.from_user.id), reply_markup=get_main_menu(message.from_user.id))

# Sub-items
@router.message(CreditsState.menu, F.text.in_(get_all_texts("credits_conditions")))
async def show_conditions(message: types.Message, state: FSMContext):
    await state.set_state(CreditsState.info)
    lang = get_user_language(message.from_user.id)
    await message.answer(t("credits_conditions_text", lang=lang), parse_mode="Markdown", reply_markup=get_back_menu(lang=lang))

@router.message(CreditsState.menu, F.text.in_(get_all_texts("credits_requirements")))
async def show_requirements(message: types.Message, state: FSMContext):
    await state.set_state(CreditsState.info)
    lang = get_user_language(message.from_user.id)
    await message.answer(t("credits_requirements_text", lang=lang), parse_mode="Markdown", reply_markup=get_back_menu(lang=lang))

@router.message(CreditsState.menu, F.text.in_(get_all_texts("credits_terms")))
async def show_terms(message: types.Message, state: FSMContext):
    await state.set_state(CreditsState.info)
    lang = get_user_language(message.from_user.id)
    await message.answer(t("credits_terms_text", lang=lang), parse_mode="Markdown", reply_markup=get_back_menu(lang=lang))

# Back from Info to Credits Menu
@router.message(CreditsState.info, F.text.in_(get_all_texts("back")))
async def back_from_info(message: types.Message, state: FSMContext):
    await state.set_state(CreditsState.menu)
    lang = get_user_language(message.from_user.id)
    await message.answer(
        t("credits_back_to_menu", lang=lang),
        reply_markup=get_credits_menu(lang=lang)
    )

# Main menu from info
@router.message(CreditsState.info, F.text.in_(get_all_texts("main_menu")))
async def main_menu_from_info(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(t("main_menu_response", user_id=message.from_user.id), reply_markup=get_main_menu(message.from_user.id))
