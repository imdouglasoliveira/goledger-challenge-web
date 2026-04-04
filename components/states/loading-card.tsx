import { Skeleton } from '@/components/ui/skeleton';

export function LoadingCard() {
  return (
    <div className="rounded-lg bg-nf-card p-4">
      <Skeleton className="h-6 w-48 bg-nf-gray-500" />
      <Skeleton className="mt-2 h-4 w-32 bg-nf-gray-500" />
      <Skeleton className="mt-4 h-4 w-full bg-nf-gray-500" />
      <Skeleton className="mt-2 h-4 w-3/4 bg-nf-gray-500" />
    </div>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="min-h-screen px-4 pt-40 md:px-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    </div>
  );
}

function LoadingCardMobile() {
  return (
    <div className="w-[140px] flex-shrink-0 sm:w-[160px]">
      <Skeleton className="aspect-[2/3] w-full rounded-lg bg-nf-gray-500" />
      <Skeleton className="mt-2 h-3 w-3/4 bg-nf-gray-500" />
    </div>
  );
}

function LoadingCardDesktop() {
  return <Skeleton className="w-[250px] flex-shrink-0 aspect-video rounded-lg bg-nf-gray-500" />;
}

export function LoadingRow() {
  return (
    <div className="mb-8 overflow-hidden">
      <Skeleton className="mb-4 ml-4 h-6 w-40 bg-nf-gray-500 md:mb-3 md:ml-12 md:h-7 md:w-48" />
      {/* Mobile: poster cards */}
      <div className="flex gap-2.5 px-4 pointer-fine:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <LoadingCardMobile key={i} />
        ))}
      </div>
      {/* Desktop: landscape cards */}
      <div className="hidden gap-2 px-4 pointer-fine:flex md:px-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingCardDesktop key={i} />
        ))}
      </div>
    </div>
  );
}

export function LoadingHero() {
  return (
    <div className="relative w-full h-[48vh] sm:h-[65vh] md:h-[75vh] bg-nf-surface">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" />
      </div>

      {/* Bottom gradient */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: 'linear-gradient(to top, #141414 10%, transparent 90%)' }}
      />

      {/* Content skeleton */}
      <div className="absolute bottom-[14%] sm:bottom-[15%] left-0 px-4 md:px-12 w-full">
        <Skeleton className="h-7 w-2/3 max-w-80 bg-nf-card sm:h-10 md:h-12 md:max-w-96" />
        <div className="mt-3 flex items-center gap-2">
          <Skeleton className="h-4 w-16 bg-nf-card" />
          <Skeleton className="h-4 w-8 rounded-sm bg-nf-card" />
          <Skeleton className="h-4 w-12 bg-nf-card" />
        </div>
        <div className="mt-4 flex gap-2 sm:gap-3">
          <Skeleton className="h-11 w-28 rounded-full bg-nf-card sm:w-32" />
          <Skeleton className="h-11 w-28 rounded-full bg-nf-card sm:w-32" />
        </div>
      </div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen">
      <LoadingHero />
      <div className="-mt-6 relative z-10 md:-mt-16">
        <LoadingRow />
        <LoadingRow />
      </div>
    </div>
  );
}
