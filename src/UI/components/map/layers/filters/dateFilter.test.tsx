import React from 'react';
import { filterHandler, initialState } from '../../../../state/map/mapSlice';
import { fireEvent, render } from '../../../../test_config/render';
import DateFilter from './dateFilter';

jest.mock('@mui/x-date-pickers', () => {
  return {
    DatePicker: jest.requireActual('@mui/x-date-pickers').DesktopDatePicker,
    LocalizationProvider: jest.requireActual('@mui/x-date-pickers')
      .LocalizationProvider,
  };
});

describe('FilterDropDown', () => {
  let state;

  beforeEach(() => {
    state = { map: initialState() };
  });

  it('dispatches the right event when the start time changes', async () => {
    const { wrapper, store } = render(
      <DateFilter filterTitle="Time" filterName="timeRange" />,
      state
    );

    const fromDate = await wrapper.getAllByRole('textbox');
    fireEvent.change(fromDate[0], { target: { value: 'Nov-2022' } });

    expect(store.getActions()[0]).toEqual(
      filterHandler({
        filterName: 'timeRange',
        filterOptions: {
          start: new Date(Date.UTC(2022, 10, 1, 0, 0, 0)).getTime(),
          end: null,
        },
      })
    );
  });

  it('dispatches the right event when the end time changes', async () => {
    const { wrapper, store } = render(
      <DateFilter filterTitle="Time" filterName="timeRange" />,
      state
    );

    const fromDate = await wrapper.getAllByRole('textbox');
    fireEvent.change(fromDate[1], { target: { value: 'Nov-2022' } });

    expect(store.getActions()[0]).toEqual(
      filterHandler({
        filterName: 'timeRange',
        filterOptions: {
          start: null,
          end: new Date(Date.UTC(2022, 10, 1, 0, 0, 0)).getTime(),
        },
      })
    );
  });
});