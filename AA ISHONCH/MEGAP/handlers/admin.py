from aiogram import Router, F, types
from aiogram.filters import Command
from aiogram.types import CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.utils.keyboard import InlineKeyboardBuilder

from config import ADMIN_IDS
from keyboards.admin import get_admin_menu_keyboard, get_status_change_keyboard
from utils.database import (
    get_all_applications,
    get_all_special_orders,
    get_application_by_id,
    get_special_order_by_id,
    update_application_status,
    update_special_order_status,
    get_status_text,
    get_status_emoji,
    get_all_users,
    count_users,
    get_daily_stats,
    get_setting,
    set_setting,
    get_all_settings,
    update_lead_status,
    update_web_order_status,
    get_lead_by_id,
    get_web_order_by_id
)
import asyncio

router = Router()

class AdminCommentState(StatesGroup):
    waiting_comment = State()

class BroadcastState(StatesGroup):
    waiting_message = State()
    confirm_send = State()

class AdminMode(StatesGroup):
    active = State()

def is_admin(user_id: int) -> bool:
    """Check if user is admin"""
    return str(user_id) in [admin_id.strip() for admin_id in ADMIN_IDS if admin_id]

def get_item_details_keyboard(item_type: str, item_id: int) -> InlineKeyboardMarkup:
    """Keyboard with edit status and add comment buttons"""
    builder = InlineKeyboardBuilder()
    
    builder.row(
        InlineKeyboardButton(text="✏️ Изменить статус", callback_data=f"edit_{item_type}_{item_id}")
    )
    builder.row(
        InlineKeyboardButton(text="💬 Добавить комментарий", callback_data=f"comment_{item_type}_{item_id}")
    )
    builder.row(
        InlineKeyboardButton(text="⬅️ Назад", callback_data="admin_menu")
    )
    
    return builder.as_markup()

@router.message(Command("admin"))
async def admin_panel(message: types.Message, state: FSMContext):
    """Admin panel entry point"""
    if not is_admin(message.from_user.id):
        await message.answer("⛔️ У вас нет доступа к админ панели.")
        return
    
    await state.set_state(AdminMode.active)
    
    await message.answer(
        "🔧 **Админ панель активирована**\n\n"
        "Клавиатура скрыта. Для выхода введите /user",
        reply_markup=types.ReplyKeyboardRemove()
    )
    
    await message.answer(
        "Выберите действие:",
        parse_mode="Markdown",
        reply_markup=get_admin_menu_keyboard()
    )

@router.callback_query(F.data == "admin_menu")
async def show_admin_menu(callback: CallbackQuery):
    """Show admin menu"""
    if not is_admin(callback.from_user.id):
        await callback.answer("⛔️ Нет доступа", show_alert=True)
        return
    
    await callback.message.edit_text(
        "🔧 **Админ панель**\n\n"
        "Выберите действие:",
        parse_mode="Markdown",
        reply_markup=get_admin_menu_keyboard()
    )
    await callback.answer()

@router.callback_query(F.data == "admin_new_apps")
async def show_new_applications(callback: CallbackQuery):
    """Show new applications with pending status"""
    if not is_admin(callback.from_user.id):
        await callback.answer("⛔️ Нет доступа", show_alert=True)
        return
    
    applications = get_all_applications(status='pending')
    
    if not applications:
        await callback.message.edit_text(
            "📝 **Новые заявки**\n\n"
            "Нет новых заявок.",
            parse_mode="Markdown",
            reply_markup=get_admin_menu_keyboard()
        )
        await callback.answer()
        return
    
    # Show first application
    app = applications[0]
    admin_comment_text = f"\n📝 Комментарий админа: {app['admin_comment']}" if app.get('admin_comment') else ""
    
    msg = (
        f"📝 **Заявка #{app['id']}**\n\n"
        f"👤 Клиент: {app['name']}\n"
        f"📞 Телефон: {app['phone']}\n"
        f"📋 Услуга: {app['service_type']}\n"
        f"🎯 Желает: {app['desired_item']}\n"
        f"💬 Комментарий: {app['comment']}\n"
        f"🔗 Юзер: {app['username']}\n"
        f"📅 Дата: {app['created_at']}\n"
        f"📊 Статус: {get_status_emoji(app['status'])} {get_status_text(app['status'])}"
        f"{admin_comment_text}\n\n"
        f"Всего новых заявок: {len(applications)}"
    )
    
    await callback.message.edit_text(
        msg,
        parse_mode="Markdown",
        reply_markup=get_status_change_keyboard('app', app['id'])
    )
    await callback.answer()

