'use client';

import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { useTranslation, useContent } from '@/contexts/ContentContext';
import {
  PropertyCardSkeleton,
  Skeleton,
  TestimonialSkeleton,
} from '@/components/Skeleton';

export default function Home() {
  const { t, language, currency } = useTranslation();
  const { features, categories, cities, testimonials, featuredProperties, siteSettings, isLoading } = useContent();

  // Get hero background image from WordPress or fallback to Unsplash
  const heroImage = siteSettings?.heroBackgroundImage || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920";

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-950 dark:to-black">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Luxury Property"
            fill
            className="object-cover opacity-40 dark:opacity-30"
            priority
          />
        </div>

        <div className="container relative z-10 text-center text-white py-20">
          {isLoading ? (
            <>
              <div className="mb-6 animate-fade-in-down">
                <Skeleton className="h-16 md:h-20 w-3/4 mx-auto bg-white/20 rounded-lg" />
              </div>
              <div className="mb-12 animate-fade-in-up animate-delay-200">
                <Skeleton className="h-6 md:h-8 w-2/3 mx-auto bg-white/20 rounded-lg" />
              </div>
              <div className="max-w-5xl mx-auto animate-fade-in-up animate-delay-400">
                <Skeleton className="h-32 w-full bg-white/10 rounded-2xl" />
              </div>
            </>
          ) : (
            <>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-fade-in-down">
                {t('hero.title')} <span className="text-amber-600 dark:text-amber-500">{t('hero.titleHighlight')}</span> {t('hero.titleSuffix')}
              </h1>
              <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 animate-fade-in-up animate-delay-200">
                {t('hero.subtitle')}
              </p>
              <div className="max-w-5xl mx-auto animate-fade-in-up animate-delay-400">
                <SearchBar />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="container">
          <div className="text-center mb-12">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-32 mx-auto mb-2" />
                <Skeleton className="h-12 w-64 mx-auto mb-4" />
                <Skeleton className="h-6 w-96 max-w-full mx-auto" />
              </>
            ) : (
              <>
                <div className="text-amber-600 dark:text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">
                  {t('featured.label')}
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 dark:text-white">
                  {t('featured.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                  {t('featured.description')}
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {isLoading ? (
              <>
                <PropertyCardSkeleton />
                <PropertyCardSkeleton />
                <PropertyCardSkeleton />
              </>
            ) : (
              featuredProperties.map((property) => (
                <PropertyCard key={`${property.id}-${language}-${currency?.code}`} property={property} />
              ))
            )}
          </div>

          <div className="text-center">
            {isLoading ? (
              <Skeleton className="h-14 w-40 mx-auto rounded-lg" />
            ) : (
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 bg-gray-900 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-700 text-white px-8 py-4 rounded-lg transition-colors duration-300 font-semibold"
              >
                {t('common.viewAll')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Luxury Categories */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-28 mx-auto mb-2" />
                <Skeleton className="h-12 w-56 mx-auto" />
              </>
            ) : (
              <>
                <div className="text-amber-600 dark:text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">
                  {t('categories.label')}
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold dark:text-white">
                  {t('categories.title')}
                </h2>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="relative h-64 rounded-xl overflow-hidden">
                  <Skeleton className="h-full w-full rounded-xl" />
                </div>
              ))
            ) : (
              categories.map((category) => (
                <Link
                  key={category.type}
                  href={`/properties?type=${category.type}`}
                  className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  {category.image && category.image.length > 0 ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-display font-bold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.count} {t('common.properties')}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="container">
          <div className="text-center mb-12">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-32 mx-auto mb-2" />
                <Skeleton className="h-12 w-48 mx-auto" />
              </>
            ) : (
              <>
                <div className="text-amber-600 dark:text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">
                  {t('locations.label')}
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold dark:text-white">
                  {t('locations.title')}
                </h2>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="relative h-48 rounded-xl overflow-hidden">
                  <Skeleton className="h-full w-full rounded-xl" />
                </div>
              ))
            ) : (
              cities.filter(city => city.image && city.image.length > 0).slice(0, 4).map((city) => (
                <Link
                  key={city.name}
                  href={`/properties?location=${city.name}`}
                  className="group relative h-48 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-display font-bold">{city.name}</h3>
                    <p className="text-sm opacity-90">{city.properties} {t('common.properties')}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-28 mx-auto mb-2" />
                <Skeleton className="h-12 w-52 mx-auto" />
              </>
            ) : (
              <>
                <div className="text-amber-600 dark:text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">
                  {t('features.label')}
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold dark:text-white">
                  {t('features.title')}
                </h2>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="text-center p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                  <Skeleton className="w-20 h-20 rounded-full mx-auto mb-6" />
                  <Skeleton className="h-6 w-40 mx-auto mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>
              ))
            ) : (
            features.map((feature, index) => {
              const iconMap: Record<string, React.ReactElement> = {
                shield: (
                  <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                dollar: (
                  <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                support: (
                  <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
              };
              return (
              <div key={feature.id} className="text-center p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  {iconMap[feature.icon] || iconMap.shield}
                </div>
                <h3 className="text-xl font-display font-bold mb-3 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            );
            })
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900 dark:bg-black text-white">
        <div className="container">
          <div className="text-center mb-12">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-28 mx-auto mb-2 bg-white/20" />
                <Skeleton className="h-12 w-64 mx-auto bg-white/20" />
              </>
            ) : (
              <>
                <div className="text-amber-600 dark:text-amber-500 text-sm font-semibold uppercase tracking-wider mb-2">
                  {t('testimonials.label')}
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold">
                  {t('testimonials.title')}
                </h2>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Skeleton key={s} className="h-5 w-5 bg-white/20" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-full mb-2 bg-white/20" />
                  <Skeleton className="h-4 w-full mb-2 bg-white/20" />
                  <Skeleton className="h-4 w-3/4 mb-6 bg-white/20" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full bg-white/20" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1 bg-white/20" />
                      <Skeleton className="h-3 w-20 bg-white/20" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/15 transition-colors duration-300">
                  <div className="flex gap-1 mb-4">
                    {Array(testimonial.rating).fill('').map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm opacity-75">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-amber-600 dark:bg-amber-700 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            {isLoading ? (
              <>
                <Skeleton className="h-10 w-72 mx-auto mb-4 bg-white/20" />
                <Skeleton className="h-6 w-96 max-w-full mx-auto mb-8 bg-white/20" />
                <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                  <Skeleton className="flex-1 h-14 rounded-lg bg-white/30" />
                  <Skeleton className="h-14 w-32 rounded-lg bg-gray-900/50" />
                </div>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-display font-bold mb-4">{t('newsletter.title')}</h2>
                <p className="text-xl mb-8 opacity-95">
                  {t('newsletter.description')}
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                  <input
                    type="email"
                    placeholder={t('newsletter.placeholder')}
                    className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:ring-2 focus:ring-white outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg transition-colors duration-300 font-semibold whitespace-nowrap"
                  >
                    {t('newsletter.cta')}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
