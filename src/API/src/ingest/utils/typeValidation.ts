export function isString(inputCheck: any) {
  return typeof inputCheck === 'string';
}

export function isBool(inputCheck: any) {
  return typeof inputCheck === 'boolean';
}

export function isNumber(inputCheck: any) {
  return typeof inputCheck === 'number';
}

export function isValidDate(inputCheck: any) {
  const validStartTime = new Date('1980-01-01');
  const validEndTime = new Date();
  return (
    validStartTime.getTime() <= inputCheck.getTime() &&
    validEndTime.getTime() >= inputCheck.getTime()
  );
}
