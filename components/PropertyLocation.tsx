'use client';

import { useTranslation } from '@/contexts/ContentContext';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const PropertyMap = dynamic(() => import('./PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 sm:h-64 md:h-80 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
    </div>
  ),
});

interface PropertyLocationProps {
  location: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export default function PropertyLocation({ location, address, coordinates }: PropertyLocationProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl font-display font-bold mb-3 sm:mb-4 dark:text-white">{t('property.location')}</h2>
      <PropertyMap location={location} address={address} coordinates={coordinates} />
    </div>
  );
}
