'use client';

import { useState, useRef, TouchEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/types/property';
import { useTranslation, useContent } from '@/contexts/ContentContext';
import { Skeleton } from '@/components/Skeleton';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { t, formatPrice: formatPriceWithCurrency, currency, isRTL } = useTranslation();
  const { isLoading } = useContent();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const images = property.images && property.images.length > 0 ? property.images : ['/placeholder-property.jpg'];
  const hasMultipleImages = images.length > 1;

  // Minimum swipe distance to trigger navigation (in pixels)
  const minSwipeDistance = 50;

  // Get price for current currency
  const getPrice = (): number => {
    if (property.prices && currency && property.prices[currency.code]) {
      return property.prices[currency.code].price;
    }
    return property.price;
  };

  // Get rent for current currency
  const getRent = (): number | undefined => {
    if (property.prices && currency && property.prices[currency.code]) {
      return property.prices[currency.code].rent || undefined;
    }
    return property.pricePerMonth;
  };

  const displayPrice = getPrice();
  const displayRent = getRent();

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (hasMultipleImages) {
      if (isRTL) {
        // RTL: swipe left = prev, swipe right = next
        if (isLeftSwipe) {
          setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        } else if (isRightSwipe) {
          setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
      } else {
        // LTR: swipe left = next, swipe right = prev
        if (isLeftSwipe) {
          setCurrentImageIndex((prev) => (prev + 1) % images.length);
        } else if (isRightSwipe) {
          setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        }
      }
    }

    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group card-hover">
        {/* Image Carousel */}
        <div
          className="relative h-64 overflow-hidden"
          onTouchStart={hasMultipleImages ? handleTouchStart : undefined}
          onTouchMove={hasMultipleImages ? handleTouchMove : undefined}
          onTouchEnd={hasMultipleImages ? handleTouchEnd : undefined}
        >
          {/* Main Image */}
          <Image
            src={images[currentImageIndex]}
            alt={`${property.title} - Image ${currentImageIndex + 1}`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Navigation Arrows - Only show if multiple images */}
          {hasMultipleImages && (
            <>
              {/* Previous Button - Always visible on mobile, hover on desktop */}
              <button
                onClick={prevImage}
                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-2' : 'left-2'} w-9 h-9 md:w-8 md:h-8 bg-black/60 md:bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10 active:scale-95`}
                aria-label="Previous image"
              >
                <svg className={`w-5 h-5 md:w-4 md:h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Button - Always visible on mobile, hover on desktop */}
              <button
                onClick={nextImage}
                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-2' : 'right-2'} w-9 h-9 md:w-8 md:h-8 bg-black/60 md:bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10 active:scale-95`}
                aria-label="Next image"
              >
                <svg className={`w-5 h-5 md:w-4 md:h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dot Indicators - Always visible */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.slice(0, 5).map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => goToImage(e, index)}
                    className={`w-2.5 h-2.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
                      currentImageIndex === index
                        ? 'bg-white w-5 md:w-4'
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
                {images.length > 5 && (
                  <span className="text-white text-xs ml-1">+{images.length - 5}</span>
                )}
              </div>

              {/* Image Counter - Always visible */}
              <div className={`absolute bottom-3 ${isRTL ? 'left-3' : 'right-3'} bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10`}>
                {currentImageIndex + 1}/{images.length}
              </div>
            </>
          )}

          {/* Badge */}
          <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
            {isLoading ? (
              <Skeleton className="h-6 w-16 rounded-full" />
            ) : (
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                property.status === 'For Sale'
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}>
                {property.status === 'For Sale' ? t('property.forSale') : t('property.forRent')}
              </span>
            )}
          </div>
          {property.luxury && (
            <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
              {isLoading ? (
                <Skeleton className="h-6 w-16 rounded-full bg-amber-600/50" />
              ) : (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-amber-600 text-white">
                  {t('property.luxury')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition">
              {property.title}
            </h3>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
            <svg className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">{property.location}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="text-center">
              {isLoading ? (
                <Skeleton className="h-4 w-16 mx-auto mb-1" />
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('property.bedrooms')}</div>
              )}
              <div className="font-semibold text-gray-900 dark:text-gray-100">{property.bedrooms}</div>
            </div>
            <div className="text-center">
              {isLoading ? (
                <Skeleton className="h-4 w-16 mx-auto mb-1" />
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('property.bathrooms')}</div>
              )}
              <div className="font-semibold text-gray-900 dark:text-gray-100">{property.bathrooms}</div>
            </div>
            <div className="text-center">
              {isLoading ? (
                <Skeleton className="h-4 w-12 mx-auto mb-1" />
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('property.sqft')}</div>
              )}
              <div className="font-semibold text-gray-900 dark:text-gray-100">{property.area.toLocaleString()}</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">
                {formatPriceWithCurrency(displayPrice)}
              </div>
              {displayRent && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {isLoading ? (
                    <Skeleton className="h-4 w-24" />
                  ) : (
                    <>{formatPriceWithCurrency(displayRent)}{t('property.perMonth')}</>
                  )}
                </div>
              )}
            </div>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
              {property.type}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
