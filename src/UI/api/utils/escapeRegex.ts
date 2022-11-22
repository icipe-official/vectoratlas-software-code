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
