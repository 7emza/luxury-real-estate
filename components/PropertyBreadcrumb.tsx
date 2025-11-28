'use client';

import Link from 'next/link';
import { useTranslation } from '@/contexts/ContentContext';

interface PropertyBreadcrumbProps {
  title: string;
}

export default function PropertyBreadcrumb({ title }: PropertyBreadcrumbProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      <div className="container py-3 sm:py-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 overflow-x-auto">
          <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-500 whitespace-nowrap">
            {t('breadcrumb.home')}
          </Link>
          <span className="flex-shrink-0">/</span>
          <Link href="/properties" className="hover:text-amber-600 dark:hover:text-amber-500 whitespace-nowrap">
            {t('breadcrumb.properties')}
          </Link>
          <span className="flex-shrink-0">/</span>
          <span className="text-gray-900 dark:text-white truncate">{title}</span>
        </div>
      </div>
    </div>
  );
}
