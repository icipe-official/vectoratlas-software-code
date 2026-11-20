import { BadRequestException } from '@nestjs/common';
import {
  parseStringArray,
  projectFields,
} from '../occurrence/search-query.utils';

export { parseStringArray, projectFields };

export const IR_ALLOWED_RESPONSE_FIELDS = [
  'id',
  'insecticide_tested',
  'insecticide_class',
  'irac_moa',
  'irac_moa_code',
  'concentration_percent',
  'mosquitoes_tested_n',
  'mosquitoes_dead_n',
  'percent_mortality',
  'knock_down_percent',
  'bioassay_notes',
];

export const parseIrFields = (value?: string): string[] | undefined => {
  if (!value) return undefined;
  const requested = value.split(',').map((v) => v.trim());
  const invalid = requested.filter(
    (f) => !IR_ALLOWED_RESPONSE_FIELDS.includes(f),
  );
  if (invalid.length > 0) {
    throw new BadRequestException(`Unknown field(s): ${invalid.join(', ')}.`);
  }
  return requested;
};
