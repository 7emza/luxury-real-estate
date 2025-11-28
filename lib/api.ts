// API Service Layer - Connected to WordPress REST API
import mockData from '@/data/mock-api.json';
import {
  TranslationsResponse,
  SiteSettings,
  FeatureHighlight,
  PropertyCategory,
  Currency,
  City,
  Testimonial,
  Property,
  SearchFilters,
} from '@/types/api';

// Base API URL - WordPress API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Helper function to fetch from WordPress API
 */
async function fetchAPI(endpoint: string, params?: Record<string, string>) {
  const url = new URL(`${API_BASE_URL}${endpoint}`,
    typeof window !== 'undefined' ? window.location.origin : 'https://wordpress.7emza.ma/wp-json/api/v1');

  // Add query parameters if provided
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data; // WordPress API wraps response in {success, data, timestamp}
}

/**
 * Fetch translations for all languages
 * WordPress Endpoint: /wp-json/api/v1/translations
 */
export async function getTranslations(): Promise<TranslationsResponse> {
  try {
    const data = await fetchAPI('/translations');

    // If WordPress returns empty data, fallback to mock data
    if (!data.translations || Object.keys(data.translations).length === 0) {
      return {
        translations: mockData.translations,
        languages: mockData.languages,
        currencies: mockData.currencies as Currency[],
        defaultLanguage: 'en',
        defaultCurrency: 'MAD',
      };
    }

    // Transform WordPress translations format to expected format
    // WordPress returns: { 'nav.home': { en: 'Home', fr: 'Accueil', ar: '...' } }
    // Frontend expects: { en: { 'nav.home': 'Home' }, fr: { 'nav.home': 'Accueil' } }
    const transformedTranslations: TranslationsResponse['translations'] = {} as TranslationsResponse['translations'];

    // Get all language codes
    const langCodes = (data.languages || []).map((l: { code: string }) => l.code);

    // Initialize each language
    langCodes.forEach((code: string) => {
      transformedTranslations[code] = {};
    });

    // Transform translations
    Object.entries(data.translations || {}).forEach(([key, values]) => {
      if (typeof values === 'object' && values !== null) {
        Object.entries(values as Record<string, string>).forEach(([langCode, translation]) => {
          if (transformedTranslations[langCode]) {
            transformedTranslations[langCode][key] = translation;
          }
        });
      }
    });

    // Transform currencies to expected format
    const transformedCurrencies: Currency[] = (data.currencies || []).map((c: { code: string; name: string; symbol: string; position?: string; isDefault?: boolean }) => ({
      code: c.code,
      name: c.name,
      symbol: c.symbol,
      symbolPosition: (c.position === 'after' ? 'after' : 'before') as 'before' | 'after',
      decimalPlaces: 0, // Luxury real estate typically doesn't use decimals
    }));

    // Transform languages to expected format
    // Each language has its own set of available currencies
    const allCurrencyCodes = transformedCurrencies.map(c => c.code);
    const transformedLanguages = (data.languages || []).map((l: { code: string; name: string; nativeName: string; rtl?: boolean; defaultCurrency?: string; currencies?: string[] }) => ({
      code: l.code,
      name: l.name,
      nativeName: l.nativeName,
      rtl: l.rtl || false,
      currencies: l.currencies || allCurrencyCodes, // Use language-specific currencies or fallback to all
      defaultCurrency: l.defaultCurrency || data.defaultCurrency || 'MAD',
    }));

    return {
      translations: transformedTranslations,
      languages: transformedLanguages,
      currencies: transformedCurrencies,
      defaultLanguage: data.defaultLanguage || 'en',
      defaultCurrency: data.defaultCurrency || 'MAD',
    };
  } catch (error) {
    console.error('Error fetching translations:', error);
    // Fallback to mock data on error
    return {
      translations: mockData.translations,
      languages: mockData.languages,
      currencies: mockData.currencies as Currency[],
      defaultLanguage: 'en',
      defaultCurrency: 'MAD',
    };
  }
}

