# Region-Based Multi-Language & Currency System

## Overview

Your luxury real estate platform now uses a **Region-based system** where users first select a region, and each region has its own available languages and currencies.

## How It Works

### Step 1: Select Region
Users choose between:
- **🌍 International**
- **🇲🇦 Morocco**

### Step 2: Choose Language & Currency
Based on the selected region:

#### **International Region** 🌍
- **Available Languages**:
  - English
  - العربية (Arabic)
  - Français (French)
- **Available Currencies**:
  - USD ($) - US Dollar
  - EUR (€) - Euro
- **Currency Selection**: ✅ User can choose
- **Default**: English, USD

#### **Morocco Region** 🇲🇦
- **Available Languages**:
  - العربية (Arabic)
  - ⵜⴰⵎⴰⵣⵉⵖⵜ (Tifinagh/Tamazight)
  - الدارجة (Moroccan Darija)
  - English
  - Français (French)
- **Currency**:
  - MAD (DH) - Moroccan Dirham only
- **Currency Selection**: ❌ Fixed to MAD
- **Default**: French, MAD

## User Interface

### Navbar Dropdown
The language/region selector in the navbar shows:

1. **Button Display**:
   - Flag of current region
   - Current language name
   - Current currency code (e.g., "English (USD)" or "Français (MAD)")

2. **Dropdown Menu**:
   - **Current Region Header** with flag
   - **Language Section** - All languages for current region
   - **Currency Section** - Only shown for International region (USD/EUR choice)
   - **Switch Region Section** - Other available regions

## Code Usage

### Accessing Region, Language & Currency

```typescript
import { useTranslation } from '@/contexts/ContentContext';

function MyComponent() {
  const {
    // Region
    region,                    // Current region object
    setRegion,                 // Change region
    regions,                   // All regions

    // Language
    language,                  // Current language code
    setLanguage,               // Change language
    availableLanguagesForRegion, // Languages for current region
    t,                         // Translation function

    // Currency
    currency,                  // Current currency object
    setCurrency,               // Change currency
    availableCurrencies,       // Currencies for current region
    canSelectCurrency,         // Can user change currency?

    // Formatting
    formatPrice,               // Format price with currency
    formatPriceAbbreviated,    // Abbreviated format (e.g., $4.5M)
    formatPriceRange,          // Format price range
  } = useTranslation();

  return (
    <div>
      <p>Region: {region?.name}</p>
      <p>Language: {language}</p>
      <p>Currency: {currency?.code}</p>
    </div>
  );
}
```

### Example: Morocco User Experience

```typescript
// User selects Morocco region
setRegion('morocco');

// Automatically:
// - Currency set to MAD (fixed)
// - Language defaults to French (or saved preference)
// - Available languages: ar, ma-tifinagh, ma-darija, en, fr

// User can switch between languages:
setLanguage('ma-darija');  // Switch to Darija
setLanguage('ma-tifinagh'); // Switch to Tifinagh
setLanguage('ar');          // Switch to Arabic

// Currency cannot be changed (MAD only)
canSelectCurrency // false
```

### Example: International User Experience

```typescript
// User selects International region
setRegion('international');

// Automatically:
// - Currency defaults to USD
// - Language defaults to English
// - Available languages: en, ar, fr

// User can switch languages:
setLanguage('fr');  // Switch to French
setLanguage('ar');  // Switch to Arabic

// User can switch currencies:
canSelectCurrency // true
setCurrency('EUR'); // Switch from USD to EUR

// All prices update automatically:
formatPrice(4500000) // Was "$4,500,000.00", now "4,500,000.00 €"
```

## Price Formatting Examples

### International with USD:
```typescript
formatPrice(4500000)           // "$4,500,000.00"
formatPriceAbbreviated(4500000) // "$4.5M"
formatPriceRange(1000000, 5000000) // "$1,000,000.00 - $5,000,000.00"
```

### International with EUR:
```typescript
formatPrice(4500000)           // "4,500,000.00 €"
formatPriceAbbreviated(4500000) // "4.5M €"
```

### Morocco with MAD:
```typescript
formatPrice(4500000)           // "4,500,000.00 DH"
formatPriceAbbreviated(4500000) // "4.5M DH"
```

## Translation Examples

