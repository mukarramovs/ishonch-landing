from aiogram import Router, F, types
from aiogram.fsm.context import FSMContext
from keyboards.main_menu import get_main_menu
from utils.text import t, get_all_texts, get_text

router = Router()

# Global "Main Menu" handler
@router.message(F.text.in_(get_all_texts("main_menu")))
async def cmd_main_menu(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(
        t("main_menu_response", user_id=message.from_user.id), # Need to add this key
        reply_markup=get_main_menu(message.from_user.id)
    )












