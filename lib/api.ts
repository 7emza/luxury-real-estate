// API Service Layer - Replace these with real WordPress API endpoints later
import mockData from '@/data/mock-api.json';
import {
  TranslationsResponse,
  SiteSettings,
  FeatureHighlight,
  PropertyCategory,
} from '@/types/api';

// Base API URL - Change this to your WordPress API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Fetch translations for all languages
 * WordPress Endpoint: /wp-json/api/v1/translations
 */
export async function getTranslations(): Promise<TranslationsResponse> {
  try {
    // For now, return mock data
    // Later: const response = await fetch(`${API_BASE_URL}/translations`);
    // Later: return await response.json();

    return {
      translations: mockData.translations,
      defaultLanguage: 'en',
      availableLanguages: ['en', 'ar'],
    };
  } catch (error) {
    console.error('Error fetching translations:', error);
    throw error;
  }
}

/**
 * Fetch site settings
 * WordPress Endpoint: /wp-json/api/v1/settings
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    // For now, return mock data
    // Later: const response = await fetch(`${API_BASE_URL}/settings`);
    // Later: return await response.json();

    return mockData.siteSettings as SiteSettings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    throw error;
  }
}

/**
 * Fetch feature highlights for "Why Choose Us" section
 * WordPress Endpoint: /wp-json/api/v1/features
 */
export async function getFeatures(): Promise<FeatureHighlight[]> {
  try {
    // For now, return mock data
    // Later: const response = await fetch(`${API_BASE_URL}/features`);
    // Later: return await response.json();

    return mockData.features as FeatureHighlight[];
  } catch (error) {
    console.error('Error fetching features:', error);
    throw error;
  }
}

/**
 * Fetch property categories
 * WordPress Endpoint: /wp-json/api/v1/categories
 */
export async function getCategories(): Promise<PropertyCategory[]> {
  try {
    // For now, return mock data
    // Later: const response = await fetch(`${API_BASE_URL}/categories`);
    // Later: return await response.json();

    return mockData.categories as PropertyCategory[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Fetch all content data at once (useful for SSG/SSR)
 * WordPress Endpoint: /wp-json/api/v1/content/all
 */
export async function getAllContent() {
  try {
    const [translations, siteSettings, features, categories] = await Promise.all([
      getTranslations(),
      getSiteSettings(),
      getFeatures(),
      getCategories(),
    ]);

    return {
      translations,
      siteSettings,
      features,
      categories,
    };
  } catch (error) {
    console.error('Error fetching all content:', error);
    throw error;
  }
}

// Helper function to get translation by key and language
export function getTranslation(
  translations: TranslationsResponse['translations'],
  key: string,
  language: string = 'en',
  variables?: Record<string, string | number>
): string {
  let translation = translations[language]?.[key] || translations['en']?.[key] || key;

  // Replace variables in translation string
  if (variables) {
    Object.entries(variables).forEach(([varKey, varValue]) => {
      translation = translation.replace(`{${varKey}}`, String(varValue));
    });
  }

  return translation;
}
