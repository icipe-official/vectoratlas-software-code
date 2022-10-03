import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapBox from './mapBox';

describe('MapBox component', () => {
  it('renders', () => {
    render(<MapBox />);
  });
});
