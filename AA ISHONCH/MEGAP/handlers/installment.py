from aiogram import Router, F, types
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from keyboards.installment import get_installment_menu
from keyboards.main_menu import get_main_menu
from utils.text import t, get_all_texts
from utils.database import get_setting, get_user_language

router = Router()

class InstallmentState(StatesGroup):
    info = State()

@router.message(F.text.in_(get_all_texts("menu_installment")))
async def installment_info(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    if get_setting('enable_installment') == '0':
        await message.answer(t("section_disabled", user_id=user_id))
        return
        
    await state.set_state(InstallmentState.info)
    lang = get_user_language(user_id)
    await message.answer(
        t("installment_info_text", lang=lang), # optimization: use lang directly
        parse_mode="Markdown",
        reply_markup=get_installment_menu(lang=lang)
    )

@router.message(InstallmentState.info, F.text.in_(get_all_texts("back")))
async def back_from_installment(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(t("main_menu_response", user_id=message.from_user.id), reply_markup=get_main_menu(message.from_user.id))

@router.message(InstallmentState.info, F.text.in_(get_all_texts("apply_installment")))
async def apply_for_installment(message: types.Message, state: FSMContext):
    await message.answer(t("installment_in_dev", user_id=message.from_user.id))
