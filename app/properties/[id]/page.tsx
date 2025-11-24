import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPropertyById, getAllProperties } from '@/lib/data';
import PropertyCard from '@/components/PropertyCard';

export function generateStaticParams() {
  const properties = getAllProperties();
  return properties.map((property) => ({
    id: property.id.toString(),
  }));
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = getPropertyById(parseInt(params.id));

  if (!property) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get related properties
  const relatedProperties = getAllProperties()
    .filter(p => p.type === property.type && p.id !== property.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-amber-600">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-amber-600">Properties</Link>
            <span>/</span>
            <span className="text-gray-900">{property.title}</span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <section className="bg-white">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-[500px] rounded-xl overflow-hidden">
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {property.images.slice(1, 3).map((image, index) => (
                <div key={index} className="relative h-[240px] rounded-xl overflow-hidden">
                  <Image
                    src={image}
                    alt={`${property.title} - ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              {property.images.length > 3 && (
                <div className="relative h-[240px] rounded-xl overflow-hidden group cursor-pointer">
                  <Image
                    src={property.images[3] || property.images[0]}
                    alt={`${property.title} - More`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div className="text-lg font-semibold">+{property.images.length - 3} More</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <div className="flex flex-wrap items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-4">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{property.address}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-amber-600 mb-1">
                      {formatPrice(property.price)}
                    </div>
                    {property.pricePerMonth && (
                      <div className="text-gray-600">
                        {formatPrice(property.pricePerMonth)}/month
                      </div>
                    )}
                    <span className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      property.status === 'For Sale'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{property.area.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Sq Ft</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{property.yearBuilt}</div>
                    <div className="text-sm text-gray-600">Year Built</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-8">
                  <h2 className="text-2xl font-display font-bold mb-4">About this property</h2>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>

                {/* Features & Amenities */}
                <div className="mt-8">
                  <h2 className="text-2xl font-display font-bold mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-gray-700">
                        <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-display font-bold mb-4">Location</h2>
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p>Map View - {property.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Agent Contact */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-4">Contact Agent</h3>
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src={property.agent.image}
                    alt={property.agent.name}
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-lg">{property.agent.name}</div>
                    <div className="text-sm text-gray-600">Property Consultant</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-amber-600 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{property.agent.phone}</span>
                  </a>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-amber-600 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{property.agent.email}</span>
                  </a>
                </div>

                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
                  />
                  <textarea
                    rows={4}
                    placeholder="Message"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
                    defaultValue={`I'm interested in ${property.title}`}
                  />
                  <button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Properties */}
      {relatedProperties.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container">
            <h2 className="text-3xl font-display font-bold mb-8">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProperties.map((relatedProperty) => (
                <PropertyCard key={relatedProperty.id} property={relatedProperty} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
