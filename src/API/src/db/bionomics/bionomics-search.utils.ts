import { BadRequestException } from '@nestjs/common';
import {
  parseStringArray,
  parseNullableBooleanArray,
  parseTimeline,
  projectFields,
} from '../occurrence/search-query.utils';

export {
  parseStringArray,
  parseNullableBooleanArray,
  parseTimeline,
  projectFields,
};

export const BIONOMICS_ALLOWED_RESPONSE_FIELDS = [
  'id',
  'country',
  'season_given',
  'season_calc',
  'control',
  'insecticide_control',
  'itn_use',
  'year_start',
  'year_end',
  'adult_data',
  'larval_site_data',
];

export const parseBionomicsFields = (value?: string): string[] | undefined => {
  if (!value) return undefined;
  const requested = value.split(',').map((v) => v.trim());
  const invalid = requested.filter(
    (f) => !BIONOMICS_ALLOWED_RESPONSE_FIELDS.includes(f),
  );
  if (invalid.length > 0) {
    throw new BadRequestException(`Unknown field(s): ${invalid.join(', ')}.`);
  }
  return requested;
};
