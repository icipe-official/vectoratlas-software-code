import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import EndMsg from './endMsg';

describe('EndMsg component', () => {
  it('renders', () => {
    render(<EndMsg />);
  });
});
