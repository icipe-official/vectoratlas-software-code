import React from 'react';
import { fireEvent, render } from '../../../test_config/render';
import { screen } from '@testing-library/dom';
import { initialState } from '../../../state/map/mapSlice';
import { DownloadDataControl } from './downloadDataControl';
import { AppState } from '../../../state/store';
import { getFilteredData } from '../../../state/map/actions/getFilteredData';

jest.mock('../../../state/map/actions/getFilteredData', () => ({
  getFilteredData: jest.fn().mockImplementation((payload) => ({
    type: 'getFilteredDataMock',
    payload,
  })),
}));

describe('DownloadDataControl', () => {
  let state: Partial<AppState>;

  beforeEach(() => {
    state = {
      map: initialState(),
    };
  });

  it('renders a download button', () => {
    render(<DownloadDataControl />, state);
    expect(screen.getByText('Download Filtered Data')).toBeVisible();
  });

  it('dispatches the correct action when button is clicked', () => {
    const testFilters = {
      control: {
        value: [true],
      },
      country: {
        value: ['testCountry'],
      },
      isAdult: {
        value: [false],
      },
      isLarval: {
        value: [true],
      },
      season: {
        value: ['testSeason'],
      },
      species: {
        value: ['testSpecies'],
      },
      timeRange: {
        value: {
          start: 1234,
          end: 4567,
        },
      },
    };
    const expected = {
      control: { value: [true] },
      country: { value: ['testCountry'] },
      isAdult: { value: [false] },
      isLarval: { value: [true] },
      season: { value: ['testSeason'] },
      species: { value: ['testSpecies'] },
      timeRange: { value: { end: 4567, start: 1234 } },
    };
    state.map.filters = testFilters;
    render(<DownloadDataControl />, state);
    const testDownloadButton = screen.getByText('Download Filtered Data');
    fireEvent.click(testDownloadButton);
    expect(getFilteredData).toBeCalledWith(expected);
  });
});
