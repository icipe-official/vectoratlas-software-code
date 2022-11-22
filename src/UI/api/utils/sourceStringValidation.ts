import { Source } from '../../state/sourceSlice';
import { escapeRegex } from './escapeRegex';

export function sourceStringValidation(sourceObject: Source) {
  const sourceValidationObject: {
    [index: string]: string | null;
  } = {};
  Object.keys(sourceObject).forEach((field) => {
    sourceValidationObject[field] = escapeRegex(sourceObject[field]);
  });
  return sourceValidationObject;
}
