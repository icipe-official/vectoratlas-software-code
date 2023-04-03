export function convertToCSV(arr) {
  if (arr && arr.length !== 0) {
    const array = [Object.keys(arr[0])].concat(arr);

    return array
      .map((it) => {
        return Object.values(it).toString();
      })
      .join('\n');
  } else return '';
}
