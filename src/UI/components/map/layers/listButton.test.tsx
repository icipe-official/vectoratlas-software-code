import React from 'react';
import {render} from '../../../test_config/render';
import {ListButton} from './listButton';
import { screen } from '@testing-library/dom';

describe(ListButton.name, () => {
  it('renders a layer button with the correct name', () => {
    const nameTest = 'testButton';
    render(<ListButton name={nameTest}/>);
    expect(screen.getByText(`${nameTest}`)).toBeVisible();
  });
});
