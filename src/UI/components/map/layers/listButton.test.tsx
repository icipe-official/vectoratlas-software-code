import React from 'react';
import { fireEvent, render, within } from '../../../test_config/render';
import { ListButton } from './listButton';
import { screen } from '@testing-library/dom';
import { initialState } from '../../../state/mapSlice';
import mockStore from '../../../test_config/mockStore';

describe(ListButton.name, () => {
  let localStore: any;
  beforeEach(() => {
    const { wrapper, store } = render(
      <ListButton name="testButton" />,
      initialState
    );
    localStore = store;
  });
  it('renders a layer button with the correct name', () => {
    expect(screen.getByText('testButton')).toBeVisible();
  });
  it('dispatches the correct action when checkbox is toggled', () => {
    // const { store } = mockStore({ map: initialState });
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
