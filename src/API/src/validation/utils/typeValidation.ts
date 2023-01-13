export function isBool(inputCheck: string) {
  const inputCheckLower = inputCheck.toLowerCase();
  return ['true', 'false','yes','no'].includes(inputCheckLower);
}

export function isNumber(inputCheck: string) {
  // CHECK FOR NUMBERS INCLUDING SCIENTIFIC NOTATION
  let numberCheck = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(inputCheck);
  return numberCheck
}

// export function isValidDate(inputCheck: any) {
//   const validStartTime = new Date('1980-01-01');
//   const validEndTime = new Date();
//   return (
//     validStartTime.getTime() <= inputCheck.getTime() &&
//     validEndTime.getTime() >= inputCheck.getTime()
//   );
// }