@router.callback_query(F.data == "admin_new_orders")
async def show_new_orders(callback: CallbackQuery):
    """Show new special orders with pending status"""
    if not is_admin(callback.from_user.id):
        await callback.answer("⛔️ Нет доступа", show_alert=True)
        return
    
    orders = get_all_special_orders(status='pending')
    
    if not orders:
        await callback.message.edit_text(
            "🛍 **Новые спецзаказы**\n\n"
            "Нет новых спецзаказов.",
            parse_mode="Markdown",
            reply_markup=get_admin_menu_keyboard()
        )
        await callback.answer()
        return
    
    # Show first order
    order = orders[0]
    admin_comment_text = f"\n📝 Комментарий админа: {order['admin_comment']}" if order.get('admin_comment') else ""
    
    msg = (
        f"🛍 **Спецзаказ #{order['id']}**\n\n"
        f"👤 Клиент: {order['name']}\n"
        f"📞 Телефон: {order['phone']}\n"
        f"🛒 Товар: {order['product_name']}\n"
        f"📍 Регион: {order['region']}\n"
        f"🏢 Филиал: {order['branch']}\n"
        f"🔗 Юзер: {order['username']}\n"
        f"📅 Дата: {order['created_at']}\n"
        f"📊 Статус: {get_status_emoji(order['status'])} {get_status_text(order['status'])}"
        f"{admin_comment_text}\n\n"
        f"Всего новых заказов: {len(orders)}"
    )
    
    await callback.message.edit_text(
        msg,
        parse_mode="Markdown",
        reply_markup=get_status_change_keyboard('order', order['id'])
    )
    await callback.answer()

@router.callback_query(F.data.startswith("status_"))
async def change_status(callback: CallbackQuery):
    """Handle status change"""
    if not is_admin(callback.from_user.id):
        await callback.answer("⛔️ Нет доступа", show_alert=True)
        return
    
    # Parse callback data: status_{type}_{id}_{new_status}
    parts = callback.data.split('_')
    item_type = parts[1]  # 'app' or 'order'
    item_id = int(parts[2])
    new_status = parts[3]
    
    # Update status
    if item_type == 'app':
        success = update_application_status(item_id, new_status)
        item = get_application_by_id(item_id)
        item_name = "заявки"
    else:
        success = update_special_order_status(item_id, new_status)
        item = get_special_order_by_id(item_id)
        item_name = "заказа"
    
    if not success or not item:
        await callback.answer("❌ Ошибка при обновлении статуса", show_alert=True)
        return
    
    # Notify client
    status_emoji = get_status_emoji(new_status)
    status_text = get_status_text(new_status)
    
    if item_type == 'app':
        client_msg = (
            f"{status_emoji} **Обновление статуса заявки #{item_id}**\n\n"
            f"Ваша заявка на услугу '{item['service_type']}' получила новый статус:\n"
            f"**{status_text}**\n\n"
            "Проверьте раздел '📋 Мои заявки' для подробностей."
        )
    else:
        client_msg = (
            f"{status_emoji} **Обновление статуса заказа #{item_id}**\n\n"
            f"Ваш спецзаказ '{item['product_name']}' получил новый статус:\n"
            f"**{status_text}**\n\n"
            "Проверьте раздел '📋 Мои заявки' для подробностей."
        )
    
    try:
        await callback.bot.send_message(
            chat_id=item['user_id'],
            text=client_msg,
            parse_mode="Markdown"
        )
    except Exception as e:
        print(f"Failed to notify client {item['user_id']}: {e}")
    
    # Confirm to admin and show details with edit options
    await callback.answer(f"✅ Статус {item_name} обновлен на '{status_text}'", show_alert=True)
    
    # Show item details with edit buttons
    admin_comment_text = f"\n📝 Комментарий админа: {item['admin_comment']}" if item.get('admin_comment') else ""
    
    if item_type == 'app':
        details_msg = (
            f"✅ **Заявка #{item_id}** обновлена\n\n"
            f"👤 Клиент: {item['name']}\n"
            f"📞 Телефон: {item['phone']}\n"
            f"📋 Услуга: {item['service_type']}\n"
            f"🎯 Желает: {item['desired_item']}\n"
            f"📊 Статус: {status_emoji} **{status_text}**"
            f"{admin_comment_text}"
        )
    else:
        details_msg = (
            f"✅ **Заказ #{item_id}** обновлен\n\n"
            f"👤 Клиент: {item['name']}\n"
            f"📞 Телефон: {item['phone']}\n"
            f"🛒 Товар: {item['product_name']}\n"
            f"📊 Статус: {status_emoji} **{status_text}**"
            f"{admin_comment_text}"
        )
    
    await callback.message.edit_text(
        details_msg,
        parse_mode="Markdown",
        reply_markup=get_item_details_keyboard(item_type, item_id)
    )

