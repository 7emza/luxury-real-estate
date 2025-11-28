import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getPropertyById, getAllProperties } from '@/lib/api';
import ImageGallery from '@/components/ImageGallery';
import { PriceDisplay } from '@/components/PriceDisplay';
import PropertyContactForm from '@/components/PropertyContactForm';
import PropertyDetails from '@/components/PropertyDetails';
import PropertyBreadcrumb from '@/components/PropertyBreadcrumb';
import PropertyLocation from '@/components/PropertyLocation';
import RelatedPropertiesSection from '@/components/RelatedPropertiesSection';
import PropertyTitle from '@/components/PropertyTitle';

export async function generateStaticParams() {
  const properties = await getAllProperties();
  return properties.map((property) => ({
    id: property.id.toString(),
  }));
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Get language and currency from cookies
  const cookieStore = await cookies();
  const lang = cookieStore.get('language')?.value || 'en';
  const currency = cookieStore.get('currencyCode')?.value || 'MAD';

  // Fetch property with language and currency
  const property = await getPropertyById(parseInt(id), lang, currency);

  if (!property) {
    notFound();
  }

  // Get related properties with same language/currency
  const allProperties = await getAllProperties(lang, currency);
  const relatedProperties = allProperties
    .filter(p => p.type === property.type && p.id !== property.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Breadcrumb */}
      <PropertyBreadcrumb title={property.title} />

      {/* Image Gallery with Lightbox */}
      <section className="bg-white dark:bg-gray-900">
        <div className="container py-8">
          <ImageGallery images={property.images} title={property.title} />
        </div>
      </section>

      {/* Property Details */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <PropertyTitle title={property.title} />
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="break-words">{property.address}</span>
                    </div>
                  </div>
                  <div className="sm:text-right flex-shrink-0">
                    <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-500 mb-1">
                      <PriceDisplay price={property.price} prices={property.prices} priceType="price" />
                    </div>
                    {(property.pricePerMonth || (property.prices && Object.keys(property.prices).length > 0)) && (
                      <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        <PriceDisplay price={property.pricePerMonth} prices={property.prices} priceType="rent" />/month
                      </div>
                    )}
                    <span className={`inline-block mt-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                      property.status === 'For Sale'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                </div>

                {/* Property Details with Translations */}
                <PropertyDetails property={property} />
              </div>

              {/* Map */}
              <PropertyLocation
                location={property.location}
                address={property.address}
                coordinates={property.coordinates}
              />
            </div>

            {/* Sidebar - Agent Contact */}
            <div className="lg:col-span-1">
              <PropertyContactForm
                propertyId={property.id}
                propertyTitle={property.title}
                agent={property.agent}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related Properties */}
      <RelatedPropertiesSection properties={relatedProperties} />
    </div>
  );
}
