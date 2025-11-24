# Multi-Language & Multi-Culture System Guide

## Overview

Your luxury real estate platform now supports multiple cultures/regions, each with their own:
- **Multiple Languages**: Each culture can have 2-3 languages (e.g., Morocco has Arabic, French, and Darija)
- **Currency**: Each culture has its own currency with proper formatting (e.g., MAD/DH for Morocco, AED for UAE)
- **Regional Settings**: Including RTL support, native names, and flag emojis

## Current Configuration

### Cultures Available

1. **United Arab Emirates (UAE)** 🇦🇪
   - **Currency**: AED (UAE Dirham) - د.إ
   - **Languages**: English, Arabic
   - **Default Language**: English

2. **Morocco** 🇲🇦
   - **Currency**: MAD (Moroccan Dirham) - DH
   - **Languages**: Arabic, French, Moroccan Darija
   - **Default Language**: French

3. **France** 🇫🇷
   - **Currency**: EUR (Euro) - €
   - **Languages**: French, English
   - **Default Language**: French

## How It Works

### Culture Selection
When a user selects a culture (region), the system:
1. Updates the currency for all price displays
2. Shows only languages available for that culture
3. Switches to the culture's default language if the current language is not available
4. Saves the selection to localStorage

### Language Selection
Within a culture, users can switch between available languages:
- **Morocco**: Can switch between Arabic, French, or Darija
- **UAE**: Can switch between English or Arabic
- **France**: Can switch between French or English

## Using the System in Your Code

### 1. Accessing Culture & Language

```typescript
import { useTranslation } from '@/contexts/ContentContext';

function MyComponent() {
  const {
    t,                    // Translation function
    language,             // Current language code
    setLanguage,          // Change language
    culture,              // Current culture object
    setCulture,           // Change culture
    cultures,             // All available cultures
    currency,             // Current currency object
  } = useTranslation();

  return (
    <div>
      <p>{t('common.welcome')}</p>
      <p>Currency: {culture?.currency.name}</p>
    </div>
  );
}
```

### 2. Formatting Prices

```typescript
import { useTranslation } from '@/contexts/ContentContext';

function PropertyPrice() {
  const { formatPrice, formatPriceAbbreviated, currency } = useTranslation();

  const price = 4500000;

  return (
    <div>
      {/* Full price: د.إ4,500,000.00 or 4,500,000.00 DH */}
      <p>{formatPrice(price)}</p>

      {/* Abbreviated: د.إ4.5M or 4.5M DH */}
      <p>{formatPriceAbbreviated(price)}</p>

      {/* Currency symbol */}
      <span>{currency?.symbol}</span>
    </div>
  );
}
```

### 3. Price Range Formatting

```typescript
const { formatPriceRange } = useTranslation();

// Shows: "د.إ1,000,000.00 - د.إ5,000,000.00"
// Or: "1,000,000.00 DH - 5,000,000.00 DH"
<p>{formatPriceRange(1000000, 5000000)}</p>
```

### 4. Translations

All translations are automatically loaded based on the selected language:

```typescript
const { t } = useTranslation();

// Will show in English, Arabic, French, or Darija depending on selection
<h1>{t('hero.title')}</h1>
<p>{t('properties.subtitle', { count: 150 })}</p> // With variables
```

## Adding New Cultures

To add a new culture (e.g., Saudi Arabia):

### 1. Add to `data/mock-api.json`:

```json
{
  "id": "sa",
  "name": "Saudi Arabia",
  "nativeName": "المملكة العربية السعودية",
  "currency": {
    "code": "SAR",
    "symbol": "ر.س",
    "name": "Saudi Riyal",
    "symbolPosition": "before",
    "decimalPlaces": 2
  },
  "languages": ["ar", "en"],
  "defaultLanguage": "ar",
  "rtl": true,
  "flag": "🇸🇦"
}
```

### 2. Add Language Names in Navbar:

Update `components/Navbar.tsx`:

```typescript
const getLanguageName = (langCode: string) => {
  const names: Record<string, string> = {
    'en': 'English',
    'ar': 'العربية',
    'fr': 'Français',
    'ma-darija': 'الدارجة',
    // Add more as needed
  };
  return names[langCode] || langCode;
};
```

