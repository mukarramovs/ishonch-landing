from aiogram import Router, F, types
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from keyboards.application import (
    get_service_types,
    get_agreement_keyboard,
    get_confirmation_keyboard,
    get_cancel_only
)
from keyboards.main_menu import get_main_menu
from utils.database import save_application
from config import ADMIN_IDS, GROUP_ORDERS

router = Router()

class ApplicationState(StatesGroup):
    name = State()
    phone = State()
    service = State()
    desired_item = State()  # NEW: What the client wants
    comment = State()
    agreement = State()
    confirm = State()

# Triggers for Application Form
TRIGGER_TEXTS = {
    "📝 Оставить заявку", 
    "📝 Оформить", 
    "📝 Оформить рассрочку",
    "📞 Заказать звонок"
}

from utils.database import get_setting

@router.message(F.text.in_(TRIGGER_TEXTS))
async def start_application(message: types.Message, state: FSMContext):
    if get_setting('enable_application') == '0':
        await message.answer("⛔️ Прием заявок временно приостановлен.")
        return
        
    await state.set_state(ApplicationState.name)
    await message.answer(
        "📝 *Заявка на кредит*\n\n"
        "Пожалуйста, введите ваше **Имя**:",
        parse_mode="Markdown",
        reply_markup=get_cancel_only()
    )

# Cancellation is handled globally or we iterate here.
# Since we are in a state, we can catch "Main Menu" or "Cancel" specifically.

@router.message(ApplicationState.name, F.text.in_({"❌ Отмена", "❌ Отменить", "🏠 Главное меню"}))
@router.message(ApplicationState.phone, F.text.in_({"❌ Отмена", "❌ Отменить", "🏠 Главное меню"}))
@router.message(ApplicationState.service, F.text.in_({"❌ Отмена", "❌ Отменить", "🏠 Главное меню"}))
@router.message(ApplicationState.desired_item, F.text.in_({"❌ Отмена", "❌ Отменить", "🏠 Главное меню"}))
@router.message(ApplicationState.comment, F.text.in_({"❌ Отмена", "❌ Отменить", "🏠 Главное меню"}))
@router.message(ApplicationState.agreement, F.text.in_({"❌ Отмена", "❌ Отменить", "🏠 Главное меню"}))
@router.message(ApplicationState.confirm, F.text.in_({"❌ Отмена", "❌ Отменить", "🏠 Главное меню"}))
async def cancel_application(message: types.Message, state: FSMContext):
    await state.clear()
    await message.answer("❌ Заявка отменена.", reply_markup=get_main_menu(message.from_user.id))

# 1. Name -> Phone
@router.message(ApplicationState.name)
async def process_name(message: types.Message, state: FSMContext):
    if len(message.text) < 2:
        await message.answer("⚠️ Имя слишком короткое. Попробуйте еще раз.")
        return
    
    await state.update_data(name=message.text)
    await state.set_state(ApplicationState.phone)
    
    # Request contact or text? Let's stick to text for simplicity as per diagram "Phone"
    # But usually bots request Contact button. The diagram just says [Phone].
    # I will ask for text format for now.
    await message.answer(
        "📞 Введите ваш **номер телефона**:\n(в формате +998...)",
        parse_mode="Markdown",
        reply_markup=get_cancel_only()
    )

# 2. Phone -> Service
@router.message(ApplicationState.phone)
async def process_phone(message: types.Message, state: FSMContext):
    # Basic validation
    if not any(char.isdigit() for char in message.text):
         await message.answer("⚠️ Пожалуйста, введите корректный номер телефона.")
         return

    await state.update_data(phone=message.text)
    await state.set_state(ApplicationState.service)
    await message.answer(
        "📋 Выберите **интересующую услугу**:",
        parse_mode="Markdown",
        reply_markup=get_service_types()
    )

# 3. Service -> Desired Item
@router.message(ApplicationState.service)
async def process_service(message: types.Message, state: FSMContext):
    await state.update_data(service=message.text)
    await state.set_state(ApplicationState.desired_item)
    await message.answer(
        "🎯 **Что вы желаете получить?**\n"
        "Опишите товар или услугу, которая вас интересует:",
        parse_mode="Markdown",
        reply_markup=get_cancel_only()
    )

