// import fs from 'fs';
import ObjectsToCsv from 'objects-to-csv';
import { Bionomics } from 'src/db/bionomics/entities/bionomics.entity';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';

// All dates UTC
const fs = require('fs');
// const ObjectsToCsv = require('objects-to-csv');
const flatten = require('flat')

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

export async function createRepoCsv(
  repo: string,
  occurrenceDbdata?: Occurrence[],
  bionomicsDbData?: Bionomics[],
) {
  const data = repo === 'occurrence' ? occurrenceDbdata : bionomicsDbData;
  const dataflat = arrayOfFlattenedObjects(data);
  return new ObjectsToCsv(dataflat);
}

export async function allDataCreation() {
  // Need to know how we want to display all data
  return 'Now create all data';
}

// Try catch mindful of quirky errors
