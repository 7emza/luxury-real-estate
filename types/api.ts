// API Response Types for WordPress Backend

export interface TranslationStrings {
  [key: string]: string;
}

export interface Translations {
  en: TranslationStrings;
  ar: TranslationStrings;
  fr: TranslationStrings;
  es: TranslationStrings;
  de: TranslationStrings;
  ru: TranslationStrings;
  'ma-darija': TranslationStrings;
  'ma-tifinagh': TranslationStrings;
  [language: string]: TranslationStrings;
}

export interface Currency {
  code: string; // ISO 4217 currency code (e.g., "USD", "EUR", "MAD")
  symbol: string; // Currency symbol (e.g., "$", "€", "DH")
  name: string; // Full name (e.g., "US Dollar", "Euro", "Moroccan Dirham")
  symbolPosition: 'before' | 'after'; // Where to place symbol relative to amount
  decimalPlaces: number; // Number of decimal places (usually 2)
}

export interface LanguageConfig {
  code: string; // Language code (e.g., "en", "ar", "fr")
  name: string; // Display name in English (e.g., "English", "Arabic")
  nativeName: string; // Display name in native language (e.g., "English", "العربية")
  currencies: string[]; // Available currency codes for this language
  defaultCurrency: string; // Default currency code
  rtl: boolean; // Is this language right-to-left
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logo: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
}

export interface FeatureHighlight {
  id: string;
  icon: string; // SVG path or icon name
  title: string;
  description: string;
  order: number;
}

export interface PropertyCategory {
  id: string;
  name: string;
  type: string;
  count: number;
  image: string;
  order: number;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  image: string;
  properties: number;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  image: string;
  order: number;
}

export interface HeroSection {
  id: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  content: string;
  sections?: {
    id: string;
    type: string;
    title?: string;
    subtitle?: string;
    content?: string;
    order: number;
  }[];
}

// Main API Response Structure
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// Endpoint-specific response types
export interface TranslationsResponse {
  translations: Translations;
  languages: LanguageConfig[];
  currencies: Currency[];
  defaultLanguage: string;
  defaultCurrency: string;
}

export interface HomePageContent {
  hero: HeroSection;
  featuredSection: {
    label: string;
    title: string;
    description: string;
    ctaText: string;
  };
  categoriesSection: {
    label: string;
    title: string;
    categories: PropertyCategory[];
  };
  locationsSection: {
    label: string;
    title: string;
    locations: Location[];
  };
  featuresSection: {
    label: string;
    title: string;
    features: FeatureHighlight[];
  };
  testimonialsSection: {
    label: string;
    title: string;
    testimonials: Testimonial[];
  };
  newsletterSection: {
    title: string;
    description: string;
    placeholder: string;
    ctaText: string;
  };
}

export interface FormOption {
  label: string;
  value: string;
}

export interface SearchFormContent {
  locationLabel: string;
  locationPlaceholder: string;
  locationOptions: FormOption[];
  typeLabel: string;
  typePlaceholder: string;
  typeOptions: FormOption[];
  priceLabel: string;
  pricePlaceholder: string;
  priceOptions: FormOption[];
  searchButtonText: string;
}

export interface FilterFormContent extends SearchFormContent {
  statusLabel: string;
  statusOptions: FormOption[];
  bedroomsLabel: string;
  bedroomsOptions: FormOption[];
  clearAllText: string;
  filtersText: string;
  sortByLabel: string;
  sortOptions: FormOption[];
}

export interface PropertiesPageContent {
  title: string;
  subtitle: string;
  filters: FilterFormContent;
  messages: {
    propertiesFound: string;
    filterActive: string;
    filtersActive: string;
    noPropertiesTitle: string;
    noPropertiesDescription: string;
    clearFiltersButton: string;
  };
}

export interface PropertyLabels {
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  perMonth: string;
  luxury: string;
  forSale: string;
  forRent: string;
}

// Property-related types
export interface Agent {
  name: string;
  phone: string;
  email: string;
  image: string;
}

export interface Property {
  id: number;
  title: string;
  type: 'Villa' | 'Apartment' | 'Townhouse' | 'Commercial';
  status: 'For Sale' | 'For Rent';
  price: number;
  pricePerMonth?: number;
  location: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  yearBuilt: number;
  description: string;
  features: string[];
  images: string[];
  featured: boolean;
  luxury: boolean;
  agent: Agent;
}

export interface SearchFilters {
  location?: string;
  type?: string;
  priceRange?: string;
  bedrooms?: number;
  status?: string;
  sortBy?: string;
}

// Extend Location to match data structure
export interface City {
  name: string;
  properties: number;
  image: string;
}