## Adding New Languages

To add translations for a new language:

### 1. Add to `data/mock-api.json`:

```json
"translations": {
  "en": { /* existing */ },
  "ar": { /* existing */ },
  "fr": { /* existing */ },
  "ma-darija": { /* existing */ },
  "es": {
    "nav.home": "Inicio",
    "nav.properties": "Propiedades",
    // ... add all keys
  }
}
```

### 2. Add to Types (if needed):

Update `types/api.ts` if you want TypeScript autocomplete:

```typescript
export interface Translations {
  en: TranslationStrings;
  ar: TranslationStrings;
  fr: TranslationStrings;
  'ma-darija': TranslationStrings;
  es: TranslationStrings; // Add new language
  [language: string]: TranslationStrings;
}
```

## Currency Formatting Details

The system automatically handles:

- **Symbol Position**: Before or after amount (د.إ1,000 vs 1,000 DH)
- **Decimal Places**: Customizable per currency
- **Thousand Separators**: Always uses comma (1,000,000)
- **Abbreviated Formats**: 1M, 2.5K, etc.

### Currency Object Structure

```typescript
interface Currency {
  code: string;           // "AED", "MAD", "EUR"
  symbol: string;         // "د.إ", "DH", "€"
  name: string;           // "UAE Dirham"
  symbolPosition: 'before' | 'after';
  decimalPlaces: number;  // Usually 2
}
```

## RTL (Right-to-Left) Support

The system automatically detects RTL languages and updates the HTML `dir` attribute:

```typescript
// Automatically sets <html dir="rtl"> for:
- language code 'ar'
- language code starting with 'ar-'
- language code 'ma-darija'
- Any culture with rtl: true
```

## User Experience

### Language Selector in Navbar

The navbar now shows a dropdown with:

1. **Current Culture Section**
   - Flag and culture name
   - List of available languages for that culture
   - Current language is highlighted

2. **Other Regions Section**
   - Other available cultures
   - Shows flag, name, and currency code
   - Clicking switches to that culture

### Mobile Support

The same dropdown works on mobile devices, triggered by the flag button.

## Data Persistence

User selections are saved to `localStorage`:

- **Culture**: Stored as `cultureId` (e.g., "ae", "ma", "fr")
- **Language**: Stored as `language` (e.g., "en", "ar", "fr", "ma-darija")

These are automatically restored when the user returns to the site.

## Example: Morocco Use Case

For Morocco (as you mentioned):

```typescript
// User selects Morocco 🇲🇦
// Automatically shows:
// - Currency: MAD (DH)
// - Available languages: العربية, Français, الدارجة

// When displaying a property price:
const price = 2500000; // 2.5 million

// In English context:
formatPrice(price) // "2,500,000.00 DH"

// In Arabic context:
formatPrice(price) // "2,500,000.00 DH"

// In Darija context:
formatPrice(price) // "2,500,000.00 DH"

// All show the same currency (MAD/DH) but with translations in different languages
```

## API Integration (Future)

When you connect to WordPress, update the API endpoint in `lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// WordPress should return:
// /wp-json/api/v1/translations
// {
//   "cultures": [...],
//   "translations": {...},
//   "defaultCulture": "ae",
//   "defaultLanguage": "en",
//   "availableLanguages": ["en", "ar", "fr", "ma-darija"]
// }
```

## Files Modified

1. **types/api.ts** - Added Culture and Currency types
2. **data/mock-api.json** - Added cultures array and French/Darija translations
3. **lib/api.ts** - Updated to return cultures
4. **lib/currency.ts** - NEW: Currency formatting utilities
5. **contexts/ContentContext.tsx** - Enhanced with culture support
6. **components/Navbar.tsx** - Updated with culture/language dropdown

## Summary

You now have a complete multi-culture system where:
- ✅ Users can select their region (UAE, Morocco, France)
- ✅ Each region has its own currency (AED, MAD, EUR)
- ✅ Each region offers multiple languages
- ✅ Morocco supports: Arabic, French, and Darija
- ✅ All prices automatically format with the correct currency
- ✅ Translations work across all languages
- ✅ RTL support is automatic
- ✅ User preferences persist across sessions
