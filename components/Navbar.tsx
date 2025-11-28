'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useTranslation, useContent } from '@/contexts/ContentContext';
import { Skeleton } from '@/components/Skeleton';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
  const { siteSettings, isLoading } = useContent();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll effect - transparent at top, solid when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showLangMenu && !target.closest('.language-selector')) {
        setShowLangMenu(false);
      }
      if (showThemeMenu && !target.closest('.theme-selector')) {
        setShowThemeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLangMenu, showThemeMenu]);

  // Helper to get language display name (use native name from config)
  const getLanguageName = (langCode: string) => {
    const langConfig = availableLanguages.find(l => l.code === langCode);
    return langConfig?.nativeName || langCode;
  };

  // Helper to get theme icon
  const getThemeIcon = (themeValue: string | undefined) => {
    if (themeValue === 'dark') {
      return (
        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    } else if (themeValue === 'light') {
      return (
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      );
    } else {
      // system
      return (
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    }
  };

  return (
    <>
      {/* Backdrop Blur Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white dark:bg-gray-900 shadow-lg'
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-amber-600 dark:text-amber-500">
            {siteSettings?.siteName || 'LuxuryEstates'}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-5 w-16" />
              </>
            ) : (
              <>
                <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                  {t('nav.home')}
                </Link>
                <Link href="/properties" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                  {t('nav.properties')}
                </Link>
                <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                  {t('nav.about')}
                </Link>
                <Link href="/news" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                  {t('nav.news') || 'News'}
                </Link>
                <Link href="/agents" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                  {t('nav.agents') || 'Agents'}
                </Link>
                <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                  {t('nav.contact')}
                </Link>
              </>
            )}

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

            {/* Theme Selector */}
            {mounted && (
              <div className="relative theme-selector">
                <button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label={t('nav.toggleDarkMode')}
                >
                  {getThemeIcon(theme)}
                </button>

                {showThemeMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <button
                      onClick={() => { setTheme('system'); setShowThemeMenu(false); }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                        theme === 'system' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      System
                    </button>
                    <button
                      onClick={() => { setTheme('light'); setShowThemeMenu(false); }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                        theme === 'light' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Light
                    </button>
                    <button
                      onClick={() => { setTheme('dark'); setShowThemeMenu(false); }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                        theme === 'dark' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      Dark
                    </button>
                  </div>
                )}
              </div>
            )}

            {isLoading ? (
              <Skeleton className="h-10 w-28 rounded-lg" />
            ) : (
              <Link href="/properties" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition">
                {t('nav.getStarted')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 focus:outline-none p-2"
              aria-label="Toggle menu"
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
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain">
              {isLoading ? (
                <div className="space-y-2 p-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-14" />
                  <Skeleton className="h-5 w-16" />
                </div>
              ) : (
                <div className="pb-4">
                  {/* Navigation Links */}
                  <div className="py-2 px-2">
                    <Link
                      href="/"
                      className="block py-2.5 px-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.home')}
                    </Link>
                    <Link
                      href="/properties"
                      className="block py-2.5 px-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.properties')}
                    </Link>
                    <Link
                      href="/about"
                      className="block py-2.5 px-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.about')}
                    </Link>
                    <Link
                      href="/news"
                      className="block py-2.5 px-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.news') || 'News'}
                    </Link>
                    <Link
                      href="/agents"
                      className="block py-2.5 px-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.agents') || 'Agents'}
                    </Link>
                    <Link
                      href="/contact"
                      className="block py-2.5 px-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.contact')}
                    </Link>
                  </div>

                  {/* Language & Currency Selector */}
                  {mounted && languageConfig && (
                    <>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                      <div className="py-2 px-2 space-y-3">
                        {/* Language Select */}
                        <div>
                          <label htmlFor="mobile-language" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                            Language
                          </label>
                          <select
                            id="mobile-language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                          >
                            {availableLanguages.map((lang) => (
                              <option key={lang.code} value={lang.code}>
                                {lang.nativeName}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Currency Select */}
                        {availableCurrenciesForLanguage.length > 1 && (
                          <div>
                            <label htmlFor="mobile-currency" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Currency
                            </label>
                            <select
                              id="mobile-currency"
                              value={currency?.code}
                              onChange={(e) => setCurrency(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                            >
                              {availableCurrenciesForLanguage.map((curr) => (
                                <option key={curr.code} value={curr.code}>
                                  {curr.code} - {curr.name} ({curr.symbol})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Theme Selector */}
                  {mounted && (
                    <>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                      <div className="py-2 px-2">
                        <label htmlFor="mobile-theme" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                          Appearance
                        </label>
                        <select
                          id="mobile-theme"
                          value={theme}
                          onChange={(e) => setTheme(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                        >
                          <option value="system">System Default</option>
                          <option value="light">Light Mode</option>
                          <option value="dark">Dark Mode</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Get Started Button */}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1.5"></div>
                  <div className="py-2 px-2">
                    <Link
                      href="/properties"
                      className="block w-full text-center bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg transition font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.getStarted')}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
}
