import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapBanner from './mapBanner';

describe('MapBanner component', () => {
  it('renders', () => {
    render(<MapBanner />);
  });
});
