from locales import ru, uz, kaa
from utils.database import get_user_language

# Language codes
LANG_RU = 'ru'
LANG_UZ = 'uz'
LANG_KAA = 'kaa'

# Available languages
AVAILABLE_LANGUAGES = {
    LANG_RU: "🇷🇺 Русский",
    LANG_UZ: "🇺🇿 O'zbekcha",
    LANG_KAA: "🇺🇿 Qaraqalpaqsha (QR)"
}

# Translation dictionaries
TRANSLATIONS = {
    LANG_RU: ru.TEXTS,
    LANG_UZ: uz.TEXTS,
    LANG_KAA: kaa.TEXTS
}

def get_text(key: str, user_id: int = None, lang: str = None) -> str:
    """
    Get translated text for a key.
    
    Args:
        key: The key for the text string.
        user_id: The user ID to fetch preference for (optional).
        lang: Explicit language code (optional, overrides user_id).
        
    Returns:
        The translated string, or the key if not found.
    """
    if lang is None and user_id is not None:
        lang = get_user_language(user_id)
        
    if lang is None:
        lang = LANG_RU  # Default to Russian
        
    # Fallback to Russian if language not found
    texts = TRANSLATIONS.get(lang, TRANSLATIONS[LANG_RU])
    
    return texts.get(key, key)

def t(key: str, user_id: int = None, lang: str = None) -> str:
    """Short alias for get_text"""
    return get_text(key, user_id, lang)

def get_all_texts(key: str) -> list[str]:
    """Get list of all translations for a key"""
    return [texts.get(key, key) for texts in TRANSLATIONS.values()]
