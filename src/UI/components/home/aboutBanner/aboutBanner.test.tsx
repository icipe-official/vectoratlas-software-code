import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutBanner from './aboutBanner';

describe('AboutBanner component', () => {
  it('renders', () => {
    render(<AboutBanner />);
  });
});
