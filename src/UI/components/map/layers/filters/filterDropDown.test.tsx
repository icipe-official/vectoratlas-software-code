import { CombinedState } from '@reduxjs/toolkit';
import React from 'react';
import { AuthState } from '../../../../state/authSlice';
import { ConfigState } from '../../../../state/configSlice';
import {
  filterHandler,
  initialState,
  MapState,
} from '../../../../state/map/mapSlice';
import { SourceState } from '../../../../state/sourceSlice';
import { fireEvent, render, within } from '../../../../test_config/render';
import FilterDropDown from './filterDropDown';

/* eslint-disable react/display-name*/
jest.mock('@mui/material/Autocomplete', () => (props) => (
  <div>
    <div>Autocomplete mock {JSON.stringify(props)}</div>
    <input role="input" onChange={(e) => props.onChange(e, e.target.value)} />
  </div>
));
/* eslint-enable react/display-name*/

describe('FilterDropDown', () => {
  let state:
    | Partial<
        CombinedState<{
          config: ConfigState;
          map: MapState;
          auth: AuthState;
          source: SourceState;
        }>
      >
    | undefined;

  beforeEach(() => {
    state = { map: initialState() };
  });

  it('renders correctly for a given filter', () => {
    state.map.filterValues.country = ['Kenya', 'Uganda', 'Tanzania'];
    state.map.filters.country.value = ['Kenya'];

    const { wrapper } = render(
      <FilterDropDown filterTitle={'Country'} filterName="country" />,
      state
    );

    expect(wrapper.container).toMatchSnapshot();
  });

  it('dispatches the correct filter update when the value changes', async () => {
    const { wrapper, store } = render(
      <FilterDropDown filterTitle={'Country'} filterName="country" />,
      state
    );

    const input = await wrapper.getByRole('input');
    fireEvent.change(input, { target: { value: 'Kenya' } });

    expect(store.getActions()[0]).toEqual(
      filterHandler({
        filterName: 'country',
        filterOptions: 'Kenya',
      })
    );
  });
});
