'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useTranslation, useContent } from '@/contexts/ContentContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { theme, setTheme } = useTheme();
  const {
    t,
    language,
    setLanguage,
    languageConfig,
    availableLanguages,
    currency,
    setCurrency,
    availableCurrenciesForLanguage,
  } = useTranslation();
  const { siteSettings } = useContent();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLangMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('.language-selector')) {
          setShowLangMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLangMenu]);

  // Helper to get language display name (use native name from config)
  const getLanguageName = (langCode: string) => {
    const langConfig = availableLanguages.find(l => l.code === langCode);
    return langConfig?.nativeName || langCode;
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-amber-600 dark:text-amber-500">
            {siteSettings?.siteName || 'LuxuryEstates'}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
              {t('nav.home')}
            </Link>
            <Link href="/properties" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
              {t('nav.properties')}
            </Link>
            <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
              {t('nav.about')}
            </Link>
            <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
              {t('nav.contact')}
            </Link>

            {/* Language & Currency Selector */}
            {mounted && languageConfig && (
              <div className="relative language-selector">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Change language or currency"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                    {getLanguageName(language)} • {currency?.code}
                  </span>
                  <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showLangMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 max-h-96 overflow-y-auto">
                    {/* Language Section */}
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Language
                    </div>
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          language === lang.code ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {lang.nativeName}
                        {language === lang.code && (
                          <svg className="w-4 h-4 inline ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}

                    {/* Currency Section */}
                    {availableCurrenciesForLanguage.length > 0 && (
                      <>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                          Currency
                        </div>
                        {availableCurrenciesForLanguage.map((curr) => (
                          <button
                            key={curr.code}
                            onClick={() => {
                              setCurrency(curr.code);
                              setShowLangMenu(false);
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              currency?.code === curr.code ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500' : 'text-gray-700 dark:text-gray-300'
                            }`}
                            disabled={availableCurrenciesForLanguage.length === 1}
                          >
                            <span className="font-medium">{curr.code}</span> - {curr.name}
                            <span className="text-xs ml-1">({curr.symbol})</span>
                            {currency?.code === curr.code && (
                              <svg className="w-4 h-4 inline ml-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Dark Mode Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={t('nav.toggleDarkMode')}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}

            <Link href="/properties" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition">
              {t('nav.getStarted')}
            </Link>
          </div>

          {/* Mobile Menu Button & Toggle Buttons */}
          <div className="md:hidden flex items-center gap-3">
            {mounted && languageConfig && (
              <>
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors language-selector"
                  aria-label="Change language or currency"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </button>

                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label={t('nav.toggleDarkMode')}
                >
                  {theme === 'dark' ? (
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 focus:outline-none"
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
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-700 mt-2">
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
