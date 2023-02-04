import reducer, { initialState, setModelFile, updateValidationErrors } from './uploadSlice';

describe('uploadSlice', () => {
  let state: any;

  beforeEach(() => {
    state = initialState();
  });

  it('setModelFile', () => {
    const file = 'file';

    expect(state.modelFile).toBeNull();
    const updatedState = reducer(state, setModelFile(file));

    expect(updatedState.modelFile).toEqual('file');
  });
  it('updateValidationErrors', () => {
    const error = {
      row: 0,
      data: [{
        row: 1,
        key: 'a',
        errorType: 'b',
        expectedType: 'c',
        receivedType: 'd'
      },
      {
        row: 0,
        data: {
          row: 1,
          key: 'e',
          errorType: 'f',
          expectedType: 'g',
          receivedType: 'h'
        }
      },
      {
        row: 1,
        data: {
          row: 1,
          key: 'i',
          errorType: 'j',
          expectedType: 'k',
          receivedType: 'l'
        }
      }
    ]
    }
    const updatedState = reducer(state, updateValidationErrors(
      [error]
    ))
    // Something very wrong with group function
    expect(updatedState.validationErrors).toEqual(
      {
        1: [{
        errorType: "Incorrect data type",
        expectedType: "number",
        key: "Year",
        receivedType: "string"
      }, {
        errorType: "Required data",
        expectedType: "string",
        key: "Latitude"
      }]
      }
    );
  });
});
