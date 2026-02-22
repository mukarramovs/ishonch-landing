from aiogram import Router, F, types
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from keyboards.selection import (
    get_selection_goals, 
    get_selection_terms, 
    get_cancel_only, 
    get_selection_result
)
from keyboards.main_menu import get_main_menu
from utils.text import t, get_all_texts
from utils.database import get_setting, get_user_language

router = Router()

class SelectionState(StatesGroup):
    q1_goal = State()
    q2_amount = State()
    q3_term = State()
    q4_income = State()

# Entry
@router.message(F.text.in_(get_all_texts("menu_credit_selection")))
async def start_selection(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    if get_setting('enable_credits') == '0':
        await message.answer(t("section_disabled", user_id=user_id))
        return
        
    await state.set_state(SelectionState.q1_goal)
    lang = get_user_language(user_id)
    await message.answer(
        t("selection_intro", lang=lang),
        parse_mode="Markdown",
        reply_markup=get_selection_goals(lang=lang)
    )

# Cancellation handler for selection states
@router.message(SelectionState.q1_goal, F.text.in_(get_all_texts("cancel")))
@router.message(SelectionState.q2_amount, F.text.in_(get_all_texts("cancel")))
@router.message(SelectionState.q3_term, F.text.in_(get_all_texts("cancel")))
@router.message(SelectionState.q4_income, F.text.in_(get_all_texts("cancel")))
async def cancel_selection(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(t("selection_cancelled", user_id=message.from_user.id), reply_markup=get_main_menu(message.from_user.id))

# Q1 -> Q2
@router.message(SelectionState.q1_goal)
async def process_goal(message: types.Message, state: FSMContext):
    await state.update_data(goal=message.text)
    await state.set_state(SelectionState.q2_amount)
    lang = get_user_language(message.from_user.id)
    await message.answer(
        t("selection_q2", lang=lang),
        reply_markup=get_cancel_only(lang=lang)
    )

# Q2 -> Q3
@router.message(SelectionState.q2_amount)
async def process_amount(message: types.Message, state: FSMContext):
    if not message.text.isdigit():
        await message.answer(t("selection_invalid_number", user_id=message.from_user.id))
        return
        
    await state.update_data(amount=message.text)
    await state.set_state(SelectionState.q3_term)
    lang = get_user_language(message.from_user.id)
    await message.answer(
        t("selection_q3", lang=lang),
        reply_markup=get_selection_terms(lang=lang)
    )

# Q3 -> Q4
@router.message(SelectionState.q3_term)
async def process_term(message: types.Message, state: FSMContext):
    await state.update_data(term=message.text)
    await state.set_state(SelectionState.q4_income)
    lang = get_user_language(message.from_user.id)
    await message.answer(
        t("selection_q4", lang=lang),
        reply_markup=get_cancel_only(lang=lang)
    )

# Q4 -> Result
@router.message(SelectionState.q4_income)
async def process_income(message: types.Message, state: FSMContext):
    await state.update_data(income=message.text)
    data = await state.get_data()
    lang = get_user_language(message.from_user.id)
    
    result_text = (
        f"{t('selection_result_title', lang=lang)}\n\n"
        f"{t('selection_goal', lang=lang)}: {data['goal']}\n"
        f"{t('selection_amount', lang=lang)}: {data['amount']} сум\n"
        f"{t('selection_term', lang=lang)}: {data['term']}\n"
        f"{t('selection_income', lang=lang)}: {data['income']} сум\n\n"
        f"{t('selection_offer', lang=lang)}"
    )
    
    await state.clear()
    await message.answer(result_text, parse_mode="Markdown", reply_markup=get_selection_result(lang=lang))
