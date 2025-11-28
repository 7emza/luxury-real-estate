'use client';

import { useContent } from '@/contexts/ContentContext';
import Image from 'next/image';

export default function AboutPage() {
  const { t, features, isLoading: contentLoading } = useContent();

  const stats = [
    { number: '500+', label: t('about.stats.properties') || 'Properties Sold' },
    { number: '15+', label: t('about.stats.years') || 'Years Experience' },
    { number: '98%', label: t('about.stats.satisfaction') || 'Client Satisfaction' },
    { number: '50+', label: t('about.stats.agents') || 'Expert Agents' },
  ];

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: t('about.values.integrity.title') || 'Integrity',
      description: t('about.values.integrity.description') || 'We maintain the highest standards of honesty and transparency in all our dealings.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: t('about.values.excellence.title') || 'Excellence',
      description: t('about.values.excellence.description') || 'We strive for perfection in every property and service we offer.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: t('about.values.client.title') || 'Client-Focused',
      description: t('about.values.client.description') || 'Your satisfaction and success are at the heart of everything we do.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: t('about.values.innovation.title') || 'Innovation',
      description: t('about.values.innovation.description') || 'We embrace cutting-edge technology to enhance your property experience.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            {contentLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-gray-700 rounded w-3/4"></div>
                <div className="h-6 bg-gray-700 rounded w-full"></div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                  {t('about.hero.title') || 'About LuxuryEstates'}
                </h1>
                <p className="text-xl opacity-90">
                  {t('about.hero.subtitle') || 'Your trusted partner in luxury real estate across Morocco'}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-amber-600 dark:text-amber-500 text-sm font-semibold uppercase tracking-wider mb-4">
                {t('about.story.label') || 'OUR STORY'}
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 dark:text-white">
                {t('about.story.title') || 'Building Dreams Since 2008'}
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  {t('about.story.p1') || 'Founded in 2008, LuxuryEstates has established itself as Morocco\'s premier luxury real estate agency. We specialize in connecting discerning clients with exceptional properties in the most prestigious locations.'}
                </p>
                <p>
                  {t('about.story.p2') || 'Our team of experienced professionals brings together deep local knowledge, international expertise, and a passion for excellence. We understand that buying or selling a luxury property is more than a transaction—it\'s a life-changing decision.'}
                </p>
                <p>
                  {t('about.story.p3') || 'With a portfolio spanning across Marrakech, Casablanca, Rabat, and other prime Moroccan cities, we offer unparalleled access to the finest residences, from contemporary penthouses to traditional riads.'}
                </p>
              </div>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
                alt="Luxury Property"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-amber-600 dark:text-amber-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="text-amber-600 dark:text-amber-500 text-sm font-semibold uppercase tracking-wider mb-4">
              {t('about.values.label') || 'OUR VALUES'}
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold dark:text-white">
              {t('about.values.title') || 'What We Stand For'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-display font-bold mb-3 dark:text-white">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us (using features from WordPress) */}
      {features && features.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="text-amber-600 dark:text-amber-500 text-sm font-semibold uppercase tracking-wider mb-4">
                {t('features.label') || 'WHY CHOOSE US'}
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold dark:text-white">
                {t('features.title') || 'Our Advantages'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div key={feature.id} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
                  {feature.icon && (
                    <div className="w-16 h-16 mb-4 relative">
                      <Image
                        src={feature.icon}
                        alt={feature.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-display font-bold mb-3 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 dark:text-white">
            {t('about.cta.title') || 'Ready to Find Your Dream Home?'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {t('about.cta.subtitle') || 'Let our expert team guide you through every step of your luxury property journey'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/properties"
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              {t('about.cta.browse') || 'Browse Properties'}
            </a>
            <a
              href="/contact"
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              {t('about.cta.contact') || 'Contact Us'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
