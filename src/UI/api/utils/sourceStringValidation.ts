import { Source } from '../../state/sourceSlice';

function encodeString(inputField: string) {
  if (typeof inputField === 'boolean') {
    return inputField;
  } else {
    let escapeinputField = encodeURIComponent(inputField);
    return escapeinputField;
  }
}

export function sourceStringValidation(sourceObject: Source) {
  const sourceValidationObject: {
    [index: string]: string | null;
  } = {};
  Object.keys(sourceObject).forEach((field) => {
    sourceValidationObject[field] = encodeString(sourceObject[field]);
  });
  return sourceValidationObject;
}
