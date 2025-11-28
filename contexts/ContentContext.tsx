'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  TranslationsResponse,
  SiteSettings,
  FeatureHighlight,
  PropertyCategory,
  LanguageConfig,
  Currency,
  City,
  Testimonial,
  Property,
} from '@/types/api';
import {
  getTranslations,
  getSiteSettings,
  getFeatures,
  getCategories,
  getCities,
  getTestimonials,
  getFeaturedProperties,
  getTranslation
} from '@/lib/api';
import { formatPrice, formatPriceAbbreviated, formatPriceRange } from '@/lib/currency';
import { detectBrowserLanguage, detectDefaultCurrency } from '@/lib/localeDetection';
import mockData from '@/data/mock-api.json';

// Cache configuration
const CACHE_KEY = 'lre-content-cache';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  timestamp: number;
  translations: TranslationsResponse;
  siteSettings: SiteSettings;
  features: FeatureHighlight[];
  categories: PropertyCategory[];
  cities: City[];
  testimonials: Testimonial[];
  featuredProperties: Property[];
}

// Helper to check if cache is valid
function getCachedData(): CachedData | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CachedData = JSON.parse(cached);
    const now = Date.now();

    // Check if cache has expired
    if (now - data.timestamp > CACHE_EXPIRY_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

// Helper to save data to cache
function setCachedData(data: Omit<CachedData, 'timestamp'>): void {
  if (typeof window === 'undefined') return;

  try {
    const cacheData: CachedData = {
      ...data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error saving cache:', error);
  }
}

interface ContentContextType {
  // Language
  language: string;
  setLanguage: (lang: string) => void;
  languageConfig: LanguageConfig | null;
  availableLanguages: LanguageConfig[]; // All available languages

  // Translation
  t: (key: string, variables?: Record<string, string | number>) => string;

  // Currency & Formatting
  currency: Currency | null;
  setCurrency: (currencyCode: string) => void;
  availableCurrenciesForLanguage: Currency[]; // Currencies for current language
  allCurrencies: Currency[]; // All currencies
  formatPrice: (amount: number, showDecimals?: boolean) => string;
  formatPriceAbbreviated: (amount: number) => string;
  formatPriceRange: (min: number, max: number) => string;

  // Content
  siteSettings: SiteSettings | null;
  features: FeatureHighlight[];
  categories: PropertyCategory[];
  cities: City[];
  testimonials: Testimonial[];
  featuredProperties: Property[];
  isLoading: boolean;
  isRTL: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

interface ContentProviderProps {
  children: ReactNode;
  initialLanguage?: string;
}

// Get initial language from localStorage (client-side only)
function getInitialLanguage(fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return localStorage.getItem('lre-language') || fallback;
}

// Get initial language config based on language code
function getInitialLanguageConfig(langCode: string): LanguageConfig {
  const lang = mockData.languages.find(l => l.code === langCode);
  return lang as LanguageConfig || mockData.languages[0] as LanguageConfig;
}

export function ContentProvider({ children, initialLanguage = 'en' }: ContentProviderProps) {
  // Initialize with saved language or fallback
  const [language, setLanguageState] = useState<string>(() => getInitialLanguage(initialLanguage));
  const [languageConfig, setLanguageConfig] = useState<LanguageConfig | null>(() => getInitialLanguageConfig(getInitialLanguage(initialLanguage)));
  const [availableLanguages, setAvailableLanguages] = useState<LanguageConfig[]>(mockData.languages as LanguageConfig[]);
  const [currency, setCurrencyState] = useState<Currency | null>(null);
  const [allCurrencies, setAllCurrencies] = useState<Currency[]>(mockData.currencies as Currency[]);
  // Initialize with mock translations to prevent showing keys
  const [translations, setTranslations] = useState<TranslationsResponse['translations']>(mockData.translations as TranslationsResponse['translations']);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [features, setFeatures] = useState<FeatureHighlight[]>([]);
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all content on mount
  useEffect(() => {
    async function loadContent() {
      try {
        setIsLoading(true);

        // Try to get cached data first
        const cached = getCachedData();

        let translationsData: TranslationsResponse;
        let settingsData: SiteSettings;
        let featuresData: FeatureHighlight[];
        let categoriesData: PropertyCategory[];
        let citiesData: City[];
        let testimonialsData: Testimonial[];
        let featuredPropertiesData: Property[];

        if (cached) {
          // Use cached data for instant loading
          translationsData = cached.translations;
          settingsData = cached.siteSettings;
          featuresData = cached.features;
          categoriesData = cached.categories;
          citiesData = cached.cities;
          testimonialsData = cached.testimonials;
          featuredPropertiesData = cached.featuredProperties;

          // Set state immediately from cache
          setTranslations(translationsData.translations);
          setAvailableLanguages(translationsData.languages);
          setAllCurrencies(translationsData.currencies);
          setSiteSettings(settingsData);
          setFeatures(featuresData);
          setCategories(categoriesData);
          setCities(citiesData);
          setTestimonials(testimonialsData);
          setFeaturedProperties(featuredPropertiesData);

          // Set loading to false immediately when we have cached data
          // This prevents showing skeletons unnecessarily
          setIsLoading(false);

          // Refresh cache in background (stale-while-revalidate)
          Promise.all([
            getTranslations(),
            getSiteSettings(),
            getFeatures(),
            getCategories(),
            getCities(),
            getTestimonials(),
            getFeaturedProperties(),
          ]).then(([newTranslations, newSettings, newFeatures, newCategories, newCities, newTestimonials, newFeatured]) => {
            setCachedData({
              translations: newTranslations,
              siteSettings: newSettings,
              features: newFeatures,
              categories: newCategories,
              cities: newCities,
              testimonials: newTestimonials,
              featuredProperties: newFeatured,
            });
            // Update state with fresh data
            setTranslations(newTranslations.translations);
            setAvailableLanguages(newTranslations.languages);
            setAllCurrencies(newTranslations.currencies);
            setSiteSettings(newSettings);
            setFeatures(newFeatures);
            setCategories(newCategories);
            setCities(newCities);
            setTestimonials(newTestimonials);
            setFeaturedProperties(newFeatured);
          }).catch(err => console.error('Background refresh failed:', err));

        } else {
          // No cache, fetch fresh data
          const [newTranslations, newSettings, newFeatures, newCategories, newCities, newTestimonials, newFeatured] = await Promise.all([
            getTranslations(),
            getSiteSettings(),
            getFeatures(),
            getCategories(),
            getCities(),
            getTestimonials(),
            getFeaturedProperties(),
          ]);

          translationsData = newTranslations;
          settingsData = newSettings;
          featuresData = newFeatures;
          categoriesData = newCategories;
          citiesData = newCities;
          testimonialsData = newTestimonials;
          featuredPropertiesData = newFeatured;

          // Save to cache
          setCachedData({
            translations: translationsData,
            siteSettings: settingsData,
            features: featuresData,
            categories: categoriesData,
            cities: citiesData,
            testimonials: testimonialsData,
            featuredProperties: featuredPropertiesData,
          });

          setTranslations(translationsData.translations);
          setAvailableLanguages(translationsData.languages);
          setAllCurrencies(translationsData.currencies);
          setSiteSettings(settingsData);
          setFeatures(featuresData);
          setCategories(categoriesData);
          setCities(citiesData);
          setTestimonials(testimonialsData);
          setFeaturedProperties(featuredPropertiesData);
        }

        // Determine initial language
        const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('lre-language') : null;
        const detectedLanguage = detectBrowserLanguage();

        let languageToUse = initialLanguage;

        // Priority: saved > detected > initial
        if (savedLanguage && translationsData.languages.find(l => l.code === savedLanguage)) {
          languageToUse = savedLanguage;
        } else if (translationsData.languages.find(l => l.code === detectedLanguage)) {
          languageToUse = detectedLanguage;
        }

        const langConfig = translationsData.languages.find(l => l.code === languageToUse) || translationsData.languages[0];
        setLanguageState(langConfig.code);
        setLanguageConfig(langConfig);

        // Set language cookie for server components
        if (typeof document !== 'undefined') {
          const expires = new Date();
          expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
          document.cookie = `language=${langConfig.code};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
        }

        // Determine initial currency
        const savedCurrencyCode = typeof window !== 'undefined' ? localStorage.getItem('lre-currency') : null;
        const detectedCurrency = detectDefaultCurrency(langConfig.code);

        let currencyCode = langConfig.defaultCurrency;

        // Priority: saved (if valid for language) > detected > default
        if (savedCurrencyCode && langConfig.currencies.includes(savedCurrencyCode)) {
          currencyCode = savedCurrencyCode;
        } else if (langConfig.currencies.includes(detectedCurrency)) {
          currencyCode = detectedCurrency;
        }

        const currencyObj = translationsData.currencies.find(c => c.code === currencyCode);
        if (currencyObj) {
          setCurrencyState(currencyObj);

          // Set currency cookie for server components
          if (typeof document !== 'undefined') {
            const expires = new Date();
            expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
            document.cookie = `currencyCode=${currencyObj.code};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
          }
        }
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, [initialLanguage]);

  // Helper to set cookie
  const setCookie = (name: string, value: string, days: number = 365) => {
    if (typeof document !== 'undefined') {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
  };

  // Handle language change
  const setLanguage = (lang: string) => {
    const newLangConfig = availableLanguages.find(l => l.code === lang);
    if (newLangConfig) {
      setLanguageState(lang);
      setLanguageConfig(newLangConfig);
      if (typeof window !== 'undefined') {
        localStorage.setItem('lre-language', lang);
        setCookie('language', lang); // Also set cookie for server components
      }

      // Check if current currency is valid for new language
      if (!newLangConfig.currencies.includes(currency?.code || '')) {
        // Switch to default currency for new language
        const newCurrency = allCurrencies.find(c => c.code === newLangConfig.defaultCurrency);
        if (newCurrency) {
          setCurrencyState(newCurrency);
          if (typeof window !== 'undefined') {
            localStorage.setItem('lre-currency', newCurrency.code);
            setCookie('currencyCode', newCurrency.code); // Also set cookie for server components
          }
        }
      }
    }
  };

  // Handle currency change
  const setCurrency = (currencyCode: string) => {
    if (languageConfig && languageConfig.currencies.includes(currencyCode)) {
      const newCurrency = allCurrencies.find(c => c.code === currencyCode);
      if (newCurrency) {
        setCurrencyState(newCurrency);
        if (typeof window !== 'undefined') {
          localStorage.setItem('lre-currency', currencyCode);
          setCookie('currencyCode', currencyCode); // Also set cookie for server components
        }
      }
    }
  };

  // Update HTML attributes when language changes
  useEffect(() => {
    if (typeof document !== 'undefined' && languageConfig) {
      // Determine RTL based on language config
      const isRTL = languageConfig.rtl;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language, languageConfig]);

  // Translation helper function
  const t = (key: string, variables?: Record<string, string | number>): string => {
    return getTranslation(translations, key, language, variables);
  };

  // Currency formatting helpers
  const formatPriceFunc = (amount: number, showDecimals: boolean = true): string => {
    if (!currency) return amount.toString();
    return formatPrice(amount, currency, showDecimals);
  };

  const formatPriceAbbreviatedFunc = (amount: number): string => {
    if (!currency) return amount.toString();
    return formatPriceAbbreviated(amount, currency);
  };

  const formatPriceRangeFunc = (min: number, max: number): string => {
    if (!currency) return `${min} - ${max}`;
    return formatPriceRange(min, max, currency);
  };

  const isRTL = languageConfig?.rtl ?? false;
  const availableCurrenciesForLanguage = languageConfig
    ? allCurrencies.filter(c => languageConfig.currencies.includes(c.code))
    : [];

  const value: ContentContextType = {
    language,
    setLanguage,
    languageConfig,
    availableLanguages,
    t,
    currency,
    setCurrency,
    availableCurrenciesForLanguage,
    allCurrencies,
    formatPrice: formatPriceFunc,
    formatPriceAbbreviated: formatPriceAbbreviatedFunc,
    formatPriceRange: formatPriceRangeFunc,
    siteSettings,
    features,
    categories,
    cities,
    testimonials,
    featuredProperties,
    isLoading,
    isRTL,
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

// Custom hook to use the content context
export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

// Convenience hook for translations and localization
export function useTranslation() {
  const {
    t,
    language,
    setLanguage,
    languageConfig,
    availableLanguages,
    currency,
    setCurrency,
    availableCurrenciesForLanguage,
    allCurrencies,
    formatPrice,
    formatPriceAbbreviated,
    formatPriceRange,
    isRTL
  } = useContent();

  return {
    t,
    language,
    setLanguage,
    languageConfig,
    availableLanguages,
    currency,
    setCurrency,
    availableCurrenciesForLanguage,
    allCurrencies,
    formatPrice,
    formatPriceAbbreviated,
    formatPriceRange,
    isRTL
  };
}
