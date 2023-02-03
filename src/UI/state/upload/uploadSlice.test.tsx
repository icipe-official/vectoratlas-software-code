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
      [
        {
        "data": 
          [
            {
              "data": [
              {
                "errorType": "b",
                "expectedType": "c",
                "key": "a",
                "receivedType": "d",
                "row": 1
              },
              {"data": {"errorType": "f", "expectedType": "g", "key": "e", "receivedType": "h", "row": 1},
              "row": 0},
              {"data": {"errorType": "j", "expectedType": "k", "key": "i", "receivedType": "l", "row": 1}, "row": 1}],
            "row": 0
    }],
      "row": 0}]
    );
  });
});
