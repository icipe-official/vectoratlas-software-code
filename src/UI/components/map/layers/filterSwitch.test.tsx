import React from 'react';
import { fireEvent, render, within } from '../../../test_config/render';
import { MultipleFilterToggle } from './filterToggle';
import { screen } from '@testing-library/dom';
import { initialState } from '../../../state/mapSlice';
import FilterSwitch from './filterSwitch';

describe(MultipleFilterToggle.name, () => {
  let localStore: any;
  beforeEach(() => {
    const { store } = render(<FilterSwitch filterName="testSwitch" />, {
      map: initialState,
    });
    localStore = store;
  });
  it('renders a switch component', () => {
    expect(screen.getByText('testSwitch')).toBeVisible();
  });
  it('dispatches the correct action when toggle switch clicked', () => {
    const toggleSwitch: any = document.querySelector('[aria-label="Switch"]');
    fireEvent.click(toggleSwitch);
    const actions = localStore.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual({
      payload: 'settestSwitch',
      type: 'map/activeFilterToggle',
    });
  });
});
