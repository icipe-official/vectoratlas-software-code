import React from 'react';
import { fireEvent, render, within } from '../../../test_config/render';
import { ListButton } from './listButton';
import { screen } from '@testing-library/dom';
import { initialState } from '../../../state/map/mapSlice';

describe(ListButton.name, () => {
  let localStore: any;
  beforeEach(() => {
    const { store } = render(<ListButton name="testButton" />, {
      map: initialState,
    });
    localStore = store;
  });
  it('renders a layer button with the correct name', () => {
    expect(screen.getByText('testButton')).toBeVisible();
  });
  it('dispatches the correct action when checkbox is toggled', () => {
    const testButtonCheckbox = screen.getByTestId('testButtonCheckbox');
    const checkboxInput = within(testButtonCheckbox).getByRole('checkbox');
    fireEvent.click(checkboxInput);
    const actions = localStore.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual({
      payload: 'testButton',
      type: 'map/layerToggle',
    });
  });
});
