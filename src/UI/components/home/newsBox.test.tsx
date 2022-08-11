import {render} from '@testing-library/react';
import '@testing-library/jest-dom';
import NewsBox from './newsBox';

describe('NewsBox component', () => {
  it('renders', () => {
    render(<NewsBox />);
  });
});
