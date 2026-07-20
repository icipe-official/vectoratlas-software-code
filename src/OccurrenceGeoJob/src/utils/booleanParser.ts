/**
 * Utility function to evaluate string/number/boolean values to boolean
 *
 * Truthy values:
 * - Strings: 'true', 'True', 'TRUE', '1', 'yes', 'Yes', 'YES'
 * - Numbers: any non-zero number
 * - Booleans: true
 *
 * Falsy values:
 * - Strings: 'false', 'False', 'FALSE', '0', 'no', 'No', 'NO', empty string
 * - Numbers: 0
 * - Booleans: false
 * - null/undefined
 *
 * @param value - The value to evaluate
 * @returns boolean - true if value is truthy, false otherwise
 */
export function evaluateBoolean(
  value: string | number | boolean | null | undefined,
): boolean {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return false;
  }

  // Handle boolean
  if (typeof value === 'boolean') {
    return value;
  }

  // Handle number
  if (typeof value === 'number') {
    return value !== 0;
  }

  // Handle string
  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase().trim();

    // Check for truthy strings
    if (['true', '1', 'yes', 'y'].includes(lowerValue)) {
      return true;
    }

    // Check for falsy strings
    if (['false', '0', 'no', 'n', ''].includes(lowerValue)) {
      return false;
    }

    // Any other non-empty string is considered truthy
    return lowerValue.length > 0;
  }

  // Fallback: consider as truthy
  return true;
}

/**
 * Utility function to evaluate string/number/boolean values to boolean or undefined
 * Returns undefined if the input is null or undefined
 *
 * @param value - The value to evaluate
 * @returns boolean | undefined - true/false if value is defined, undefined otherwise
 */
export function evaluateBooleanOrUndefined(
  value: string | number | boolean | null | undefined,
): boolean | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  return evaluateBoolean(value);
}
