export const seasonProperties = {
  '@key': { type: 'string' },
  '@assetType': { type: 'string' },
  '@lastUpdated': { type: 'string' },
  number: { type: 'number' },
  tvShow: { type: 'object', additionalProperties: true },
  year: { type: 'number' },
} as const;

export const seasonSchema = {
  type: 'object' as const,
  properties: seasonProperties,
};
