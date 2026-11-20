import { BadRequestException } from '@nestjs/common';
import {
  parseStringArray,
  projectFields,
} from '../occurrence/search-query.utils';

export { parseStringArray, projectFields };

export const SITE_ALLOWED_RESPONSE_FIELDS = [
  'id',
  'site',
  'country',
  'location',
  'admin_level_1',
  'admin_level_2',
  'area_type',
];

export const parseSiteFields = (value?: string): string[] | undefined => {
  if (!value) return undefined;
  const requested = value.split(',').map((v) => v.trim());
  const invalid = requested.filter(
    (f) => !SITE_ALLOWED_RESPONSE_FIELDS.includes(f),
  );
  if (invalid.length > 0) {
    throw new BadRequestException(`Unknown field(s): ${invalid.join(', ')}.`);
  }
  return requested;
};
