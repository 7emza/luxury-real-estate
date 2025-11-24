'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    priceRange: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (filters.location) params.append('location', filters.location);
    if (filters.type) params.append('type', filters.type);
    if (filters.priceRange) params.append('priceRange', filters.priceRange);

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-2xl p-6 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Location</label>
          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 outline-none"
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

        {/* Property Type */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Property Type</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 outline-none"
          >
            <option value="">All Types</option>
            <option value="villa">Villa</option>
            <option value="apartment">Apartment</option>
            <option value="townhouse">Townhouse</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Price Range</label>
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-500 outline-none"
          >
            <option value="">Any Price</option>
            <option value="0-1000000">Under $1M</option>
            <option value="1000000-5000000">$1M - $5M</option>
            <option value="5000000-10000000">$5M - $10M</option>
            <option value="10000000-999999999">Over $10M</option>
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
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
