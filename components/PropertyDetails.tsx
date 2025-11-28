'use client';

import { useTranslation } from '@/contexts/ContentContext';
import { Property } from '@/types/api';

interface PropertyDetailsProps {
  property: Property;
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const { t, language } = useTranslation();

  // Use Tajawal font for Arabic/Darija text to improve readability
  const isArabicLanguage = language === 'ar' || language === 'darija';

  return (
    <>
      {/* Key Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-4 sm:py-6 border-y border-gray-200 dark:border-gray-700">
        <div className="text-center p-2">
          <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{property.bedrooms}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{t('property.bedrooms')}</div>
        </div>
        <div className="text-center p-2">
          <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{property.bathrooms}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{t('property.bathrooms')}</div>
        </div>
        <div className="text-center p-2">
          <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{property.area.toLocaleString()}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{t('property.sqm')}</div>
        </div>
        <div className="text-center p-2">
          <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{property.yearBuilt}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{t('property.yearBuilt')}</div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6 sm:mt-8">
        <h2 className="text-xl sm:text-2xl font-display font-bold mb-3 sm:mb-4 dark:text-white">{t('property.aboutTitle')}</h2>
        <p className={`text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed ${isArabicLanguage ? 'font-arabic' : ''}`}>
          {property.description}
        </p>
      </div>

      {/* Features & Amenities */}
      <div className="mt-6 sm:mt-8">
        <h2 className="text-xl sm:text-2xl font-display font-bold mb-3 sm:mb-4 dark:text-white">{t('property.featuresTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
          {property.features.map((feature, index) => (
            <div key={index} className={`flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 p-2 ${isArabicLanguage ? 'font-arabic' : ''}`}>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="break-words">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
