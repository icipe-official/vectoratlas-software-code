import React from 'react';
import { fireEvent, render } from '../../../test_config/render';
import { ListButton } from './listButton';
import { screen } from '@testing-library/dom';
import { initialState } from '../../../state/mapSlice';
import mockStore from '../../../test_config/mockStore';

describe(ListButton.name, () => {
  beforeEach(() => {
    render(<ListButton name="testButton" />);
  });
  it('renders a layer button with the correct name', () => {
    expect(screen.getByText('testButton')).toBeVisible();
  });
  it('dispatches the correct action when checkbox is toggled', () => {
    const { store } = mockStore({ map: initialState });
    fireEvent.click(screen.getByTestId('testButtonCheckbox'));
    const actions = store.getActions();
    console.log(store.getState());
    expect(actions).toHaveLength(1);
    expect(actions[0]).toEqual({ type: 'map/layerToggle' });
  });
});
