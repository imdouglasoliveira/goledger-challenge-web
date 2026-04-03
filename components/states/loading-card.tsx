import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function LoadingCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}

export function LoadingRow() {
  return (
    <div className="mb-8 overflow-hidden">
      <Skeleton className="h-7 w-48 mb-3 ml-4 md:ml-12 bg-nf-surface" />
      <div className="flex gap-2 px-4 md:px-12 hide-scrollbar">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="w-[250px] flex-shrink-0 aspect-video rounded-md bg-nf-surface" />
        ))}
      </div>
    </div>
  );
}

export function LoadingHero() {
  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] bg-nf-surface animate-pulse">
      <div className="absolute bottom-[15%] left-0 px-4 md:px-12">
        <Skeleton className="h-12 w-96 mb-3 bg-nf-card" />
        <Skeleton className="h-4 w-64 mb-2 bg-nf-card" />
        <Skeleton className="h-4 w-48 mb-4 bg-nf-card" />
        <div className="flex gap-3 mt-4">
          <Skeleton className="h-10 w-28 rounded bg-nf-card" />
          <Skeleton className="h-10 w-28 rounded bg-nf-card" />
        </div>
      </div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen">
      <LoadingHero />
      <div className="-mt-16 relative z-10">
        <LoadingRow />
        <LoadingRow />
      </div>
    </div>
  );
}
