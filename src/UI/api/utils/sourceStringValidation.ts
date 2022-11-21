export function escapeRegex(inputField: string) {
  if (typeof inputField === 'boolean') {
    return inputField;
  } else {
    let escapeinputField = inputField.replace(
      /[-[\]/{}()*+?.,\\^$|#"]/g,
      '\\$&'
    );
    return escapeinputField;
  }
}

export function sourceStringValidation(sourceObject: any) {
  const sourceValidationObject: {
    [article_title: string]: string | null;
  } = {};
  Object.keys(sourceObject).forEach((field) => {
    sourceValidationObject[field] = escapeRegex(sourceObject[field]);
  });
  return sourceValidationObject;
}
