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
  priceRange?: string;
  bedrooms?: number;
  status?: string;
}