@router.callback_query(F.data.startswith("edit_"))
async def edit_status(callback: CallbackQuery):
    """Show status change keyboard again"""
    if not is_admin(callback.from_user.id):
        await callback.answer("⛔️ Нет доступа", show_alert=True)
        return
    
    # Parse: edit_{type}_{id}
    parts = callback.data.split('_')
    item_type = parts[1]
    item_id = int(parts[2])
    
    # Get item
    if item_type == 'app':
        item = get_application_by_id(item_id)
    else:
        item = get_special_order_by_id(item_id)
    
    if not item:
        await callback.answer("❌ Заявка не найдена", show_alert=True)
        return
    
    await callback.message.edit_reply_markup(
        reply_markup=get_status_change_keyboard(item_type, item_id)
    )
    await callback.answer("Выберите новый статус")

@router.callback_query(F.data.startswith("comment_"))
async def request_comment(callback: CallbackQuery, state: FSMContext):
    """Request admin comment"""
    if not is_admin(callback.from_user.id):
        await callback.answer("⛔️ Нет доступа", show_alert=True)
        return
    
    # Parse: comment_{type}_{id}
    parts = callback.data.split('_')
    item_type = parts[1]
    item_id = int(parts[2])
    
    # Save to state
    await state.update_data(item_type=item_type, item_id=item_id)
    await state.set_state(AdminCommentState.waiting_comment)
    
    await callback.message.answer(
        "💬 **Добавление комментария**\n\n"
        "Введите комментарий для этой заявки:"
    )
    await callback.answer()

@router.message(AdminCommentState.waiting_comment)
async def save_comment(message: types.Message, state: FSMContext):
    """Save admin comment"""
    if not is_admin(message.from_user.id):
        await message.answer("⛔️ У вас нет доступа к админ панели.")
        await state.clear()
        return
    
    data = await state.get_data()
    item_type = data['item_type']
    item_id = data['item_id']
    comment = message.text
    
    # Get current item
    if item_type == 'app':
        item = get_application_by_id(item_id)
        success = update_application_status(item_id, item['status'], comment)
    else:
        item = get_special_order_by_id(item_id)
        success = update_special_order_status(item_id, item['status'], comment)
    
    if success:
        await message.answer(
            f"✅ Комментарий добавлен к {'заявке' if item_type == 'app' else 'заказу'} #{item_id}",
            reply_markup=get_admin_menu_keyboard()
        )
    else:
        await message.answer("❌ Ошибка при сохранении комментария")
    
    await state.clear()

@router.callback_query(F.data == "admin_all_apps")
async def show_all_applications(callback: CallbackQuery):
    """Show all applications"""
    if not is_admin(callback.from_user.id):
        await callback.answer("⛔️ Нет доступа", show_alert=True)
        return
    
    applications = get_all_applications()
    orders = get_all_special_orders()
    
    msg_lines = ["📊 **Все заявки**\n"]
    msg_lines.append(f"Всего заявок: {len(applications)}")
    msg_lines.append(f"Всего спецзаказов: {len(orders)}\n")
    
    # Count by status
    status_counts = {}
    for app in applications:
        status = app['status']
        status_counts[status] = status_counts.get(status, 0) + 1
    
    for order in orders:
        status = order['status']
        status_counts[status] = status_counts.get(status, 0) + 1
    
    msg_lines.append("**По статусам:**")
    for status, count in status_counts.items():
        emoji = get_status_emoji(status)
        text = get_status_text(status)
        msg_lines.append(f"{emoji} {text}: {count}")
    
    await callback.message.edit_text(
        "\n".join(msg_lines),
        parse_mode="Markdown",
        reply_markup=get_admin_menu_keyboard()
    )
    await callback.answer()

# ============= BROADCAST =============

from keyboards.admin import get_broadcast_confirm_keyboard

