'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useContent } from '@/contexts/ContentContext';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  image: string;
  categories: { id: number; name: string; slug: string }[];
  author: { id: string; name: string; avatar: string };
  date: string;
  readTime: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t, language, isLoading: contentLoading } = useContent();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // First get all posts to find the one with matching slug (with language)
        const response = await fetch(`https://wordpress.7emza.ma/wp-json/api/v1/blog?lang=${language}`);
        const data = await response.json();

        if (data.success && data.data) {
          const foundPost = data.data.find((p: BlogPost) => p.slug === slug);

          if (foundPost) {
            // Now fetch the full post with content (with language)
            const postResponse = await fetch(`https://wordpress.7emza.ma/wp-json/api/v1/blog/${foundPost.id}?lang=${language}`);
            const postData = await postResponse.json();

            if (postData.success && postData.data) {
              setPost(postData.data);
            } else {
              setError(true);
            }
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug, language]); // Re-fetch when language changes

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
    if (typeof window === 'undefined') return html;
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Skeleton */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto animate-pulse space-y-4">
              <div className="h-6 bg-gray-700 rounded w-32"></div>
              <div className="h-12 bg-gray-700 rounded w-3/4"></div>
              <div className="h-6 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </section>

        {/* Content Skeleton */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
            {t('news.postNotFound') || 'Article Not Found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t('news.postNotFoundDescription') || 'The article you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <Link
            href="/news"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {t('news.backToNews') || 'Back to News'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    {t('nav.home') || 'Home'}
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/news" className="hover:text-white transition-colors">
                    {t('nav.news') || 'News'}
                  </Link>
                </li>
                <li>/</li>
                <li className="text-amber-500 truncate max-w-xs">
                  {decodeHtml(post.title)}
                </li>
              </ol>
            </nav>

            {/* Category */}
            {post.categories.length > 0 && (
              <div className="mb-4">
                <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {post.categories[0].name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
              {decodeHtml(post.title)}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-gray-400">
              <span>{formatDate(post.date)}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.image && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative h-64 md:h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={post.image}
                  alt={decodeHtml(post.title)}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <article className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 md:p-12">
              <div
                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-display prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed
                  prose-a:text-amber-600 dark:prose-a:text-amber-500 prose-a:no-underline hover:prose-a:underline
                  prose-ul:list-disc prose-ul:pl-6
                  prose-li:text-gray-600 dark:prose-li:text-gray-400
                  prose-strong:text-gray-900 dark:prose-strong:text-white"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* Share & Back */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link
                href="/news"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('news.backToNews') || 'Back to News'}
              </Link>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">{t('news.share') || 'Share'}:</span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(decodeHtml(post.title))}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&title=${encodeURIComponent(decodeHtml(post.title))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
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
