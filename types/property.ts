export interface Agent {
  name: string;
  phone: string;
  email: string;
  image: string;
}

export interface CurrencyPrice {
  price: number;
  rent: number | null;
  symbol: string;
  position: string;
}

export interface Property {
  id: number;
  title: string;
  type: 'Villa' | 'Apartment' | 'Townhouse' | 'Commercial';
  status: 'For Sale' | 'For Rent';
  price: number;
  pricePerMonth?: number;
  prices?: { [currency: string]: CurrencyPrice }; // Multi-currency prices
  currency?: string;
  location: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
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

export interface City {
  name: string;
  properties: number;
  image: string;
}

export interface Testimonial {
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
}

export interface PropertyData {
  properties: Property[];
  cities: City[];
  testimonials: Testimonial[];
}

export interface SearchFilters {
  location?: string;
  type?: string;
  priceRange?: string; // Legacy support
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: number;
  status?: string;
}
