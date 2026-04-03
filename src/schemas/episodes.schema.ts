export const episodeProperties = {
  '@key': { type: 'string' },
  '@assetType': { type: 'string' },
  '@lastUpdated': { type: 'string' },
  season: { type: 'object' },
  episodeNumber: { type: 'number' },
  title: { type: 'string' },
  description: { type: 'string' },
  releaseDate: { type: 'string' },
  rating: { type: 'number' },
} as const;

export const episodeSchema = {
  type: 'object' as const,
  properties: episodeProperties,
};
