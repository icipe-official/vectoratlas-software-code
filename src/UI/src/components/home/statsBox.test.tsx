import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatsBox from './statsBox';

describe('StatsBox component', () => {
  it('renders', () => {
    render(<StatsBox />);
  });
});
