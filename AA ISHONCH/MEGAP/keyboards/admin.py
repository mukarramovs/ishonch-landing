from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils.keyboard import InlineKeyboardBuilder

def get_status_change_keyboard(item_type: str, item_id: int) -> InlineKeyboardMarkup:
    """
    Create inline keyboard for changing application/order status
    item_type: 'app' for application, 'order' for special order
    """
    builder = InlineKeyboardBuilder()
    
    builder.row(
        InlineKeyboardButton(text="✅ Принять", callback_data=f"status_{item_type}_{item_id}_accepted")
    )
    builder.row(
        InlineKeyboardButton(text="⚙️ В обработку", callback_data=f"status_{item_type}_{item_id}_processing")
    )
    builder.row(
        InlineKeyboardButton(text="✔️ Завершить", callback_data=f"status_{item_type}_{item_id}_completed")
    )
    builder.row(
        InlineKeyboardButton(text="❌ Отклонить", callback_data=f"status_{item_type}_{item_id}_rejected")
    )
    
    return builder.as_markup()

def get_admin_menu_keyboard() -> InlineKeyboardMarkup:
    """Main admin menu"""
    builder = InlineKeyboardBuilder()
    
    builder.row(
        InlineKeyboardButton(text="📝 Новые заявки", callback_data="admin_new_apps")
    )
    builder.row(
        InlineKeyboardButton(text="🛍 Новые спецзаказы", callback_data="admin_new_orders")
    )
    builder.row(
        InlineKeyboardButton(text="📊 Все заявки", callback_data="admin_all_apps")
    )
    builder.row(
        InlineKeyboardButton(text="📢 Рассылка", callback_data="admin_broadcast")
    )
    builder.row(
        InlineKeyboardButton(text="📈 Статистика", callback_data="admin_stats")
    )
    
    builder.row(
        InlineKeyboardButton(text="⚙️ Настройки бота", callback_data="admin_settings")
    )
    
    return builder.as_markup()

def get_settings_keyboard(settings: dict) -> InlineKeyboardMarkup:
    """Settings menu with toggles"""
    builder = InlineKeyboardBuilder()
    
    # Mapping settings to emoji and text
    toggles = [
        ('maintenance_mode', '🔧 Технические работы'),
        ('enable_installment', '💳 Рассрочка'),
        ('enable_special_orders', '🛍 Спецзаказ'),
        ('enable_branches', '📍 Филиалы'),
        ('enable_application', '📝 Оставить заявку'),
        ('enable_credits', '💳 Кредиты'),
        ('enable_product_loan', '🛒 Кредит на товар'),
        ('enable_payment', '💳 Оплата')
    ]
    
    for key, label in toggles:
        is_on = settings.get(key, '0') == '1'
        status_emoji = "✅" if is_on else "❌"
        builder.row(
            InlineKeyboardButton(
                text=f"{label}: {status_emoji}", 
                callback_data=f"toggle_{key}"
            )
        )
        
    builder.row(
        InlineKeyboardButton(text="⬅️ Назад", callback_data="admin_menu")
    )
    
    return builder.as_markup()

def get_broadcast_confirm_keyboard() -> InlineKeyboardMarkup:
    """Confirm broadcast sending"""
    builder = InlineKeyboardBuilder()
    
    builder.row(
        InlineKeyboardButton(text="✅ Отправить", callback_data="broadcast_confirm"),
        InlineKeyboardButton(text="❌ Отмена", callback_data="broadcast_cancel")
    )
    
    return builder.as_markup()
