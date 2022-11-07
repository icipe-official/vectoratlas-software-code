import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loader from './loader';


describe('Loader component', () => {
  it('renders', () => {
    render(<Loader />);
  });
});
