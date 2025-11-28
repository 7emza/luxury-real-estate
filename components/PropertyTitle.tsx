'use client';

import { useTranslation } from '@/contexts/ContentContext';

interface PropertyTitleProps {
  title: string;
}

export default function PropertyTitle({ title }: PropertyTitleProps) {
  const { language } = useTranslation();

  // Use Tajawal font (already loaded) for Arabic/Darija - much more readable than decorative fonts
  const isArabicLanguage = language === 'ar' || language === 'darija';
  const fontClass = isArabicLanguage ? 'font-arabic' : 'font-display';

  return (
    <h1 className={`text-2xl sm:text-3xl md:text-4xl ${fontClass} font-bold mb-2 dark:text-white break-words`}>
      {title}
    </h1>
  );
}
