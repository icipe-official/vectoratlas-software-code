import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutMapOverlay from './aboutMapOverlay';

describe('aboutMapOverlay component', () => {
  it('renders', () => {
    render(
      <AboutMapOverlay buttonColor="secondary" buttonText="Find out more" />
    );
  });
});
