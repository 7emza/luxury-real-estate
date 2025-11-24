/**
 * Detect user's preferred language and currency based on browser settings
 */

/**
 * Get user's browser language
 * @returns Language code (e.g., "en", "ar", "fr")
 */
export function detectBrowserLanguage(): string {
  if (typeof navigator === 'undefined') return 'en';

  const language = navigator.language || (navigator as any).userLanguage;

  // Extract primary language code (e.g., "en-US" -> "en")
  const primaryLang = language.split('-')[0].toLowerCase();

  return primaryLang;
}

/**
 * Detect user's preferred currency based on browser language and region
 * @param languageCode - User's language code
 * @returns Currency code (e.g., "USD", "EUR", "MAD")
 */
export function detectDefaultCurrency(languageCode: string): string {
  if (typeof navigator === 'undefined') return 'USD';

  const language = navigator.language || (navigator as any).userLanguage;
  const fullLocale = language.toLowerCase();

  // Currency mapping based on locale
  const localeToCurrency: Record<string, string> = {
    // English variants
    'en-us': 'USD',
    'en-gb': 'EUR',
    'en-ca': 'USD',
    'en-au': 'USD',

    // Arabic variants
    'ar-ma': 'MAD', // Morocco
    'ar-ae': 'AED', // UAE
    'ar-sa': 'SAR', // Saudi Arabia
    'ar-eg': 'EGP', // Egypt
    'ar-qa': 'QAR', // Qatar
    'ar-dz': 'MAD', // Algeria (using MAD as fallback)
    'ar-tn': 'MAD', // Tunisia (using MAD as fallback)

    // French variants
    'fr-fr': 'EUR',
    'fr-be': 'EUR',
    'fr-ch': 'EUR',
    'fr-ca': 'USD',
    'fr-ma': 'MAD', // Morocco

    // Spanish
    'es-es': 'EUR',
    'es-mx': 'USD',
    'es-ar': 'USD',

    // German
    'de-de': 'EUR',
    'de-at': 'EUR',
    'de-ch': 'EUR',

    // Russian
    'ru-ru': 'RUB',
    'ru-by': 'RUB',
    'ru-ua': 'EUR',
  };

  // Try full locale first
  if (localeToCurrency[fullLocale]) {
    return localeToCurrency[fullLocale];
  }

  // Fallback to language-based defaults
  const languageToCurrency: Record<string, string> = {
    'en': 'USD',
    'ar': 'AED',
    'fr': 'EUR',
    'es': 'EUR',
    'de': 'EUR',
    'ru': 'RUB',
    'ma-darija': 'MAD',
    'ma-tifinagh': 'MAD',
  };

  return languageToCurrency[languageCode] || 'USD';
}

/**
 * Get country code from browser timezone or locale
 * @returns Two-letter country code (e.g., "US", "MA", "AE")
 */
export function detectCountryCode(): string | null {
  if (typeof navigator === 'undefined') return null;

  const language = navigator.language || (navigator as any).userLanguage;

  // Extract country code from locale (e.g., "en-US" -> "US")
  const parts = language.split('-');
  if (parts.length > 1) {
    return parts[1].toUpperCase();
  }

  return null;
}
