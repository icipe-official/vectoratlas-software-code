import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import AboutHeader from './aboutHeader';

describe(AboutHeader.name, () => {
  it('renders the header of th', () => {
    render(<AboutHeader />);
    expect(screen.getByText('About')).toBeVisible();
    // Test for redirect to guide when applicable
  });
});
