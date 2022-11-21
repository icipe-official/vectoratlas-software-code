function escapeRegex(inputField: string) {
  console.log('inputField: ', inputField, typeof inputField);
  if (typeof inputField === 'boolean') {
    return inputField;
  } else {
    let escapeinputField = inputField.replace(
      /[-[\]/{}()*+?.,\\^$|#"]/g,
      '\\$&'
    );
    console.log('ESCAPEREGEX: ', escapeinputField);
    return escapeinputField;
  }
}

export function sourceStringValidation(sourceObject: any) {
  const sourceValidationObject: {
    [article_title: string]: string | null;
  } = {};
  Object.keys(sourceObject).forEach((field) => {
    console.log('Validation: ', field, typeof field);
    sourceValidationObject[field] = escapeRegex(sourceObject[field]);
  });
  return sourceValidationObject;
}
