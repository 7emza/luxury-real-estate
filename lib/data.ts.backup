import propertiesData from '@/data/properties.json';
import { Property, PropertyData, SearchFilters } from '@/types/property';

export function getAllProperties(): Property[] {
  return (propertiesData as PropertyData).properties;
}

export function getFeaturedProperties(): Property[] {
  return getAllProperties().filter(p => p.featured);
}

export function getPropertyById(id: number): Property | undefined {
  return getAllProperties().find(p => p.id === id);
}

export function searchProperties(filters: SearchFilters): Property[] {
  let results = getAllProperties();

  if (filters.location) {
    results = results.filter(p =>
      p.location.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }

  if (filters.type) {
    results = results.filter(p =>
      p.type.toLowerCase() === filters.type!.toLowerCase()
    );
  }

  if (filters.status) {
    results = results.filter(p =>
      p.status.toLowerCase() === filters.status!.toLowerCase()
    );
  }

  if (filters.bedrooms) {
    results = results.filter(p => p.bedrooms >= filters.bedrooms!);
  }

  if (filters.priceRange) {
    const [min, max] = filters.priceRange.split('-').map(Number);
    results = results.filter(p => p.price >= min && p.price <= max);
  }

  return results;
}

export function getCities() {
  return (propertiesData as PropertyData).cities;
}

export function getTestimonials() {
  return (propertiesData as PropertyData).testimonials;
}
