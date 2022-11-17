import React from 'react';
import { fireEvent, render, within } from '../../../test_config/render';
import { screen } from '@testing-library/dom';
import { initialState } from '../../../state/map/mapSlice';
import { DownloadDataControl } from './downloadDataControl';
import { AppState } from '../../../state/store';

describe(DownloadDataControl.name, () => {
  let state: Partial<AppState>;
  beforeEach(() => {
    state = { map: initialState() };
  });
  it('renders a download button', () => {
    const { store } = render(<DownloadDataControl />, state);
    expect(screen.getByText('Download Filtered Data')).toBeVisible();
  });
  it('dispatches the correct action when button is clicked', () => {
    const { store } = render(<DownloadDataControl />, state);
    const testDownloadButton = screen.getByText('Download Filtered Data');
    fireEvent.click(testDownloadButton);
    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual({
      meta: {
        arg: {
          control: {
            value: [],
          },
          country: {
            value: [],
          },
          isAdult: {
            value: [],
          },
          isLarval: {
            value: [],
          },
          season: {
            value: [],
          },
          species: {
            value: [],
          },
          timeRange: {
            value: {
              end: null,
              start: null,
            },
          },
        },
        requestId: 'sPSlfJTGsXMhY523bE9AQ',
        requestStatus: 'pending',
      },
      payload: undefined,
      type: 'export/getFilteredData/pending',
    });
  });
});
