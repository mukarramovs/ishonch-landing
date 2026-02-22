from aiogram import Router, F, types
from aiogram.fsm.context import FSMContext

from keyboards.my_applications import get_my_applications_menu
from keyboards.main_menu import get_main_menu
from utils.database import (
    get_user_applications, 
    get_user_special_orders,
    get_status_emoji,
    get_status_text,
    get_user_language
)
from utils.text import t, get_all_texts

router = Router()

@router.message(F.text.in_(get_all_texts("menu_my_applications")))
async def show_my_applications(message: types.Message, state: FSMContext):
    """Show all user's applications and special orders"""
    user_id = message.from_user.id
    lang = get_user_language(user_id)
    
    applications = get_user_applications(user_id)
    special_orders = get_user_special_orders(user_id)
    
    if not applications and not special_orders:
        await message.answer(
            t("my_apps_empty", lang=lang),
            parse_mode="Markdown",
            reply_markup=get_main_menu(user_id)
        )
        return
    
    msg_lines = [f"{t('my_apps_title', lang=lang)}\n"]
    
    total_count = len(applications) + len(special_orders)
    msg_lines.append(t("my_apps_count", lang=lang).format(count=total_count) + "\n")
    
    if applications:
        msg_lines.append(f"{t('my_apps_regular', lang=lang)}\n")
        for app in applications:
            status_emoji = get_status_emoji(app['status'])
            status_text = get_status_text(app['status'])
            created_date = app['created_at'].split()[0] if ' ' in app['created_at'] else app['created_at']
            
            msg_lines.append(
                f"{status_emoji} **#{app['id']}** ({created_date})\n"
                f"   {t('my_apps_service', lang=lang)}: {app['service_type']}\n"
                f"   {t('my_apps_desired', lang=lang)}: {app['desired_item']}\n"
                f"   {t('my_apps_status', lang=lang)}: {status_text}\n"
            )
    
    if special_orders:
        msg_lines.append(f"\n{t('my_apps_special', lang=lang)}\n")
        for order in special_orders:
            status_emoji = get_status_emoji(order['status'])
            status_text = get_status_text(order['status'])
            created_date = order['created_at'].split()[0] if ' ' in order['created_at'] else order['created_at']
            
            msg_lines.append(
                f"{status_emoji} **#{order['id']}** ({created_date})\n"
                f"   {t('my_apps_product', lang=lang)}: {order['product_name']}\n"
                f"   {t('my_apps_branch', lang=lang)}: {order['branch']}\n"
                f"   {t('my_apps_status', lang=lang)}: {status_text}\n"
            )
    
    msg_lines.append(f"\n{t('my_apps_hint', lang=lang)}")
    
    await message.answer(
        "\n".join(msg_lines),
        parse_mode="Markdown",
        reply_markup=get_my_applications_menu(lang=lang)
    )

@router.message(F.text.in_(get_all_texts("my_apps_refresh")))
async def refresh_applications(message: types.Message, state: FSMContext):
    """Refresh the applications list"""
    await show_my_applications(message, state)

@router.message(F.text.in_(get_all_texts("my_apps_back")))
async def back_to_main_menu(message: types.Message, state: FSMContext):
    """Return to main menu"""
    await state.clear()
    await message.answer(
        t("main_menu_response", user_id=message.from_user.id),
        reply_markup=get_main_menu(message.from_user.id)
    )
