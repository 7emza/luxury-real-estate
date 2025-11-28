'use client';

import Link from 'next/link';
import { useTranslation, useContent } from '@/contexts/ContentContext';
import { Skeleton } from '@/components/Skeleton';

export default function Footer() {
  const { t } = useTranslation();
  const { siteSettings, isLoading } = useContent();
  return (
    <footer className="bg-gray-900 dark:bg-black text-white border-t border-gray-800 dark:border-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-amber-600 dark:text-amber-500 mb-4">{siteSettings?.siteName || 'LuxuryEstates'}</h3>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-4 w-3/4 bg-gray-700" />
              </div>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 mb-4">
                {t('footer.about')}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            {isLoading ? (
              <Skeleton className="h-6 w-28 mb-4 bg-gray-700" />
            ) : (
              <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
            )}
            <ul className="space-y-2">
              {isLoading ? (
                <>
                  <li><Skeleton className="h-4 w-16 bg-gray-700" /></li>
                  <li><Skeleton className="h-4 w-20 bg-gray-700" /></li>
                  <li><Skeleton className="h-4 w-14 bg-gray-700" /></li>
                  <li><Skeleton className="h-4 w-16 bg-gray-700" /></li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/" className="text-gray-400 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-500 transition">
                      {t('nav.home')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/properties" className="text-gray-400 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-500 transition">
                      {t('nav.properties')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-gray-400 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-500 transition">
                      {t('nav.about')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-gray-400 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-500 transition">
                      {t('nav.contact')}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            {isLoading ? (
              <Skeleton className="h-6 w-32 mb-4 bg-gray-700" />
            ) : (
              <h4 className="text-lg font-semibold mb-4">{t('footer.propertyTypes')}</h4>
            )}
            <ul className="space-y-2">
              {isLoading ? (
                <>
                  <li><Skeleton className="h-4 w-14 bg-gray-700" /></li>
                  <li><Skeleton className="h-4 w-20 bg-gray-700" /></li>
                  <li><Skeleton className="h-4 w-24 bg-gray-700" /></li>
                  <li><Skeleton className="h-4 w-22 bg-gray-700" /></li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/properties?type=villa" className="text-gray-400 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-500 transition">
                      {t('type.villas')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/properties?type=apartment" className="text-gray-400 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-500 transition">
                      {t('type.apartments')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/properties?type=townhouse" className="text-gray-400 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-500 transition">
                      {t('type.townhouses')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/properties?type=commercial" className="text-gray-400 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-500 transition">
                      {t('type.commercial')}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            {isLoading ? (
              <Skeleton className="h-6 w-20 mb-4 bg-gray-700" />
            ) : (
              <h4 className="text-lg font-semibold mb-4">{t('footer.contact')}</h4>
            )}
            <ul className="space-y-2 text-gray-400 dark:text-gray-500">
              <li>📞 {siteSettings?.contactInfo.phone || '+971 50 123 4567'}</li>
              <li>✉️ {siteSettings?.contactInfo.email || 'info@luxuryestates.com'}</li>
              <li>📍 {siteSettings?.contactInfo.address || 'Dubai, UAE'}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-900 mt-8 pt-8 text-center text-gray-400 dark:text-gray-500">
          {isLoading ? (
            <Skeleton className="h-4 w-64 mx-auto bg-gray-700" />
          ) : (
            <p>&copy; {new Date().getFullYear()} {siteSettings?.siteName || 'LuxuryEstates'}. {t('footer.copyright')}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
