import {
  arrayOfFlattenedObjects,
  flattenOccurrenceRepoObject,
} from './allDataCsvCreation';
import { Occurrence } from '../../db/occurrence/entities/occurrence.entity';
import * as flat from 'flat';

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
  afterEach(() => {
    jest.clearAllMocks();
  });
  const flattenSpy = jest.spyOn(flat, 'flatten');
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
  it('handles an empty array', () => {
    const emptyObjectArray = [];
    arrayOfFlattenedObjects(emptyObjectArray);
    expect(flattenSpy).toBeCalledTimes(emptyObjectArray.length);
    expect(arrayOfFlattenedObjects(emptyObjectArray)).toEqual(emptyObjectArray);
  });
  it('handles an empty object', () => {
    const arrayEmptyObject = [{}];
    arrayOfFlattenedObjects(arrayEmptyObject);
    expect(flattenSpy).toBeCalledTimes(arrayEmptyObject.length);
    expect(arrayOfFlattenedObjects(arrayEmptyObject)).toEqual([{}]);
  });
});

describe(flattenOccurrenceRepoObject.name, () => {
  const testOccurrence = [new Occurrence(), new Occurrence()];
  it('calls on arrayOfFlattenedObjects', () => {
    flattenOccurrenceRepoObject(testOccurrence);
    expect(arrayOfFlattenedObjects).toBeCalled;
  });
});
