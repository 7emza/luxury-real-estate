'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useTranslation, useContent } from '@/contexts/ContentContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { siteSettings } = useContent();

  const isHomePage = pathname === '/';

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // On home page: fully transparent when at top, glass effect when scrolled
  // On other pages: always solid
  const navClasses = isHomePage
    ? scrolled
      ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
      : 'bg-transparent'
    : 'bg-white dark:bg-gray-900 shadow-md';

  // Text colors: white when transparent on home, dark otherwise
  const textClasses = isHomePage && !scrolled
    ? 'text-white'
    : 'text-gray-700 dark:text-gray-300';

  const logoClasses = isHomePage && !scrolled
    ? 'text-white'
    : 'text-amber-600 dark:text-amber-500';

  const hoverClasses = isHomePage && !scrolled
    ? 'hover:text-amber-300'
    : 'hover:text-amber-600 dark:hover:text-amber-500';

  const buttonBgClasses = isHomePage && !scrolled
    ? 'bg-white/20 dark:bg-white/10 backdrop-blur-sm'
    : 'bg-gray-100 dark:bg-gray-800';

  const mobileBtnClasses = isHomePage && !scrolled
    ? 'text-white'
    : 'text-gray-700 dark:text-gray-300';

  const moonIconClasses = isHomePage && !scrolled
    ? 'text-white'
    : 'text-gray-700 dark:text-gray-300';

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${navClasses}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className={`text-2xl font-bold transition-colors duration-300 ${logoClasses}`}>
            {siteSettings?.siteName || 'LuxuryEstates'}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`transition-colors duration-300 ${textClasses} ${hoverClasses}`}>
              {t('nav.home')}
            </Link>
            <Link href="/properties" className={`transition-colors duration-300 ${textClasses} ${hoverClasses}`}>
              {t('nav.properties')}
            </Link>
            <Link href="/about" className={`transition-colors duration-300 ${textClasses} ${hoverClasses}`}>
              {t('nav.about')}
            </Link>
            <Link href="/contact" className={`transition-colors duration-300 ${textClasses} ${hoverClasses}`}>
              {t('nav.contact')}
            </Link>

            {/* Dark Mode Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-lg transition-colors duration-300 ${buttonBgClasses} hover:bg-gray-200 dark:hover:bg-gray-700`}
                aria-label={t('nav.toggleDarkMode')}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className={`w-5 h-5 ${moonIconClasses}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}

            <Link href="/properties" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition">
              {t('nav.getStarted')}
            </Link>
          </div>

          {/* Mobile Menu Button & Dark Mode Toggle */}
          <div className="md:hidden flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-lg transition-colors duration-300 ${buttonBgClasses} hover:bg-gray-200 dark:hover:bg-gray-700`}
                aria-label={t('nav.toggleDarkMode')}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className={`w-5 h-5 ${moonIconClasses}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none transition-colors duration-300 ${mobileBtnClasses}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-700 mt-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
            <Link href="/" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
              {t('nav.home')}
            </Link>
            <Link href="/properties" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
              {t('nav.properties')}
            </Link>
            <Link href="/about" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
              {t('nav.about')}
            </Link>
            <Link href="/contact" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
              {t('nav.contact')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
