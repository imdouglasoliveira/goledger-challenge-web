export const tvShowProperties = {
  '@key': { type: 'string' },
  '@assetType': { type: 'string' },
  '@lastUpdated': { type: 'string' },
  title: { type: 'string' },
  description: { type: 'string' },
  recommendedAge: { type: 'number' },
  posterUrl: { type: 'string', nullable: true },
  backdropUrl: { type: 'string', nullable: true },
} as const;

export const tvShowSchema = {
  type: 'object' as const,
  properties: tvShowProperties,
};
