import reducer, {
  initialState,
  updateOccurrence,
  layerToggle,
  drawerToggle,
  drawerListToggle,
  startNewSearch,
  MapState,
  filterHandler,
  updateMapLayerColour,
  setSelectedIds,
  updateSelectedData,
} from './mapSlice';

describe('mapSlice', () => {
  let state: MapState;

  beforeEach(() => {
    state = initialState();
  });

  it('returns initial state when given undefined previous state', () => {
    expect(reducer(undefined, { type: 'nop' })).toEqual(state);
  });

  describe('filterHandler', () => {
    it('updates filter with new value', () => {
      const newState = reducer(
        state,
        filterHandler({
          filterName: 'country',
          filterOptions: ['a', 'b'],
        })
      );

      expect(newState.filters.country).toEqual({ value: ['a', 'b'] });
    });
  });

  describe('updateOccurrence', () => {
    const expectedOccurrenceData = [{ test: 1 }, { test: 2 }];

    beforeEach(() => {
      state.currentSearchID = '1234';
    });

    it('startNewSearch sets a new search ID', () => {
      const newState = reducer(state, startNewSearch('890'));
      expect(newState.currentSearchID).toEqual('890');
    });

    it('updates occurrence data if the searchID matches', () => {
      const newState = reducer(
        state,
        updateOccurrence({
          data: expectedOccurrenceData,
          searchID: '1234',
        })
      );

      expect(newState.occurrence_data).toEqual(expectedOccurrenceData);
    });

    it('does not update occurrence data if the searchID does not match', () => {
      const newState = reducer(
        state,
        updateOccurrence({
          data: expectedOccurrenceData,
          searchID: '5678',
        })
      );

      expect(newState.occurrence_data).toEqual(state.occurrence_data);
    });
  });

  describe('updateMapLayerColour', () => {
    beforeEach(() => {
      state.map_styles.layers = [
        {
          name: 'test layer',
          colorChange: 'fill',
          fillColor: [255, 0, 0, 1],
          strokeColor: [],
          strokeWidth: 1,
          zIndex: 1,
        },
      ];
    });

    it('does not update any layers if the name does not match', () => {
      const newState = reducer(
        state,
        updateMapLayerColour({
          name: 'non existent layer',
          color: [0, 0, 255, 1],
        })
      );
      expect(newState.map_styles.layers).toEqual(state.map_styles.layers);
    });

    it('updates the color correctly for a fill layer', () => {
      const newState = reducer(
        state,
        updateMapLayerColour({ name: 'test layer', color: [0, 0, 255, 1] })
      );
      expect(newState.map_styles.layers[0].fillColor).toEqual([0, 0, 255, 1]);
    });

    it('updates the color correctly for a stroke layer', () => {
      state.map_styles.layers[0].colorChange = 'stroke';
      const newState = reducer(
        state,
        updateMapLayerColour({ name: 'test layer', color: [0, 0, 255, 1] })
      );
      expect(newState.map_styles.layers[0].strokeColor).toEqual([0, 0, 255, 1]);
    });
  });

  describe('layerToggle', () => {
    beforeEach(() => {
      state.map_overlays = [
        {
          name: 'testName',
          displayName: 'testDisplay',
          sourceLayer: 'overlays',
          sourceType: 'raster',
          isVisible: false,
        },
      ];
    });

    it('toggles the visibility of a layer', () => {
      state = reducer(state, layerToggle('testName'));
      expect(
        state.map_overlays.find((l: any) => l.name === 'testName')?.isVisible
      ).toBe(true);

      state = reducer(state, layerToggle('testName'));
      expect(
        state.map_overlays.find((l: any) => l.name === 'testName')?.isVisible
      ).toBe(false);
    });

    it(' does nothing for unrecognised layers', () => {
      const newState = reducer(state, layerToggle('unknownLayer'));
      expect(newState.map_overlays).toEqual(state.map_overlays);
    });
  });

  describe('drawerToggle', () => {
    it('toggles the drawer from open to closed and vice versa', () => {
      const stateDrawerOpen = reducer(state, drawerToggle());
      expect(stateDrawerOpen.map_drawer.open).toEqual(true);

      const stateDrawerClosed = reducer(stateDrawerOpen, drawerToggle());
      expect(stateDrawerClosed.map_drawer.open).toEqual(false);
    });
    it('toggles the drawer list section as expected', () => {
      const newState = reducer(state, drawerListToggle('overlays'));
      expect(newState.map_drawer.overlays).toEqual(true);
      expect(newState.map_drawer.baseMap).not.toEqual(true);
    });
  });

  it('setSelectedIds sets selectedIds', () => {
    const newState = reducer(state, setSelectedIds(['1', '2']));
    expect(newState.selectedIds).toEqual(['1', '2']);
  });

  it('updateSelectedData sets selectedData', () => {
    const newState = reducer(state, updateSelectedData(['1', '2']));
    expect(newState.selectedData).toEqual(['1', '2']);
  });
});
