import { render } from '../../../test_config/render';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import StatsBox from './statsBox';
import { AppState } from '../../../state/store';
import { initialState } from '../../../state/home/homeSlice';

describe('StatsBox component', () => {
  let state: Partial<AppState>;
  state = {
    home: initialState(),
  };
  it('renders the currently hardcoded stats', () => {
    render(<StatsBox />, state);
    expect(screen.getByText('vector records')).toBeInTheDocument();
    expect(screen.getByText('visited...')).toBeInTheDocument();
    expect(screen.getByText('by..')).toBeInTheDocument();
  });
});
