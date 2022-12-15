import reducer, { initialState, setModelFile } from './uploadSlice';

describe('uploadSlice', () => {
  let state;

  beforeEach(() => {
    state = initialState();
  });

  it('setModelFile', () => {
    const file = 'file';

    expect(state.modelFile).toBeNull();
    const updatedState = reducer(state, setModelFile(file));

    expect(updatedState.modelFile).toEqual('file');
  });
});