@router.callback_query(F.data == "admin_broadcast")
async def start_broadcast(callback: CallbackQuery, state: FSMContext):
    """Start broadcast flow"""
    if not is_admin(callback.from_user.id):
        await callback.answer("⛔️ Нет доступа", show_alert=True)
        return
    
    total_users = count_users()
    
    await callback.message.edit_text(
        f"📢 **Рассылка сообщений**\n\n"
        f"Всего пользователей в базе: {total_users}\n\n"
        f"Отправьте сообщение (текст, фото или видео), которое хотите разослать всем пользователям.\n"
        f"Или нажмите /cancel для отмены."
    )
    await state.set_state(BroadcastState.waiting_message)
    await callback.answer()

@router.message(BroadcastState.waiting_message)
async def receive_broadcast_message(message: types.Message, state: FSMContext):
    """Receive message content for broadcast"""
    if not is_admin(message.from_user.id):
        return

    # Check content type
    if not (message.text or message.photo or message.video or message.caption):
        await message.answer("❌ Поддерживается только текст, фото или видео.")
        return

    # Save message ID and chat ID to copy later
    await state.update_data(
        message_id=message.message_id,
        chat_id=message.chat.id
    )
    
    # Send preview
    await message.answer("👁 **Предпросмотр сообщения:**")
    await message.copy_to(chat_id=message.chat.id)
    
    await message.answer(
        "Вы уверены, что хотите отправить это сообщение всем пользователям?",
        reply_markup=get_broadcast_confirm_keyboard()
    )
    await state.set_state(BroadcastState.confirm_send)

@router.callback_query(F.data == "broadcast_cancel", BroadcastState.confirm_send)
async def cancel_broadcast(callback: CallbackQuery, state: FSMContext):
    """Cancel broadcast"""
    await state.clear()
    await callback.message.edit_text(
        "❌ Рассылка отменена.",
        reply_markup=get_admin_menu_keyboard()
    )
    await callback.answer()

@router.callback_query(F.data == "broadcast_confirm", BroadcastState.confirm_send)
async def execute_broadcast(callback: CallbackQuery, state: FSMContext):
    """Execute broadcast"""
    data = await state.get_data()
    message_id = data['message_id']
    from_chat_id = data['chat_id']
    
    users = get_all_users()
    total = len(users)
    
    await callback.message.edit_text(
        f"🚀 Начинаю рассылку для {total} пользователей...",
        reply_markup=None
    )
    
    success_count = 0
    fail_count = 0
    
    # Broadcast loop
    for user_id in users:
        try:
            await callback.bot.copy_message(
                chat_id=user_id,
                from_chat_id=from_chat_id,
                message_id=message_id
            )
            success_count += 1
            await asyncio.sleep(0.05)  # Avoid hitting limits (20 msg/sec)
        except Exception as e:
            fail_count += 1
            print(f"Failed to send to {user_id}: {e}")
    
    await callback.message.answer(
        f"✅ **Рассылка завершена!**\n\n"
        f"📤 Всего отправлено: {success_count}\n"
        f"❌ Ошибок: {fail_count}",
        reply_markup=get_admin_menu_keyboard()
    )
    
    await state.clear()
    await callback.answer()

@router.callback_query(F.data == "admin_stats")
async def show_statistics(callback: CallbackQuery):
    """Show detailed statistics"""
    if not is_admin(callback.from_user.id):
        await callback.answer("⛔️ Нет доступа", show_alert=True)
        return
    
    stats = get_daily_stats()
    
    msg = (
        "📊 **Статистика магазина**\n\n"
        "👥 **Пользователи:**\n"
        f"• Всего: {stats['users_total']}\n"
        f"• Новых сегодня: +{stats['users_today']}\n\n"
        "📝 **Заявки (бот):**\n"
        f"• Всего: {stats['apps_total']}\n"
        f"• Новых сегодня: +{stats['apps_today']}\n\n"
        "🛍 **Спецзаказы (бот):**\n"
        f"• Всего: {stats['orders_total']}\n"
        f"• Новых сегодня: +{stats['orders_today']}\n\n"
        "📩 **Лиды (сайт):**\n"
        f"• Всего: {stats['leads_total']}\n"
        f"• Новых сегодня: +{stats['leads_today']}\n\n"
        "🛒 **Заказы (сайт):**\n"
        f"• Всего: {stats['web_orders_total']}\n"
        f"• Новых сегодня: +{stats['web_orders_today']}"
    )
    
    await callback.message.edit_text(
        msg,
        parse_mode="Markdown",
        reply_markup=get_admin_menu_keyboard()
    )
    await callback.answer()

# ============= SETTINGS =============

from keyboards.admin import get_settings_keyboard

