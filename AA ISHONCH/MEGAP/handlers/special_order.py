from aiogram import Router, F, types
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from config import ADMIN_IDS, GROUP_ORDERS
from utils.branches_loader import load_branches
from utils.database import save_special_order, get_setting, get_user_language
from utils.text import t, get_all_texts
from keyboards.special_order import (
    get_viloyats_keyboard, 
    get_branches_keyboard, 
    get_contact_share_keyboard,
    get_cancel_only
)
from keyboards.main_menu import get_main_menu

router = Router()

class SpecialOrderState(StatesGroup):
    name = State()
    product_name = State()
    phone = State()
    region_select = State()
    branch_select = State()

# Trigger
@router.message(F.text.in_(get_all_texts("menu_special_order")))
async def start_special_order(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    if get_setting('enable_special_orders') == '0':
        await message.answer(t("section_disabled", user_id=user_id))
        return
        
    await state.set_state(SpecialOrderState.name)
    lang = get_user_language(user_id)
    await message.answer(
        t("special_order_start", lang=lang),
        parse_mode="Markdown",
        reply_markup=get_cancel_only(lang=lang)
    )

# Cancel from any special order state
@router.message(SpecialOrderState.name, F.text.in_(get_all_texts("cancel")))
@router.message(SpecialOrderState.product_name, F.text.in_(get_all_texts("cancel")))
@router.message(SpecialOrderState.phone, F.text.in_(get_all_texts("cancel")))
@router.message(SpecialOrderState.region_select, F.text.in_(get_all_texts("cancel")))
@router.message(SpecialOrderState.branch_select, F.text.in_(get_all_texts("cancel")))
async def cancel_order(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer(t("special_order_cancelled", user_id=message.from_user.id), reply_markup=get_main_menu(message.from_user.id))

# 1. Name -> Product Name
@router.message(SpecialOrderState.name)
async def process_name(message: types.Message, state: FSMContext):
    if len(message.text) < 2:
        await message.answer(t("special_order_name_short", user_id=message.from_user.id))
        return
    
    await state.update_data(name=message.text)
    await state.set_state(SpecialOrderState.product_name)
    lang = get_user_language(message.from_user.id)
    await message.answer(
        t("special_order_product_q", lang=lang),
        parse_mode="Markdown",
        reply_markup=get_cancel_only(lang=lang)
    )

# 2. Product Name -> Phone
@router.message(SpecialOrderState.product_name)
async def process_product_name(message: types.Message, state: FSMContext):
    if len(message.text) < 2:
        await message.answer(t("special_order_product_short", user_id=message.from_user.id))
        return
    
    await state.update_data(product_name=message.text)
    await state.set_state(SpecialOrderState.phone)
    lang = get_user_language(message.from_user.id)
    await message.answer(
        t("special_order_phone_q", lang=lang),
        parse_mode="Markdown",
        reply_markup=get_contact_share_keyboard(lang=lang)
    )

# 3. Phone -> Region
@router.message(SpecialOrderState.phone)
async def process_phone(message: types.Message, state: FSMContext):
    phone = message.contact.phone_number if message.contact else message.text
    
    if not message.contact and not any(char.isdigit() for char in phone):
         await message.answer(t("special_order_phone_invalid", user_id=message.from_user.id))
         return

    await state.update_data(phone=phone)
    
    branches_data = load_branches()
    viloyats = list(branches_data.keys())
    lang = get_user_language(message.from_user.id)
    
    if not viloyats:
        await message.answer(t("special_order_branch_load_fail", lang=lang))
        await state.clear()
        return

    await state.set_state(SpecialOrderState.region_select)
    await message.answer(
        t("special_order_region_q", lang=lang),
        parse_mode="Markdown",
        reply_markup=get_viloyats_keyboard(viloyats, lang=lang)
    )

# 4. Region -> Branch
@router.message(SpecialOrderState.region_select)
async def process_region(message: types.Message, state: FSMContext):
    selected_region = message.text
    branches_data = load_branches()
    
    if selected_region not in branches_data:
        await message.answer(t("special_order_region_invalid", user_id=message.from_user.id))
        return
        
    branches = branches_data[selected_region]
    await state.update_data(selected_region=selected_region)
    lang = get_user_language(message.from_user.id)
    
    await state.set_state(SpecialOrderState.branch_select)
    await message.answer(
        f"{t('special_order_branch_q', lang=lang)} {selected_region}:",
        parse_mode="Markdown",
        reply_markup=get_branches_keyboard(branches, lang=lang)
    )

@router.message(SpecialOrderState.branch_select, F.text.in_(get_all_texts("branch_back_to_regions")))
async def back_to_regions(message: types.Message, state: FSMContext):
    branches_data = load_branches()
    viloyats = list(branches_data.keys())
    lang = get_user_language(message.from_user.id)
    await state.set_state(SpecialOrderState.region_select)
    await message.answer(t("special_order_region_q", lang=lang), reply_markup=get_viloyats_keyboard(viloyats, lang=lang))

# 5. Branch -> Finish
@router.message(SpecialOrderState.branch_select)
async def process_branch(message: types.Message, state: FSMContext):
    selected_branch_name = message.text
    
    data = await state.get_data()
    region = data.get("selected_region")
    branches_data = load_branches()
    valid_branches = [b['name'] for b in branches_data.get(region, [])]
    
    if selected_branch_name not in valid_branches:
         await message.answer(t("special_order_branch_invalid", user_id=message.from_user.id))
         return

    # SAVE ORDER TO DATABASE
    username = f"@{message.from_user.username}" if message.from_user.username else ""
    order_id = save_special_order(
        user_id=message.from_user.id,
        username=username,
        name=data['name'],
        phone=data['phone'],
        product_name=data['product_name'],
        region=region,
        branch=selected_branch_name
    )
    
    # NOTIFY ADMINS (admin messages stay in Russian)
    admin_msg = (
        "🆕 **Новый Спецзаказ!**\n\n"
        f"📋 ID заказа: #{order_id}\n"
        f"👤 Клиент: {data['name']}\n"
        f"📞 Тел: {data['phone']}\n"
        f"🛒 Товар: {data['product_name']}\n"
        f"📍 Регион: {region}\n"
        f"🏢 Филиал: {selected_branch_name}\n"
        f"🔗 Юзер: {username}"
    )
    
    for admin_id in ADMIN_IDS:
        if admin_id:
            try:
                await message.bot.send_message(chat_id=admin_id.strip(), text=admin_msg, parse_mode="Markdown")
            except Exception as e:
                print(f"Failed to send to admin {admin_id}: {e}")

    # CRM: Forward to GROUP_ORDERS with inline buttons
    group_msg = (
        f"🛒 *Yangi spets-buyurtma #{order_id}*\n\n"
        f"👤 Mijoz: {data['name']}\n"
        f"📞 Tel: {data['phone']}\n"
        f"🛍 Tovar: {data['product_name']}\n"
        f"📍 Hudud: {region}\n"
        f"🏢 Filial: {selected_branch_name}\n"
        f"🔗 TG: {username}\n"
        f"🌐 Manba: Telegram bot"
    )
    keyboard = types.InlineKeyboardMarkup(inline_keyboard=[
        [
            types.InlineKeyboardButton(text="✅ Qabul", callback_data=f"crm_sorder_accept_{order_id}"),
            types.InlineKeyboardButton(text="📞 Qo'ng'iroq", callback_data=f"crm_sorder_called_{order_id}"),
        ],
        [
            types.InlineKeyboardButton(text="❌ Rad etish", callback_data=f"crm_sorder_reject_{order_id}"),
        ]
    ])
    try:
        await message.bot.send_message(
            chat_id=GROUP_ORDERS, text=group_msg,
            parse_mode="Markdown", reply_markup=keyboard
        )
    except Exception as e:
        print(f"Failed to send to GROUP_ORDERS: {e}")

    await state.clear()
    lang = get_user_language(message.from_user.id)
    order_num_text = f"Номер вашего заказа: **#{order_id}**\n\n" if lang == 'ru' else f"Buyırtpa nomerińiz: **#{order_id}**\n\n"
    
    await message.answer(
        f"{t('special_order_success', lang=lang)}\n\n{order_num_text}",
        parse_mode="Markdown",
        reply_markup=get_main_menu(message.from_user.id)
    )
