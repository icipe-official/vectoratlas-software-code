export function isBool(inputCheck: string) {
  const inputCheckLower = inputCheck.toLowerCase();
  console.log(inputCheckLower);
  return ['yes', 'no'].includes(inputCheckLower);
}

export function isNumber(inputCheck: string) {
  // CHECK FOR NUMBERS INCLUDING SCIENTIFIC NOTATION
  return /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(inputCheck);
}

export function isValidDate(inputCheck: any) {
  const validStartTime = new Date('1980-01-01');
  const validEndTime = new Date();
  return (
    validStartTime.getTime() <= inputCheck.getTime() &&
    validEndTime.getTime() >= inputCheck.getTime()
  );
}