# 4. Desired Item -> Comment
@router.message(ApplicationState.desired_item)
async def process_desired_item(message: types.Message, state: FSMContext):
    await state.update_data(desired_item=message.text)
    await state.set_state(ApplicationState.comment)
    await message.answer(
        "💬 Оставьте **комментарий** (необязательно):\n"
        "Напишите 'Нет' или что угодно, если нет комментариев.",
        parse_mode="Markdown",
        reply_markup=get_cancel_only()
    )

# 5. Comment -> Agreement
@router.message(ApplicationState.comment)
async def process_comment(message: types.Message, state: FSMContext):
    await state.update_data(comment=message.text)
    await state.set_state(ApplicationState.agreement)
    await message.answer(
        "📜 **Согласие на обработку данных**\n\n"
        "Я подтверждаю, что указанные данные верны и даю согласие на их обработку.",
        parse_mode="Markdown",
        reply_markup=get_agreement_keyboard()
    )

# 6. Agreement -> Confirm
@router.message(ApplicationState.agreement, F.text == "✅ Подтверждаю")
async def process_agreement(message: types.Message, state: FSMContext):
    await state.set_state(ApplicationState.confirm)
    
    data = await state.get_data()
    summary = (
        "🔍 **Проверьте данные заявки:**\n\n"
        f"👤 Имя: {data['name']}\n"
        f"📞 Телефон: {data['phone']}\n"
        f"📋 Услуга: {data['service']}\n"
        f"🎯 Желаемое: {data['desired_item']}\n"
        f"💬 Комментарий: {data['comment']}\n"
    )
    
    await message.answer(summary, parse_mode="Markdown", reply_markup=get_confirmation_keyboard())

# 7. Confirm -> Send
@router.message(ApplicationState.confirm, F.text == "✅ Отправить заявку")
async def send_application(message: types.Message, state: FSMContext):
    data = await state.get_data()
    
    # Save to database
    username = f"@{message.from_user.username}" if message.from_user.username else ""
    app_id = save_application(
        user_id=message.from_user.id,
        username=username,
        name=data['name'],
        phone=data['phone'],
        service_type=data['service'],
        desired_item=data['desired_item'],
        comment=data['comment']
    )
    
    # Notify admins via DM
    admin_msg = (
        "🆕 **Новая заявка!**\n\n"
        f"📋 ID заявки: #{app_id}\n"
        f"👤 Клиент: {data['name']}\n"
        f"📞 Тел: {data['phone']}\n"
        f"📋 Услуга: {data['service']}\n"
        f"🎯 Желает: {data['desired_item']}\n"
        f"💬 Комментарий: {data['comment']}\n"
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
        f"🆕 *Yangi zayavka #{app_id}*\n\n"
        f"👤 Mijoz: {data['name']}\n"
        f"📞 Tel: {data['phone']}\n"
        f"📋 Xizmat: {data['service']}\n"
        f"🎯 Xohishi: {data['desired_item']}\n"
        f"💬 Izoh: {data['comment']}\n"
        f"🔗 TG: {username}\n"
        f"🌐 Manba: Telegram bot"
    )
    keyboard = types.InlineKeyboardMarkup(inline_keyboard=[
        [
            types.InlineKeyboardButton(text="✅ Qabul", callback_data=f"crm_app_accept_{app_id}"),
            types.InlineKeyboardButton(text="📞 Qo'ng'iroq", callback_data=f"crm_app_called_{app_id}"),
        ],
        [
            types.InlineKeyboardButton(text="❌ Rad etish", callback_data=f"crm_app_reject_{app_id}"),
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
    await message.answer(
        "✅ **Заявка успешно отправлена!**\n"
        f"Номер вашей заявки: **#{app_id}**\n\n"
        "Наш менеджер свяжется с вами в ближайшее время.\n"
        "Вы можете отслеживать статус в разделе '📋 Мои заявки'.",
        parse_mode="Markdown",
        reply_markup=get_main_menu()
    )

