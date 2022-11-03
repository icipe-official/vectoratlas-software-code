import React from 'react';
import { fireEvent, render, within } from '../../../test_config/render';
import { MultipleFilterToggle } from './filterToggle';
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
  it('renders a toggle filter component', () => {
    expect(screen.getByText('Country')).toBeVisible();
  });
  it('dispatches the correct action when item added or removed from filter', () => {
    const dropDown: any = document.querySelector(
      '[aria-label="dropDownSelect"]'
    );
    const toggleSwitch: any = document.querySelector('[aria-label="Switch"]');
    fireEvent.click(toggleSwitch);
    fireEvent.click(dropDown);
    const itemButton: any = document.querySelector('[aria-label="SudanItem"]');
    fireEvent.click(itemButton);
    const actions = localStore.getActions();
    expect(actions).toHaveLength(1);
    console.log(actions);
  });
});
