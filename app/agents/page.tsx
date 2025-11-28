'use client';

import { useState, useEffect } from 'react';
import { useContent } from '@/contexts/ContentContext';
import Image from 'next/image';
import Link from 'next/link';

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  position: string;
  bio: string;
  license: string;
  experience: string;
  languages: string;
  image: string;
  social: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  active: boolean;
  propertyCount: number;
}

export default function AgentsPage() {
  const { t, isLoading: contentLoading } = useContent();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('https://wordpress.7emza.ma/wp-json/api/v1/agents');
        const data = await response.json();
        if (data.success && data.data) {
          setAgents(data.data.filter((agent: Agent) => agent.active));
        }
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const filteredAgents = filter === 'all'
    ? agents
    : agents.filter(agent => {
        const exp = parseInt(agent.experience);
        if (filter === 'senior') return exp >= 7;
        if (filter === 'mid') return exp >= 3 && exp < 7;
        if (filter === 'junior') return exp < 3;
        return true;
      });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
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
                  {t('agents.title') || 'Meet Our Team'}
                </h1>
                <p className="text-xl opacity-90">
                  {t('agents.subtitle') || 'Expert real estate consultants dedicated to finding your perfect property'}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-6">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-wrap gap-3 items-center">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-28 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2">
                {t('agents.filterBy') || 'Filter by experience:'}
              </span>
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {t('agents.filterAll') || 'All Agents'} ({agents.length})
              </button>
              <button
                onClick={() => setFilter('senior')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'senior'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {t('agents.filterSenior') || 'Senior'} (7+ years)
              </button>
              <button
                onClick={() => setFilter('mid')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'mid'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {t('agents.filterMid') || 'Mid-Level'} (3-6 years)
              </button>
              <button
                onClick={() => setFilter('junior')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'junior'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {t('agents.filterJunior') || 'Junior'} (&lt;3 years)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Results count */}
          {!loading && !error && (
            <div className="mb-8">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">{filteredAgents.length}</span> {t('agents.agentsFound') || 'agents found'}
              </p>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                  <div className="animate-pulse">
                    <div className="h-72 bg-gray-200 dark:bg-gray-800" />
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded flex-1" />
                        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded flex-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('agents.error') || 'Unable to load agents'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('agents.errorDescription') || 'Please try again later'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
              >
                {t('agents.retry') || 'Try Again'}
              </button>
            </div>
          ) : filteredAgents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAgents.map((agent) => (
                <article key={agent.id} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
                  {/* Agent Photo */}
                  <div className="relative h-80 overflow-hidden">
                    {agent.image ? (
                      <Image
                        src={agent.image}
                        alt={agent.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                        <svg className="w-24 h-24 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    )}
                    {/* Experience Badge */}
                    <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {agent.experience} {t('agents.years') || 'years'}
                    </div>
                  </div>

                  {/* Agent Info */}
                  <div className="p-6">
                    <h2 className="text-2xl font-display font-bold mb-1 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                      {agent.name}
                    </h2>
                    <p className="text-amber-600 dark:text-amber-500 font-semibold mb-3">
                      {agent.position}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {agent.bio}
                    </p>

                    {/* Details */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <span className="truncate">{agent.languages}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="truncate">{t('agents.license') || 'License'}: {agent.license}</span>
                      </div>
                    </div>

                    {/* Contact Buttons */}
                    <div className="flex gap-2">
                      <a
                        href={`tel:${agent.phone}`}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center text-sm"
                      >
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {t('agents.call') || 'Call'}
                      </a>
                      <a
                        href={`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center text-sm"
                      >
                        <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        {t('agents.whatsapp') || 'WhatsApp'}
                      </a>
                    </div>

                    <a
                      href={`mailto:${agent.email}`}
                      className="block w-full mt-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors text-center text-sm"
                    >
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {t('agents.email') || 'Email'}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-12 text-center">
              <svg
                className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('agents.noAgents') || 'No agents found'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('agents.tryDifferentFilter') || 'Try adjusting your filter'}
              </p>
              <button
                onClick={() => setFilter('all')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
              >
                {t('agents.showAll') || 'Show All Agents'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 dark:text-white">
            {t('agents.cta.title') || 'Need Help Finding the Right Agent?'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {t('agents.cta.subtitle') || 'Contact us and we\'ll match you with the perfect consultant for your needs'}
          </p>
          <Link
            href="/contact"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
          >
            {t('agents.cta.button') || 'Contact Us'}
          </Link>
        </div>
      </section>
    </div>
  );
}
