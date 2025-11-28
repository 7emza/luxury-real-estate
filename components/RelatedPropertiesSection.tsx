'use client';

import { useTranslation } from '@/contexts/ContentContext';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types/api';

interface RelatedPropertiesSectionProps {
  properties: Property[];
}

export default function RelatedPropertiesSection({ properties }: RelatedPropertiesSectionProps) {
  const { t } = useTranslation();

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12 bg-white dark:bg-gray-900">
      <div className="container">
        <h2 className="text-2xl sm:text-3xl font-display font-bold mb-6 sm:mb-8 dark:text-white">
          {t('property.similarProperties')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
