import React from 'react';
import { fireEvent, render } from '../../../test_config/render';
import { screen } from '@testing-library/dom';
import { initialState } from '../../../state/mapSlice';
import ViewsDatePicker from './filterDatePicker';

describe(ViewsDatePicker.name, () => {
  let localStore: any;
  beforeEach(() => {
    const { store } = render(<ViewsDatePicker filterTitle={'Time'} />, {
      map: initialState,
    });
    localStore = store;
  });
  it('renders a toggle filter component', () => {
    expect(screen.getByText('Time')).toBeVisible();
  });
  it('dispatches the correct action when from time is changed', () => {
    const fromDatePickerBox: any = document
      .querySelector('[aria-label = "datePickerFromBox"]')
      ?.querySelector('div')
      ?.querySelector('input');
    const toggleSwitch: any = screen.getByTestId('Switch');
    fireEvent.click(toggleSwitch);
    fireEvent.change(fromDatePickerBox, { target: { value: '10-2021' } });
    const actions = localStore.getActions();
    expect(actions).toHaveLength(2);
    expect(actions).toEqual([
      { payload: 'setTime', type: 'map/activeFilterToggle' },
      {
        payload: { filterName: 'startTimestamp', filterOptions: 1633042800000 },
        type: 'map/filterHandler',
      },
    ]);
  });
  it('dispatches the correct action when to time is changed', () => {
    const toDatePickerBox: any = document
      .querySelector('[aria-label = "datePickerToBox"]')
      ?.querySelector('div')
      ?.querySelector('input');
    const toggleSwitch: any = screen.getByTestId('Switch');
    fireEvent.click(toggleSwitch);
    fireEvent.change(toDatePickerBox, { target: { value: '10-2022' } });
    const actions = localStore.getActions();
    expect(actions).toHaveLength(2);
    expect(actions).toEqual([
      { payload: 'setTime', type: 'map/activeFilterToggle' },
      {
        payload: { filterName: 'endTimestamp', filterOptions: 1664578800000 },
        type: 'map/filterHandler',
      },
    ]);
  });
});
