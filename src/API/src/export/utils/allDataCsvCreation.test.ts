import {
  arrayOfFlattenedObjects,
  flattenOccurrenceRepoObject,
} from './allDataCsvCreation';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';
const flat = require('flat');
const fs = require('fs');

const flattenSpy = jest.spyOn(flat, 'flatten');

const testNestedObjectArray = [
  {
    data: {
      nested: {
        1: 'test_1',
        2: 'test_2',
      },
    },
  },
  {
    data: {
      nested: {
        3: 'test_3',
        4: 'test_4',
      },
    },
  },
];

describe(arrayOfFlattenedObjects.name, () => {
  it('flattens nested objects of an array with a _ delimiter', () => {
    const flatTestObjectArray = [
      { data_nested_1: 'test_1', data_nested_2: 'test_2' },
      { data_nested_3: 'test_3', data_nested_4: 'test_4' },
    ];
    arrayOfFlattenedObjects(testNestedObjectArray);
    expect(flattenSpy).toBeCalledTimes(testNestedObjectArray.length);
    expect(arrayOfFlattenedObjects(testNestedObjectArray)).toEqual(
      flatTestObjectArray,
    );
  });
});

describe(flattenOccurrenceRepoObject.name, () => {
  const testOccurrence = [new Occurrence(), new Occurrence()];
  it('calls on arrayOfFlattenedObjects', () => {
    flattenOccurrenceRepoObject(testOccurrence);
    expect(arrayOfFlattenedObjects).toBeCalled;
  });
});