@router.callback_query(F.data == "admin_settings")
async def show_settings(callback: CallbackQuery):
    """Show settings menu"""
    if not is_admin(callback.from_user.id):
        await callback.answer("⛔️ Нет доступа", show_alert=True)
        return
    
    settings = get_all_settings()
    
    await callback.message.edit_text(
        "⚙️ **Настройки бота**\n\n"
        "Управление разделами и режимом технических работ.\n"
        "✅ - включено\n"
        "❌ - выключено\n\n"
        "⚠️ **Внимание:** Включение режима технических работ заблокирует доступ пользователям!",
        parse_mode="Markdown",
        reply_markup=get_settings_keyboard(settings)
    )
    await callback.answer()

@router.callback_query(F.data.startswith("toggle_"))
async def toggle_setting(callback: CallbackQuery):
    """Toggle a setting"""
    if not is_admin(callback.from_user.id):
        await callback.answer("⛔️ Нет доступа", show_alert=True)
        return
    
    # Format: toggle_{key}
    key = callback.data.split('_', 1)[1]
    
    # Get current value (default 0 or 1)
    current_value = get_setting(key)
    
    # Toggle 0 -> 1, 1 -> 0
    new_value = '1' if current_value == '0' else '0'
    set_setting(key, new_value)
    
    # Get updated settings to refresh keyboard
    settings = get_all_settings()
    
    await callback.message.edit_reply_markup(
        reply_markup=get_settings_keyboard(settings)
    )
    
    # Feedback
    status_text = "включен" if new_value == '1' else "выключен"
    label = key.replace('enable_', '').replace('_', ' ').capitalize()
    if key == 'maintenance_mode':
        label = "Режим тех. работ"
        
    await callback.answer(f"✅ {label} {status_text}")

# ============= USER MODE SWITCH =============

from keyboards.main_menu import get_main_menu

@router.message(Command("user"))
async def exit_admin_mode(message: types.Message, state: FSMContext):
    """Exit admin mode"""
    await state.clear()
    await message.answer(
        "✅ Вы вышли из админ-панели.\nВозвращаю клавиатуру пользователя.",
        reply_markup=get_main_menu()
    )

@router.message(AdminMode.active)
async def block_user_commands(message: types.Message):
    """Block all other messages in admin mode"""
    await message.answer(
        "⚠️ **Режим администратора активен**\n\n"
        "Команды бота недоступны. Используйте админ-панель сверху.\n"
        "Для выхода и возврата к обычному режиму введите /user"
    )


# ============= CRM GROUP CALLBACKS =============

STATUS_LABELS = {
    'accept': ('accepted', '✅ Qabul qilindi'),
    'called': ('processing', '📞 Qo\'ng\'iroq qilindi'),
    'reject': ('rejected', '❌ Rad etildi'),
    'done': ('completed', '✅ Hal qilindi'),
    'spam': ('rejected', '🚫 Spam'),
}

@router.callback_query(F.data.startswith("crm_"))
async def handle_crm_callback(callback: CallbackQuery):
    """Handle CRM inline buttons from group chats"""
    data = callback.data  # e.g. crm_app_accept_42, crm_lead_called_5
    parts = data.split('_')  # ['crm', 'app', 'accept', '42']
    
    if len(parts) < 4:
        await callback.answer("❌ Noto'g'ri ma'lumot")
        return
    
    entity_type = parts[1]   # app, sorder, lead, order
    action = parts[2]        # accept, called, reject, done, spam
    item_id = int(parts[3])
    
    status_info = STATUS_LABELS.get(action)
    if not status_info:
        await callback.answer("❌ Noma'lum amal")
        return
    
    new_status, label = status_info
    admin_name = callback.from_user.full_name or callback.from_user.username or "Admin"
    
    success = False
    if entity_type == 'app':
        success = update_application_status(item_id, new_status)
    elif entity_type == 'sorder':
        success = update_special_order_status(item_id, new_status)
    elif entity_type == 'lead':
        success = update_lead_status(item_id, new_status)
    elif entity_type == 'order':
        success = update_web_order_status(item_id, new_status)
    
    if not success:
        await callback.answer("❌ Yangilashda xatolik", show_alert=True)
        return
    
    # Update the group message: append status line, remove buttons
    old_text = callback.message.text or ""
    updated_text = old_text + f"\n\n{label} — {admin_name}"
    
    try:
        await callback.message.edit_text(updated_text, parse_mode="Markdown")
    except Exception:
        try:
            await callback.message.edit_text(updated_text)
        except Exception as e:
            print(f"Failed to edit CRM message: {e}")
    
    await callback.answer(f"{label}")
