// API Service Layer - Replace these with real WordPress API endpoints later
import mockData from '@/data/mock-api.json';
import {
  TranslationsResponse,
  SiteSettings,
  FeatureHighlight,
  PropertyCategory,
  City,
  Testimonial,
  Property,
  SearchFilters,
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
      languages: mockData.languages,
      currencies: mockData.currencies,
      defaultLanguage: 'en',
      defaultCurrency: 'USD',
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

/**
 * Fetch cities/locations
 * WordPress Endpoint: /wp-json/api/v1/locations
 */
export async function getCities(): Promise<City[]> {
  try {
    // For now, return mock data
    // Later: const response = await fetch(`${API_BASE_URL}/locations`);
    // Later: return await response.json();

    return mockData.cities as City[];
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
}

/**
 * Fetch testimonials
 * WordPress Endpoint: /wp-json/api/v1/testimonials
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    // For now, return mock data
    // Later: const response = await fetch(`${API_BASE_URL}/testimonials`);
    // Later: return await response.json();

    return mockData.testimonials as Testimonial[];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
}

/**
 * Fetch all properties
 * WordPress Endpoint: /wp-json/api/v1/properties
 */
export async function getAllProperties(): Promise<Property[]> {
  try {
    // For now, return mock data
    // Later: const response = await fetch(`${API_BASE_URL}/properties`);
    // Later: return await response.json();

    return mockData.properties as Property[];
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
}

/**
 * Fetch featured properties
 * WordPress Endpoint: /wp-json/api/v1/properties?featured=true
 */
export async function getFeaturedProperties(): Promise<Property[]> {
  try {
    // For now, return mock data
    // Later: const response = await fetch(`${API_BASE_URL}/properties?featured=true`);
    // Later: return await response.json();

    const properties = mockData.properties as Property[];
    return properties.filter((p) => p.featured);
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    throw error;
  }
}

/**
 * Fetch a single property by ID
 * WordPress Endpoint: /wp-json/api/v1/properties/{id}
 */
export async function getPropertyById(id: number): Promise<Property | undefined> {
  try {
    // For now, return mock data
    // Later: const response = await fetch(`${API_BASE_URL}/properties/${id}`);
    // Later: return await response.json();

    const properties = mockData.properties as Property[];
    return properties.find((p) => p.id === id);
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
}

/**
 * Search properties with filters
 * WordPress Endpoint: /wp-json/api/v1/properties/search
 */
export async function searchProperties(filters: SearchFilters): Promise<Property[]> {
  try {
    // For now, filter mock data
    // Later: Build query params and fetch from WordPress
    // const params = new URLSearchParams();
    // if (filters.location) params.append('location', filters.location);
    // if (filters.type) params.append('type', filters.type);
    // const response = await fetch(`${API_BASE_URL}/properties/search?${params}`);
    // return await response.json();

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
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
}
