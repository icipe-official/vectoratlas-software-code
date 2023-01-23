import reducer, { initialState, showMoreToggle } from './homeSlice';

describe('homeSlice', () => {
  let state;

  beforeEach(() => {
    state = initialState();
  });

  it('toggles showMore property correctly', () => {
    expect(state.showMore).toEqual(false);
    const updatedState = reducer(state, showMoreToggle());

    expect(updatedState.showMore).toEqual(true);
  });
});
