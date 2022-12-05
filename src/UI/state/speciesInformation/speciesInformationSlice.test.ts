import reducer, {
  initialState,
  setCurrentInfoForEditing,
  speciesInfoLoading,
} from './speciesInformationSlice';

describe('speciesInformationSlice', () => {
  let state;

  beforeEach(() => {
    state = initialState();
  });

  it('sets current species information for editing correctly', () => {
    const newSpeciesInformation = {
      name: 'test species',
    };

    expect(state.currentInfoForEditing).toBeNull();
    const updatedState = reducer(
      state,
      setCurrentInfoForEditing(newSpeciesInformation)
    );

    expect(updatedState.currentInfoForEditing).toEqual(newSpeciesInformation);
  });

  it('updates loading state correctly', () => {
    expect(state.loading).toBeFalsy();
    const updatedState = reducer(
      state,
      speciesInfoLoading(true)
    );
    expect(updatedState.loading).toBeTruthy();
  })
});
