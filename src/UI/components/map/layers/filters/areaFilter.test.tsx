import React from 'react';
import { initialState } from '../../../../state/map/mapSlice';
import { AreaFilters } from './areaFilter';
import { fireEvent, render } from '../../../../test_config/render';

describe('AreaFilters', () => {
  let state;

  beforeEach(() => {
    state = { map: initialState() };
  });

  it('dispatches toggleAreaMode when mode button clicked', async () => {
    state.map.areaSelectModeOn = false;
    const { wrapper, store } = render(<AreaFilters />, state);

    const buttons = await wrapper.findAllByRole('button');
    fireEvent.click(buttons[0]);

    const actions = store.getActions();
    expect(actions[0]).toEqual({ payload: true, type: 'map/toggleAreaMode' });
  });

  it('dispatches updateAreaFilter when reset button clicked and a boundary exists', async () => {
    state.map.areaSelectModeOn = false;
    state.map.filters.areaCoordinates.value = [
      [0, 1],
      [2, 3],
    ];

    const { wrapper, store } = render(<AreaFilters />, state);

    const resetButton = wrapper.getByText('Remove selection');
    fireEvent.click(resetButton);

    const actions = store.getActions();
    expect(actions[0]).toEqual({ payload: [], type: 'map/updateAreaFilter' });
  });
});
