import * as flat from 'flat';

import { Occurrence } from '../../db/occurrence/entities/occurrence.entity';

// All dates UTC

export function arrayOfFlattenedObjects(array) {
  const csvArray = [];
  for (const i in array) {
    const flatObject = flat.flatten(array[i], {
      delimiter: '_',
    });
    csvArray.push(flatObject);
  }
  return csvArray;
}

export function flattenOccurrenceRepoObject(occurrenceDbdata?: Occurrence[]) {
  return arrayOfFlattenedObjects(occurrenceDbdata);
}

export function arrayToCSV(data: Array<Object>) {
  const csv = data.map((row) => Object.values(row));
  csv.unshift(Object.keys(data[0]));
  return `"${csv.join('"\n"').replace(/,/g, '","')}"`;
}
