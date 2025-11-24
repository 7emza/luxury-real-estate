'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import { getAllProperties, searchProperties } from '@/lib/data';
import { Property, SearchFilters } from '@/types/property';

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    // Get filters from URL params
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const priceRange = searchParams.get('priceRange');
    const status = searchParams.get('status');

    const urlFilters: SearchFilters = {};
    if (location) urlFilters.location = location;
    if (type) urlFilters.type = type;
    if (priceRange) urlFilters.priceRange = priceRange;
    if (status) urlFilters.status = status;

    setFilters(urlFilters);

    // Get filtered properties
    const results = Object.keys(urlFilters).length > 0
      ? searchProperties(urlFilters)
      : getAllProperties();

    // Sort properties
    let sortedResults = [...results];
    if (sortBy === 'price-asc') {
      sortedResults.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sortedResults.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'featured') {
      sortedResults.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setProperties(sortedResults);
  }, [searchParams, sortBy]);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    if (!value) delete newFilters[key];

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });

    window.history.pushState({}, '', `/properties?${params.toString()}`);
    setFilters(newFilters);

    const results = Object.keys(newFilters).length > 0
      ? searchProperties(newFilters)
      : getAllProperties();

    setProperties(results);
  };

  const clearFilters = () => {
    window.history.pushState({}, '', '/properties');
    setFilters({});
    setProperties(getAllProperties());
  };

  const activeFilterCount = Object.keys(filters).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Discover Properties
          </h1>
          <p className="text-xl opacity-90">
            Browse through {properties.length} exclusive properties in Dubai
          </p>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
                >
                  <option value="">All</option>
                  <option value="for sale">For Sale</option>
                  <option value="for rent">For Rent</option>
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
                >
                  <option value="">All Locations</option>
                  <option value="Dubai Marina">Dubai Marina</option>
                  <option value="Downtown Dubai">Downtown Dubai</option>
                  <option value="Palm Jumeirah">Palm Jumeirah</option>
                  <option value="Arabian Ranches">Arabian Ranches</option>
                  <option value="JBR">JBR</option>
                  <option value="Business Bay">Business Bay</option>
                  <option value="DIFC">DIFC</option>
                  <option value="Dubai Hills Estate">Dubai Hills Estate</option>
                </select>
              </div>

              {/* Property Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
                >
                  <option value="">All Types</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={filters.priceRange || ''}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
                >
                  <option value="">Any Price</option>
                  <option value="0-1000000">Under $1M</option>
                  <option value="1000000-5000000">$1M - $5M</option>
                  <option value="5000000-10000000">$5M - $10M</option>
                  <option value="10000000-999999999">Over $10M</option>
                </select>
              </div>

              {/* Bedrooms Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minimum Bedrooms
                </label>
                <select
                  value={filters.bedrooms || ''}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="text-gray-600">
                <span className="font-semibold text-gray-900">{properties.length}</span> properties found
                {activeFilterCount > 0 && (
                  <span className="ml-2">
                    ({activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Properties Grid */}
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
