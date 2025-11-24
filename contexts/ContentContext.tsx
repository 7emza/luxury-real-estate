'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  TranslationsResponse,
  SiteSettings,
  FeatureHighlight,
  PropertyCategory,
  LanguageConfig,
  Currency,
} from '@/types/api';
import { getTranslations, getSiteSettings, getFeatures, getCategories, getTranslation } from '@/lib/api';
import { formatPrice, formatPriceAbbreviated, formatPriceRange } from '@/lib/currency';
import { detectBrowserLanguage, detectDefaultCurrency } from '@/lib/localeDetection';

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
  isLoading: boolean;
  isRTL: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

interface ContentProviderProps {
  children: ReactNode;
  initialLanguage?: string;
}

export function ContentProvider({ children, initialLanguage = 'en' }: ContentProviderProps) {
  const [language, setLanguageState] = useState<string>(initialLanguage);
  const [languageConfig, setLanguageConfig] = useState<LanguageConfig | null>(null);
  const [availableLanguages, setAvailableLanguages] = useState<LanguageConfig[]>([]);
  const [currency, setCurrencyState] = useState<Currency | null>(null);
  const [allCurrencies, setAllCurrencies] = useState<Currency[]>([]);
  const [translations, setTranslations] = useState<TranslationsResponse['translations']>({});
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [features, setFeatures] = useState<FeatureHighlight[]>([]);
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all content on mount
  useEffect(() => {
    async function loadContent() {
      try {
        setIsLoading(true);

        const [translationsData, settingsData, featuresData, categoriesData] = await Promise.all([
          getTranslations(),
          getSiteSettings(),
          getFeatures(),
          getCategories(),
        ]);

        setTranslations(translationsData.translations);
        setAvailableLanguages(translationsData.languages);
        setAllCurrencies(translationsData.currencies);
        setSiteSettings(settingsData);
        setFeatures(featuresData);
        setCategories(categoriesData);

        // Determine initial language
        const savedLanguage = localStorage.getItem('language');
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

        // Determine initial currency
        const savedCurrencyCode = localStorage.getItem('currencyCode');
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
        }
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, [initialLanguage]);

  // Handle language change
  const setLanguage = (lang: string) => {
    const newLangConfig = availableLanguages.find(l => l.code === lang);
    if (newLangConfig) {
      setLanguageState(lang);
      setLanguageConfig(newLangConfig);
      localStorage.setItem('language', lang);

      // Check if current currency is valid for new language
      if (!newLangConfig.currencies.includes(currency?.code || '')) {
        // Switch to default currency for new language
        const newCurrency = allCurrencies.find(c => c.code === newLangConfig.defaultCurrency);
        if (newCurrency) {
          setCurrencyState(newCurrency);
          localStorage.setItem('currencyCode', newCurrency.code);
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
        localStorage.setItem('currencyCode', currencyCode);
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
