from aiogram import Router, F, types
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from keyboards.product_loan import get_product_loan_menu
from keyboards.main_menu import get_main_menu
from utils.text import t, get_all_texts
from utils.database import get_setting, get_user_language

router = Router()

class ProductLoanState(StatesGroup):
    info = State()

@router.message(F.text.in_(get_all_texts("menu_product_loan")))
async def product_loan_info(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    if get_setting('enable_product_loan') == '0':
        await message.answer(t("section_disabled", user_id=user_id))
        return
        
    await state.set_state(ProductLoanState.info)
    lang = get_user_language(user_id)
    await message.answer(
        t("product_loan_info", lang=lang),
        parse_mode="Markdown",
        reply_markup=get_product_loan_menu(lang=lang)
    )

@router.message(ProductLoanState.info, F.text.in_(get_all_texts("back")))
async def back_from_product_loan(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(t("main_menu_response", user_id=message.from_user.id), reply_markup=get_main_menu(message.from_user.id))

@router.message(ProductLoanState.info, F.text.in_(get_all_texts("main_menu")))
async def main_menu_from_product_loan(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(t("main_menu_response", user_id=message.from_user.id), reply_markup=get_main_menu(message.from_user.id))

@router.message(ProductLoanState.info, F.text.in_(get_all_texts("product_loan_apply")))
async def apply_for_product_loan(message: types.Message, state: FSMContext):
    await message.answer(t("in_development", user_id=message.from_user.id))
