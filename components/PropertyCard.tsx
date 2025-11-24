import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              property.status === 'For Sale'
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white'
            }`}>
              {property.status}
            </span>
          </div>
          {property.luxury && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-amber-600 text-white">
                Luxury
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition">
              {property.title}
            </h3>
          </div>

          <div className="flex items-center text-gray-600 mb-4">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">{property.location}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
            <div className="text-center">
              <div className="text-sm text-gray-600">Bedrooms</div>
              <div className="font-semibold text-gray-900">{property.bedrooms}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Bathrooms</div>
              <div className="font-semibold text-gray-900">{property.bathrooms}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Sq Ft</div>
              <div className="font-semibold text-gray-900">{property.area.toLocaleString()}</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-amber-600">
                {formatPrice(property.price)}
              </div>
              {property.pricePerMonth && (
                <div className="text-sm text-gray-600">
                  {formatPrice(property.pricePerMonth)}/month
                </div>
              )}
            </div>
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
              {property.type}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