### English (en):
```javascript
t('nav.home')           // "Home"
t('hero.title')         // "Find Your Dream"
t('property.forSale')   // "For Sale"
```

### French (fr):
```javascript
t('nav.home')           // "Accueil"
t('hero.title')         // "Trouvez la maison"
t('property.forSale')   // "À vendre"
```

### Moroccan Darija (ma-darija):
```javascript
t('nav.home')           // "الداخلية"
t('hero.title')         // "قلب على الدار"
t('property.forSale')   // "للبيع"
```

### Tamazight/Tifinagh (ma-tifinagh):
```javascript
t('nav.home')           // "ⴰⵙⵏⵓⴱⴳ"
t('hero.title')         // "ⴰⴼ ⵜⴰⴷⴷⴰⵔⵜ"
t('property.forSale')   // "ⵉ ⵓⵥⵏⵣⵉ"
```

## Adding New Regions

To add a new region (e.g., Egypt):

### 1. Add to `data/mock-api.json`:

```json
{
  "id": "egypt",
  "name": "Egypt",
  "nativeName": "مصر",
  "flag": "🇪🇬",
  "languages": ["ar", "en"],
  "defaultLanguage": "ar",
  "currencies": [
    {
      "code": "EGP",
      "symbol": "E£",
      "name": "Egyptian Pound",
      "symbolPosition": "before",
      "decimalPlaces": 2
    }
  ],
  "defaultCurrency": "EGP",
  "allowCurrencySelection": false
}
```

### 2. Add translations for any new languages

### 3. Update language names in `components/Navbar.tsx` if needed

## Data Structure

### Region Object
```typescript
interface Region {
  id: string;                 // "international", "morocco"
  name: string;               // "International", "Morocco"
  nativeName: string;         // Native name
  flag: string;               // Emoji flag
  languages: string[];        // Available language codes
  defaultLanguage: string;    // Default language
  currencies: Currency[];     // Available currencies
  defaultCurrency: string;    // Default currency code
  allowCurrencySelection: boolean; // Can user choose?
}
```

### Currency Object
```typescript
interface Currency {
  code: string;               // "USD", "EUR", "MAD"
  symbol: string;             // "$", "€", "DH"
  name: string;               // "US Dollar"
  symbolPosition: 'before' | 'after';
  decimalPlaces: number;      // Usually 2
}
```

## RTL (Right-to-Left) Support

The system automatically detects RTL languages:
- Arabic (`ar`)
- Moroccan Darija (`ma-darija`)
- Tamazight (`ma-tifinagh`)

When an RTL language is selected:
- `<html dir="rtl">` is set
- Layout automatically flips to right-to-left

## Data Persistence

User preferences are saved to `localStorage`:
- **regionId**: Selected region (`"international"` or `"morocco"`)
- **language**: Selected language code
- **currencyCode**: Selected currency (if applicable)

These are automatically restored on return visits.

## Files Modified

1. **types/api.ts** - Added Region interface, updated from Culture to Region
2. **data/mock-api.json** - Changed from cultures to regions, added Tifinagh translations
3. **lib/api.ts** - Returns regions instead of cultures
4. **contexts/ContentContext.tsx** - Manages region, language, and currency state
5. **components/Navbar.tsx** - Updated UI to show region/language/currency selector

## Migration from Culture-based System

The old Culture-based system has been replaced with this Region-based system:

### What Changed:
- ❌ `culture` → ✅ `region`
- ❌ `setCulture` → ✅ `setRegion`
- ❌ `cultures` → ✅ `regions`
- ❌ `availableLanguagesForCulture` → ✅ `availableLanguagesForRegion`
- ❌ `culture.currency` → ✅ `currency` + `setCurrency()`

### New Features:
- ✅ Currency selection (for International region)
- ✅ Tifinagh language support
- ✅ Better regional organization

## Summary

Your platform now has a flexible region-based system where:

✅ Users select a **region first** (International or Morocco)
✅ Each region has its own **languages** and **currencies**
✅ International users can choose **USD or EUR**
✅ Morocco users get **MAD only** but **5 languages** including Tifinagh and Darija
✅ All prices automatically format with the correct currency
✅ Translations work across all languages
✅ User preferences persist across sessions
✅ RTL support is automatic for Arabic-based languages
