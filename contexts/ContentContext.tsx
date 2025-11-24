'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  TranslationsResponse,
  SiteSettings,
  FeatureHighlight,
  PropertyCategory,
} from '@/types/api';
import { getTranslations, getSiteSettings, getFeatures, getCategories, getTranslation } from '@/lib/api';

interface ContentContextType {
  language: string;
  setLanguage: (lang: string) => void;
  availableLanguages: string[];
  t: (key: string, variables?: Record<string, string | number>) => string;
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
  const [language, setLanguage] = useState<string>(initialLanguage);
  const [translations, setTranslations] = useState<TranslationsResponse['translations']>({});
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(['en']);
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
        setAvailableLanguages(translationsData.availableLanguages);
        setSiteSettings(settingsData);
        setFeatures(featuresData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, []);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && availableLanguages.includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, [availableLanguages]);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);

    // Update HTML dir attribute for RTL support
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  // Translation helper function
  const t = (key: string, variables?: Record<string, string | number>): string => {
    return getTranslation(translations, key, language, variables);
  };

  const isRTL = language === 'ar';

  const value: ContentContextType = {
    language,
    setLanguage,
    availableLanguages,
    t,
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

// Convenience hook for just translations
export function useTranslation() {
  const { t, language, setLanguage, availableLanguages, isRTL } = useContent();
  return { t, language, setLanguage, availableLanguages, isRTL };
}
