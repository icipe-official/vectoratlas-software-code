// import fs from 'fs';
const flatten = require('flat')
const fs = require('fs');

import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';

// All dates UTC

export function arrayOfFlattenedObjects(array) {
  const csvArray = [];
  for (const i in array) {
    const flatObject = flatten(array[i], {
      delimiter: '_',
    });
    csvArray.push(flatObject);
  }
  return csvArray;
}

export async function flattenOccurrenceRepoObject(
  occurrenceDbdata?: Occurrence[],
) {
  const data = occurrenceDbdata;
  const dataflat = arrayOfFlattenedObjects(data);
  return dataflat;
}
