from aiogram import Router, F, types
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from utils.branches_loader import load_branches
from keyboards.branches import (
    get_viloyats_keyboard, 
    get_branches_keyboard, 
    get_branch_actions,
    get_branch_reply_nav
)
from keyboards.main_menu import get_main_menu
from utils.text import t, get_all_texts
from utils.database import get_setting, get_user_language

router = Router()

# Load data once (or reload periodically)
BRANCHES_DATA = load_branches()

class BranchStates(StatesGroup):
    region_select = State()
    branch_select = State()
    view_card = State()

# Entry point
@router.message(F.text.in_(get_all_texts("menu_branches")))
async def show_viloyats(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    if get_setting('enable_branches') == '0':
        await message.answer(t("section_disabled", user_id=user_id))
        return
        
    # Reload data to ensure freshness if needed, or use cached
    global BRANCHES_DATA
    BRANCHES_DATA = load_branches() # Reloading just in case
    
    viloyats = list(BRANCHES_DATA.keys())
    
    if not viloyats:
        await message.answer(t("branch_list_unavailable", user_id=user_id))
        return

    await state.set_state(BranchStates.region_select)
    lang = get_user_language(user_id)
    await message.answer(
        t("branch_region_select", lang=lang),
        parse_mode="Markdown",
        reply_markup=get_viloyats_keyboard(viloyats, lang=lang)
    )

@router.message(BranchStates.region_select, F.text.in_(get_all_texts("back")))
async def back_to_main(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(t("main_menu_response", user_id=message.from_user.id), reply_markup=get_main_menu(message.from_user.id))

@router.message(BranchStates.region_select)
async def show_branches(message: types.Message, state: FSMContext):
    # Fallback if text is not a region? Or handle regions dynamically.
    # Filters in decorator are hard with dynamic list that changes.
    # Better to check if message.text is in viloyats inside handler.
    region = message.text
    # Check if back or main menu - already handled by other routers? No, state filters catch them first.
    # Filters order matters. If "back" filter matches, it executes. 
    # But viloyats are dynamic.
    
    if region in get_all_texts("main_menu"):
         await state.clear()
         await message.answer(t("main_menu_response", user_id=message.from_user.id), reply_markup=get_main_menu(message.from_user.id))
         return

    if region not in BRANCHES_DATA:
         # Maybe user typed something wrong or we haven't handled "back" correctly?
         # "back" is handled by separate handler above.
         # So this must be an invalid region selection.
         return
    
    branches = BRANCHES_DATA.get(region, [])
    user_id = message.from_user.id
    lang = get_user_language(user_id)
    
    if not branches:
        await message.answer(t("branch_no_branches", lang=lang))
        return
        
    await state.update_data(selected_region=region)
    await state.set_state(BranchStates.branch_select)
    
    await message.answer(
        f"{t('branch_select_title', lang=lang)} **{region}**:",
        parse_mode="Markdown",
        reply_markup=get_branches_keyboard(branches, lang=lang)
    )

@router.message(BranchStates.branch_select, F.text.in_(get_all_texts("branch_back_to_regions")))
async def back_to_regions(message: types.Message, state: FSMContext):
    # Re-show regions
    viloyats = list(BRANCHES_DATA.keys())
    await state.set_state(BranchStates.region_select)
    lang = get_user_language(message.from_user.id)
    await message.answer(t("branch_region_select", lang=lang), reply_markup=get_viloyats_keyboard(viloyats, lang=lang))

@router.message(BranchStates.branch_select)
async def show_branch_card(message: types.Message, state: FSMContext):
    if message.text in get_all_texts("main_menu"):
        await state.clear()
        await message.answer(t("main_menu_response", user_id=message.from_user.id), reply_markup=get_main_menu(message.from_user.id))
        return

    data = await state.get_data()
    region = data.get("selected_region")
    branches = BRANCHES_DATA.get(region, [])
    
    # Find branch by name
    selected_branch = next((b for b in branches if b['name'] == message.text), None)
    
    user_id = message.from_user.id
    lang = get_user_language(user_id)
    
    if not selected_branch:
        await message.answer(t("branch_not_found", lang=lang))
        return
        
    await state.set_state(BranchStates.view_card)
    await state.update_data(selected_branch=selected_branch['name'])
    
    # Prepare card text
    landmark_text = f"\n\n{t('branch_landmark', lang=lang)}:\n{selected_branch['landmark']}" if selected_branch['landmark'] else ""
    
    card_text = (
        f"🏢 **{selected_branch['name']}**\n\n"
        f"{t('branch_address', lang=lang)}:\n{selected_branch['address']}"
        f"{landmark_text}\n\n"
        f"{t('branch_info_disclaimer', lang=lang)}"
    )
    
    # Send text with Inline Actions (Map, Apply, Manager)
    # AND Reply Navigation (Back to list)
    
    await message.answer(
        card_text, 
        parse_mode="Markdown", 
        reply_markup=get_branch_actions(selected_branch['map_url'], lang=lang)
    )
    
    await message.answer(
        t("branch_nav_hint", lang=lang),
        reply_markup=get_branch_reply_nav(lang=lang)
    )

@router.message(BranchStates.view_card, F.text.in_(get_all_texts("branch_back_to_list")))
async def back_from_card(message: types.Message, state: FSMContext):
    data = await state.get_data()
    region = data.get("selected_region")
    branches = BRANCHES_DATA.get(region, [])
    
    lang = get_user_language(message.from_user.id)
    await state.set_state(BranchStates.branch_select)
    await message.answer(
        f"{t('branch_select_title', lang=lang)} **{region}**:",
        reply_markup=get_branches_keyboard(branches, lang=lang)
    )

# Callback handlers for Inline Buttons
@router.callback_query(F.data == "apply_branch")
async def callback_apply(callback: types.CallbackQuery, state: FSMContext):
    await callback.message.answer(t("installment_in_dev", user_id=callback.from_user.id))
    await callback.answer()

@router.callback_query(F.data == "contact_branch")
async def callback_contact(callback: types.CallbackQuery, state: FSMContext):
    await callback.message.answer(t("installment_in_dev", user_id=callback.from_user.id))
    await callback.answer()
