import { Suspense } from 'react';
import { WatchlistPage } from '@/components/watchlist/watchlist-page';
import { LoadingPage } from '@/components/states/loading-card';

export default function WatchlistPageRoute() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <WatchlistPage />
    </Suspense>
  );
}
