import reducer, { initialState, showMoreToggle, updateStats } from './homeSlice';

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
  it('updateStats updates the properties on stats', () => {
    const newState = reducer(state, updateStats(
    {
      pageViews: 1,
      countries: 2,
      uniqueViews: 3,
      events: 4
    }));
    expect(newState.stats).toEqual(
      {
      pageViews: 1,
      countries: 2,
      uniqueViews: 3,
      events: 4
      }
    );
  });
});
