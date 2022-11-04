import React from 'react';
import { fireEvent, render } from '../../../test_config/render';
import { screen } from '@testing-library/dom';
import { initialState } from '../../../state/mapSlice';
import FilterDropDown from './filterDropDown';

describe(FilterDropDown.name, () => {
  let localStore: any;
  beforeEach(() => {
    const { store } = render(<FilterDropDown filterTitle={'Country'} />, {
      map: initialState,
    });
    localStore = store;
  });
  it('renders a dropdown filter component', () => {
    expect(screen.getByText('Country')).toBeVisible();
  });
  it('dispatches the correct action when item added or removed from filter', () => {
    const dropDown: any = screen
      .getByTestId('dropDownSelect')
      .querySelector('input');
    const toggleSwitch: any = screen.getByTestId('Switch');
    fireEvent.click(toggleSwitch);
    fireEvent.change(dropDown, { target: { value: ['Sudan'] } });
    const actions = localStore.getActions();
    expect(actions).toHaveLength(2);
    expect(actions).toEqual([
      { payload: 'setCountry', type: 'map/activeFilterToggle' },
      {
        payload: { filterName: 'country', filterOptions: 'Sudan' },
        type: 'map/filterHandler',
      },
    ]);
  });
});
