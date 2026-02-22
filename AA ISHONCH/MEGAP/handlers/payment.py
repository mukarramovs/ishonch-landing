from aiogram import Router, F, types
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from keyboards.payments import get_payment_menu
from keyboards.main_menu import get_main_menu
from utils.text import t, get_all_texts
from utils.database import get_setting, get_user_language

router = Router()

class PaymentStates(StatesGroup):
    selecting_method = State()

@router.message(F.text.in_(get_all_texts("menu_payment")))
async def payment_main(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    if get_setting('enable_payment') == '0':
        await message.answer(t("section_disabled", user_id=user_id))
        return
        
    await state.set_state(PaymentStates.selecting_method)
    lang = get_user_language(user_id)
    await message.answer(
        t("payment_intro", lang=lang),
        parse_mode="Markdown",
        reply_markup=get_payment_menu(lang=lang)
    )

@router.message(PaymentStates.selecting_method, F.text.in_(get_all_texts("payment_btn_click")))
async def pay_click(message: types.Message):
    await message.answer(t("payment_click", user_id=message.from_user.id), parse_mode="Markdown")

@router.message(PaymentStates.selecting_method, F.text.in_(get_all_texts("payment_btn_payme")))
async def pay_payme(message: types.Message):
    await message.answer(t("payment_payme", user_id=message.from_user.id), parse_mode="Markdown")

@router.message(PaymentStates.selecting_method, F.text.in_(get_all_texts("payment_btn_plum")))
async def pay_plum(message: types.Message):
    await message.answer(t("payment_plum", user_id=message.from_user.id), parse_mode="Markdown")

@router.message(PaymentStates.selecting_method, F.text.in_(get_all_texts("payment_btn_sellopay")))
async def pay_sellopay(message: types.Message):
    await message.answer(t("payment_sellopay", user_id=message.from_user.id), parse_mode="Markdown")

@router.message(PaymentStates.selecting_method, F.text.in_(get_all_texts("payment_btn_operator")))
async def pay_operator(message: types.Message):
    await message.answer(t("payment_operator", user_id=message.from_user.id), parse_mode="Markdown")

@router.message(PaymentStates.selecting_method, F.text.in_(get_all_texts("back")))
async def back_to_menu(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(t("main_menu_response", user_id=message.from_user.id), reply_markup=get_main_menu(message.from_user.id))

@router.message(PaymentStates.selecting_method, F.text.in_(get_all_texts("main_menu")))
async def main_menu_from_payment(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(t("main_menu_response", user_id=message.from_user.id), reply_markup=get_main_menu(message.from_user.id))