/**
 * Fetch site settings
 * WordPress Endpoint: /wp-json/api/v1/settings
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await fetchAPI('/settings');
    return settings as SiteSettings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return mockData.siteSettings as SiteSettings;
  }
}

/**
 * Fetch feature highlights for "Why Choose Us" section
 * WordPress Endpoint: /wp-json/api/v1/features
 */
export async function getFeatures(): Promise<FeatureHighlight[]> {
  try {
    const features = await fetchAPI('/features');
    return features as FeatureHighlight[];
  } catch (error) {
    console.error('Error fetching features:', error);
    return mockData.features as FeatureHighlight[];
  }
}

/**
 * Fetch property categories
 * WordPress Endpoint: /wp-json/api/v1/categories
 */
export async function getCategories(): Promise<PropertyCategory[]> {
  try {
    const categories = await fetchAPI('/categories');
    return categories as PropertyCategory[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return mockData.categories as PropertyCategory[];
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

/**
 * Fetch cities/locations
 * WordPress Endpoint: /wp-json/api/v1/locations
 */
export async function getCities(): Promise<City[]> {
  try {
    const locations = await fetchAPI('/locations');
    return locations as City[];
  } catch (error) {
    console.error('Error fetching cities:', error);
    return mockData.cities as City[];
  }
}

/**
 * Fetch testimonials
 * WordPress Endpoint: /wp-json/api/v1/testimonials
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonials = await fetchAPI('/testimonials');
    return testimonials as Testimonial[];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return mockData.testimonials as Testimonial[];
  }
}

/**
 * Fetch all properties
 * WordPress Endpoint: /wp-json/api/v1/properties
 */
export async function getAllProperties(
  lang?: string,
  currency?: string
): Promise<Property[]> {
  try {
    const params: Record<string, string> = {};
    if (lang) params.lang = lang;
    if (currency) params.currency = currency;

    const properties = await fetchAPI('/properties', params);
    return properties as Property[];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return mockData.properties as Property[];
  }
}

/**
 * Fetch featured properties
 * WordPress Endpoint: /wp-json/api/v1/properties?featured=true
 */
export async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/properties?featured=1`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch featured properties');
    }

    const data = await response.json();
    return data.data as Property[];
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    const properties = mockData.properties as Property[];
    return properties.filter((p) => p.featured);
  }
}

/**
 * Fetch a single property by ID
 * WordPress Endpoint: /wp-json/api/v1/properties/{id}
 */
export async function getPropertyById(
  id: number,
  lang?: string,
  currency?: string
): Promise<Property | undefined> {
  try {
    const params: Record<string, string> = {};
    if (lang) params.lang = lang;
    if (currency) params.currency = currency;

    const property = await fetchAPI(`/properties/${id}`, params);
    return property as Property;
  } catch (error) {
    console.error('Error fetching property:', error);
    const properties = mockData.properties as Property[];
    return properties.find((p) => p.id === id);
  }
}

/**
 * Search properties with filters
 * WordPress Endpoint: /wp-json/api/v1/properties/search
 */
export async function searchProperties(filters: SearchFilters): Promise<Property[]> {
  try {
    const params = new URLSearchParams();

    if (filters.location) params.append('location', filters.location);
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
    if (filters.priceRange) params.append('priceRange', filters.priceRange);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const response = await fetch(`${API_BASE_URL}/properties/search?${params}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error('Failed to search properties');
    }

    const data = await response.json();
    return data.data as Property[];
  } catch (error) {
    console.error('Error searching properties:', error);

    // Fallback to mock data with filtering
    let results = mockData.properties as Property[];

    if (filters.location) {
      results = results.filter((p) =>
        p.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.type) {
      results = results.filter((p) =>
        p.type.toLowerCase() === filters.type!.toLowerCase()
      );
    }

    if (filters.status) {
      results = results.filter((p) =>
        p.status.toLowerCase() === filters.status!.toLowerCase()
      );
    }

    if (filters.bedrooms) {
      results = results.filter((p) => p.bedrooms >= filters.bedrooms!);
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      results = results.filter((p) => p.price >= min && p.price <= max);
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'featured':
          results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
    }

    return results;
  }
}
