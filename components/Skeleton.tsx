'use client';

interface SkeletonProps {
  className?: string;
}

// Base skeleton with shimmer animation
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    />
  );
}

// Property Card Skeleton
export function PropertyCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Image placeholder */}
      <Skeleton className="h-64 w-full rounded-none" />

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 mb-3" />

        {/* Location */}
        <div className="flex items-center mb-4">
          <Skeleton className="h-4 w-4 mr-2 rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-3 w-12 mx-auto mb-1" />
              <Skeleton className="h-5 w-8 mx-auto" />
            </div>
          ))}
        </div>

        {/* Price and Type */}
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-7 w-32 mb-1" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-10 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Property Grid Skeleton (multiple cards)
export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Hero Section Skeleton
export function HeroSkeleton() {
  return (
    <div className="relative h-[600px] bg-gray-200 dark:bg-gray-800">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4">
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
          <Skeleton className="h-14 w-full max-w-2xl mx-auto rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Property Detail Skeleton
export function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container py-4">
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Image Gallery */}
      <section className="bg-white dark:bg-gray-800">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-[500px] rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-[240px] rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
                {/* Title and Price */}
                <div className="flex flex-wrap justify-between mb-6">
                  <div className="w-2/3">
                    <Skeleton className="h-10 w-full mb-2" />
                    <Skeleton className="h-5 w-1/2" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-gray-200 dark:border-gray-700">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="text-center">
                      <Skeleton className="h-8 w-12 mx-auto mb-1" />
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className="mt-8">
                  <Skeleton className="h-8 w-48 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Features */}
                <div className="mt-8">
                  <Skeleton className="h-8 w-48 mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Skeleton key={i} className="h-5 w-40" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Testimonial Card Skeleton
export function TestimonialSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div>
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-1 mt-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-5 w-5" />
        ))}
      </div>
    </div>
  );
}

// Blog Card Skeleton
export function BlogCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

// Agent Card Skeleton
export function AgentCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
      <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
      <Skeleton className="h-6 w-32 mx-auto mb-2" />
      <Skeleton className="h-4 w-24 mx-auto mb-4" />
      <Skeleton className="h-4 w-40 mx-auto mb-2" />
      <Skeleton className="h-4 w-36 mx-auto" />
    </div>
  );
}

// Search Bar Skeleton
export function SearchBarSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-12 flex-1 rounded-full" />
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </div>
  );
}

// Stats Section Skeleton
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="text-center">
          <Skeleton className="h-10 w-20 mx-auto mb-2" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      ))}
    </div>
  );
}
