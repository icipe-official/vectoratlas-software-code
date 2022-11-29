import reducer, {
  initialState,
  setCurrentInfoForEditing
} from './speciesInformationSlice';

describe('speciesInformationSlice', () => {
  let state;

  beforeEach(() => {
    state = initialState();
  });

  it('sets current species information for editing correctly', () => {
    const newSpeciesInformation = {
      name: 'test species'
    };

    expect(state.currentInfoForEditing).toBeNull();
    const updatedState = reducer(state, setCurrentInfoForEditing(newSpeciesInformation));

    expect(updatedState.currentInfoForEditing).toEqual(newSpeciesInformation)
  })
})