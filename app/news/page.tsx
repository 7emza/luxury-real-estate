'use client';

import { useState, useEffect } from 'react';
import { useContent } from '@/contexts/ContentContext';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  image: string;
  categories: { id: number; name: string; slug: string }[];
  author: { id: string; name: string; avatar: string };
  date: string;
  readTime: string;
}

export default function NewsPage() {
  const { t, language, isLoading: contentLoading } = useContent();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>(['all']);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Pass language parameter to get language-specific content
        const response = await fetch(`https://wordpress.7emza.ma/wp-json/api/v1/blog?lang=${language}`);
        const data = await response.json();
        if (data.success && data.data) {
          setPosts(data.data);
          // Extract unique categories from posts
          const allCategories = data.data.flatMap((post: BlogPost) =>
            post.categories.map(cat => cat.name)
          );
          const uniqueCategories = Array.from(new Set(allCategories)) as string[];
          setCategories(['all', ...uniqueCategories]);
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [language]); // Re-fetch when language changes

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.categories.some(cat => cat.name === selectedCategory));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Decode HTML entities
  const decodeHtml = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

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
                  {t('news.title') || 'News & Insights'}
                </h1>
                <p className="text-xl opacity-90">
                  {t('news.subtitle') || 'Stay updated with the latest trends and insights in luxury real estate'}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-wrap gap-3 justify-center">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {category === 'all' ? (t('news.allCategories') || 'All') : category}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Results count */}
          {!loading && !error && (
            <div className="mb-8">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">{filteredPosts.length}</span>{' '}
                {t('news.articlesFound') || 'articles found'}
              </p>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                  <div className="animate-pulse">
                    <div className="h-56 bg-gray-200 dark:bg-gray-800" />
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
                      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
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
                {t('news.error') || 'Unable to load articles'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('news.errorDescription') || 'Please try again later'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
              >
                {t('news.retry') || 'Try Again'}
              </button>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
                  <Link href={`/news/${post.slug}`}>
                    <div className="relative h-56 overflow-hidden">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={decodeHtml(post.title)}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                          <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                      {post.categories.length > 0 && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {post.categories[0].name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span>{formatDate(post.date)}</span>
                        <span className="mx-2">•</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h2 className="text-xl font-display font-bold mb-3 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors line-clamp-2">
                        {decodeHtml(post.title)}
                      </h2>

                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 text-sm">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center text-amber-600 dark:text-amber-500 font-semibold text-sm">
                        <span>{t('news.readMore') || 'Read More'}</span>
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('news.noPosts') || 'No articles found'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('news.noPostsDescription') || 'No articles in this category yet'}
              </p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
              >
                {t('news.showAll') || 'Show All Articles'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 dark:text-white">
            {t('news.cta.title') || 'Stay Informed'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {t('news.cta.subtitle') || 'Subscribe to our newsletter for the latest market insights and property updates'}
          </p>
          <Link
            href="/contact"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
          >
            {t('news.cta.button') || 'Subscribe Now'}
          </Link>
        </div>
      </section>
    </div>
  );
}
