'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import { PropertyCardSkeleton } from '@/components/Skeleton';
import { getAllProperties, searchProperties } from '@/lib/api';
import { Property, SearchFilters } from '@/types/property';
import { useTranslation, useContent } from '@/contexts/ContentContext';
import { generatePriceOptions, PriceOption } from '@/lib/priceUtils';

function PropertiesContent() {
  const searchParams = useSearchParams();
  const { t, language, currency, formatPriceAbbreviated } = useTranslation();
  const { cities, categories, isLoading: contentLoading } = useContent();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [priceOptions, setPriceOptions] = useState<PriceOption[]>([]);

  // Generate dynamic price options from actual properties
  useEffect(() => {
    async function loadPriceOptions() {
      try {
        const allProps = await getAllProperties();

        if (allProps.length === 0 || !currency) {
          setPriceOptions([]);
          return;
        }

        // Get exchange rate (prices in DB are in MAD, convert to selected currency)
        const exchangeRate = currency.exchangeRate || 1.0;

        // Convert all property prices to selected currency
        const prices = allProps.map(p => Math.round(p.price / exchangeRate));
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Generate smart price options
        const options = generatePriceOptions(minPrice, maxPrice, formatPriceAbbreviated);

        setPriceOptions(options);
      } catch (error) {
        console.error('Error loading price options:', error);
        setPriceOptions([]);
      }
    }

    if (!contentLoading && currency) {
      loadPriceOptions();
    }
  }, [contentLoading, currency, formatPriceAbbreviated]);

  useEffect(() => {
    async function loadProperties() {
      try {
        setIsLoading(true);

        // Get filters from URL params
        const location = searchParams.get('location');
        const type = searchParams.get('type');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const status = searchParams.get('status');

        const urlFilters: SearchFilters = {};
        if (location) urlFilters.location = location;
        if (type) urlFilters.type = type;
        if (minPrice) urlFilters.minPrice = minPrice;
        if (maxPrice) urlFilters.maxPrice = maxPrice;
        if (status) urlFilters.status = status;

        setFilters(urlFilters);

        // Get filtered properties from WordPress API
        const results = Object.keys(urlFilters).length > 0
          ? await searchProperties(urlFilters)
          : await getAllProperties();

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
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProperties();
  }, [searchParams, sortBy]);

  const handleFilterChange = async (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    if (!value) delete newFilters[key];

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.append(k, String(v));
    });

    window.history.pushState({}, '', `/properties?${params.toString()}`);
    setFilters(newFilters);

    try {
      setIsLoading(true);
      const results = Object.keys(newFilters).length > 0
        ? await searchProperties(newFilters)
        : await getAllProperties();

      setProperties(results);
    } catch (error) {
      console.error('Error filtering properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = async () => {
    window.history.pushState({}, '', '/properties');
    setFilters({});

    try {
      setIsLoading(true);
      const results = await getAllProperties();
      setProperties(results);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeFilterCount = Object.keys(filters).length;

  // Filter max price options based on min price selection
  const maxPriceOptions = filters.minPrice
    ? priceOptions.filter(opt => opt.value > parseInt(filters.minPrice!))
    : priceOptions;

  // Filter min price options based on max price selection
  const minPriceOptions = filters.maxPrice
    ? priceOptions.filter(opt => opt.value < parseInt(filters.maxPrice!))
    : priceOptions;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {t('properties.title') || 'Discover Properties'}
          </h1>
          <p className="text-xl opacity-90">
            {t('properties.subtitle') || `Browse through ${properties.length} exclusive properties`}
          </p>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">{t('filters.title') || 'Filters'}</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 font-medium"
                  >
                    {t('filters.clearAll') || 'Clear All'}
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('filters.status') || 'Status'}
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 focus:border-transparent outline-none"
                >
                  <option value="">{t('filters.statusAll') || 'All'}</option>
                  <option value="for sale">{t('status.forSale') || 'For Sale'}</option>
                  <option value="for rent">{t('status.forRent') || 'For Rent'}</option>
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('search.location') || 'Location'}
                </label>
                <select
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 focus:border-transparent outline-none"
                >
                  <option value="">{t('search.locationAll') || 'All Locations'}</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('search.type') || 'Property Type'}
                </label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 focus:border-transparent outline-none"
                >
                  <option value="">{t('search.typeAll') || 'All Types'}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.type}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Price Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('filters.minPrice') || 'Min Price'}
                </label>
                <select
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 focus:border-transparent outline-none"
                >
                  <option value="">{t('filters.noMin') || 'No Min'}</option>
                  {minPriceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Price Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('filters.maxPrice') || 'Max Price'}
                </label>
                <select
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 focus:border-transparent outline-none"
                >
                  <option value="">{t('filters.noMax') || 'No Max'}</option>
                  {maxPriceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bedrooms Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('filters.bedrooms') || 'Minimum Bedrooms'}
                </label>
                <select
                  value={filters.bedrooms || ''}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 focus:border-transparent outline-none"
                >
                  <option value="">{t('filters.any') || 'Any'}</option>
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
              <div className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">{properties.length}</span> properties found
                {activeFilterCount > 0 && (
                  <span className="ml-2">
                    ({activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 focus:border-transparent outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Properties Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={`${property.id}-${language}-${currency?.code}`} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4"
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No properties found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors duration-300 font-semibold"
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

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 dark:border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading properties...</p>
        </div>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}
