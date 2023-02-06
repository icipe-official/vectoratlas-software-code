import reducer, {
  initialState,
  setModelFile,
  updateValidationErrors,
} from './uploadSlice';

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
    const error = [
      {
        key: 'Year',
        row: 1,
        errorType: 'Incorrect data type',
        expectedType: 'number',
        receivedType: 'string',
      },
      {
        key: 'Latitude',
        row: 1,
        errorType: 'Required data',
        expectedType: 'string',
      },
      {
        key: 'Year',
        row: 1,
        errorType: 'Incorrect data type',
        expectedType: 'number',
        receivedType: 'string',
      },
      {
        key: 'Latitude',
        row: 1,
        errorType: 'Required data',
        expectedType: 'string',
      },
    ];

    const updatedState = reducer(state, updateValidationErrors(error));
    expect(updatedState.validationErrors).toEqual([
      {
        data: [
          {
            errorType: 'Incorrect data type',
            expectedType: 'number',
            key: 'Year',
            receivedType: 'string',
          },
          {
            errorType: 'Required data',
            expectedType: 'string',
            key: 'Latitude',
          },
          {
            errorType: 'Incorrect data type',
            expectedType: 'number',
            key: 'Year',
            receivedType: 'string',
          },
          {
            errorType: 'Required data',
            expectedType: 'string',
            key: 'Latitude',
          },
        ],
        row: 1,
      },
    ]);
  });
});
