import React from 'react';
import { render } from '@testing-library/react';
import { MapWrapper } from './map';

describe(MapWrapper.name, () => {
  it('renders the map wrapper', () => {
    render(<MapWrapper />);
  });
});
