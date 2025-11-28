'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation, useContent } from '@/contexts/ContentContext';
import { Skeleton } from '@/components/Skeleton';
import { getAllProperties } from '@/lib/api';
import { generatePriceOptions, PriceOption } from '@/lib/priceUtils';

export default function SearchBar() {
  const router = useRouter();
  const { t, formatPriceAbbreviated, currency } = useTranslation();
  const { isLoading, cities, categories } = useContent();
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    minPrice: '',
    maxPrice: '',
  });
  const [priceOptions, setPriceOptions] = useState<PriceOption[]>([]);

  // Generate dynamic price options from actual properties
  useEffect(() => {
    async function loadPriceOptions() {
      try {
        const properties = await getAllProperties();

        if (properties.length === 0 || !currency) {
          setPriceOptions([]);
          return;
        }

        // Get exchange rate (prices in DB are in MAD, convert to selected currency)
        const exchangeRate = currency.exchangeRate || 1.0;

        // Convert all property prices to selected currency
        const prices = properties.map(p => Math.round(p.price / exchangeRate));
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

    if (!isLoading && currency) {
      loadPriceOptions();
    }
  }, [isLoading, currency, formatPriceAbbreviated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (filters.location) params.append('location', filters.location);
    if (filters.type) params.append('type', filters.type);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

    router.push(`/properties?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white/10 dark:bg-black/50 backdrop-blur-md rounded-2xl p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <Skeleton className="h-4 w-20 mb-2 bg-white/20" />
            <Skeleton className="h-12 w-full bg-white/30" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-2 bg-white/20" />
            <Skeleton className="h-12 w-full bg-white/30" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2 bg-white/20" />
            <Skeleton className="h-12 w-full bg-white/30" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2 bg-white/20" />
            <Skeleton className="h-12 w-full bg-white/30" />
          </div>
          <div className="flex items-end">
            <Skeleton className="h-12 w-full bg-amber-600/50" />
          </div>
        </div>
      </div>
    );
  }

  // Filter max price options based on min price selection
  const maxPriceOptions = filters.minPrice
    ? priceOptions.filter(opt => opt.value > parseInt(filters.minPrice))
    : priceOptions;

  // Filter min price options based on max price selection
  const minPriceOptions = filters.maxPrice
    ? priceOptions.filter(opt => opt.value < parseInt(filters.maxPrice))
    : priceOptions;

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 dark:bg-black/50 backdrop-blur-md rounded-2xl p-6 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Location */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">{t('search.location')}</label>
          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 outline-none"
          >
            <option value="">{t('search.locationAll')}</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">{t('search.type')}</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 outline-none"
          >
            <option value="">{t('search.typeAll')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.type}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">{t('filters.minPrice')}</label>
          <select
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 outline-none"
          >
            <option value="">{t('filters.noMin')}</option>
            {minPriceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">{t('filters.maxPrice')}</label>
          <select
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 outline-none"
          >
            <option value="">{t('filters.noMax')}</option>
            {maxPriceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {t('common.search')}
          </button>
        </div>
      </div>
    </form>
  );
}
