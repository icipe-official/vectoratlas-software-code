import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import AboutContact from './aboutContact';

describe(AboutContact.name, () => {
  it('renders the correct number of contact panels', () => {
    render(<AboutContact />);

    expect(screen.getByText('Vector Atlas project team')).toBeInTheDocument();
    expect(screen.getByText('vectoratlas@icipe.org')).toBeInTheDocument();
  });
});
