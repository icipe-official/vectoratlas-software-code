import { BadRequestException } from '@nestjs/common';

export const parseStringArray = (value?: string): string[] | undefined =>
  value ? value.split(',').map((v) => v.trim()) : undefined;

export const parseNullableStringArray = (
  value?: string,
): (string | null)[] | undefined =>
  value
    ? value
        .split(',')
        .map((v) => v.trim())
        .map((v) => (v.toLowerCase() === 'null' ? null : v))
    : undefined;

export const parseNullableBooleanArray = (
  value?: string,
): (boolean | null)[] | undefined =>
  value
    ? value
        .split(',')
        .map((v) => v.trim().toLowerCase())
        .map((v) => (v === 'null' ? null : v === 'true'))
    : undefined;

export const parseTimeline = (
  value?: string,
): { startTimestamp?: number; endTimestamp?: number } => {
  if (!value) return {};
  const [startYearStr, endYearStr] = value.split('-').map((v) => v.trim());
  const startYear = parseInt(startYearStr, 10);
  const endYear = parseInt(endYearStr, 10);
  if (isNaN(startYear) || isNaN(endYear)) {
    throw new BadRequestException(
      `Invalid timeline "${value}". Expected format "YYYY-YYYY", e.g. "2010-2020".`,
    );
  }
  return {
    startTimestamp: Date.UTC(startYear, 0, 1),
    endTimestamp: Date.UTC(endYear + 1, 0, 1),
  };
};

export const ALLOWED_RESPONSE_FIELDS = [
  'id',
  'species',
  'location',
  'binary_presence',
  'country',
  'year_start',
  'is_adult',
  'is_larval',
  'season_val',
  'insecticide',
  'control',
  'abundance_data',
  'bio_data',
];

export const parseFields = (value?: string): string[] | undefined => {
  if (!value) return undefined;
  const requested = value.split(',').map((v) => v.trim());
  const invalid = requested.filter((f) => !ALLOWED_RESPONSE_FIELDS.includes(f));
  if (invalid.length > 0) {
    throw new BadRequestException(
      `Unknown field(s): ${invalid.join(
        ', ',
      )}. Allowed fields: ${ALLOWED_RESPONSE_FIELDS.join(', ')}.`,
    );
  }
  return requested;
};

/** Always includes `id` even if not explicitly requested, per REST convention. */
export const projectFields = (item: Record<string, any>, fields?: string[]) => {
  if (!fields) return item;
  const projected: Record<string, any> = { id: item.id };
  fields.forEach((f) => {
    projected[f] = item[f];
  });
  return projected;
};
