import React from 'react'; // or change tsconfig compilerOptions to 'jsx':'react-jsx'
import { render } from '@testing-library/react';
import AboutPartner from './aboutPartner';

describe(AboutPartner.name, () => {
  it('renders the header of th', () => {
    render(<AboutPartner />);
  });
});
