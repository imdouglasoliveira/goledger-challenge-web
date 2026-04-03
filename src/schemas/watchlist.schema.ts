export const watchlistProperties = {
  '@key': { type: 'string' },
  '@assetType': { type: 'string' },
  '@lastUpdated': { type: 'string' },
  title: { type: 'string' },
  description: { type: 'string' },
  tvShows: { type: 'array', items: { type: 'object' } },
} as const;

export const watchlistSchema = {
  type: 'object' as const,
  properties: watchlistProperties,
};
