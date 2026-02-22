from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from aiogram.utils.keyboard import ReplyKeyboardBuilder

from utils.database import get_all_settings, get_user_language
from utils.text import t

def get_main_menu(user_id: int) -> ReplyKeyboardMarkup:
    """
    Get main menu keyboard for a user in their language
    """
    # Fetch current settings
    settings = get_all_settings()
    
    # Get user language
    lang = get_user_language(user_id)
    
    builder = ReplyKeyboardBuilder()
    
    # Row 1
    row1 = []
    if settings.get('enable_credits', '1') == '1':
        row1.append(KeyboardButton(text=t("menu_credits", lang=lang)))
    if settings.get('enable_product_loan', '1') == '1':
        row1.append(KeyboardButton(text=t("menu_product_loan", lang=lang)))
    if row1:
        builder.row(*row1)
        
    # Row 2
    row2 = []
    if settings.get('enable_installment', '1') == '1':
        row2.append(KeyboardButton(text=t("menu_installment", lang=lang)))
    # Always show credit selection or make it configurable? Assuming part of credits
    # Let's keep it visible or bind to enable_credits? 
    # The requirement didn't specify "Credit Selection", but implies sections.
    # Let's keep it visible for now or assume it's part of credits general functionality.
    # Actually, let's treat it as a safe default or bind to enable_credits logic if desired.
    # For now, I'll leave "Подбор кредита" always on or bind to enable_credits for consistency.
    # Let's bind it to enable_credits for better control.
    if settings.get('enable_credits', '1') == '1':
        row2.append(KeyboardButton(text=t("menu_credit_selection", lang=lang)))
    if row2:
        builder.row(*row2)

    # Row 3
    row3 = []
    if settings.get('enable_application', '1') == '1':
        row3.append(KeyboardButton(text=t("menu_leave_application", lang=lang)))
    # "Связь с менеджером" usually always needed
    row3.append(KeyboardButton(text=t("menu_contact_manager", lang=lang)))
    if row3:
        builder.row(*row3)
        
    # Row 4: My applications (always useful unless maintenance)
    builder.row(
        KeyboardButton(text=t("menu_my_applications", lang=lang))
    )
    
    # Row 5
    row5 = []
    if settings.get('enable_branches', '1') == '1':
        row5.append(KeyboardButton(text=t("menu_branches", lang=lang)))
    if settings.get('enable_special_orders', '1') == '1':
        row5.append(KeyboardButton(text=t("menu_special_order", lang=lang)))
    if row5:
        builder.row(*row5)
        
    # Row 6
    row6 = []
    row6.append(KeyboardButton(text=t("menu_terms", lang=lang)))
    if settings.get('enable_payment', '1') == '1':
        row6.append(KeyboardButton(text=t("menu_payment", lang=lang)))
    if row6:
        builder.row(*row6)
    
    return builder.as_markup(resize_keyboard=True)
