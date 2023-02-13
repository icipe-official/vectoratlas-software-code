import { render } from '../../../test_config/render';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { AppState } from '../../../state/store';
import { initialState } from '../../../state/home/homeSlice';
import StatsToggle from './statsToggle';

describe('StatsToggle component', () => {
  let state: Partial<AppState>;
  state = {
    home: initialState(),
  };
  it('renders the currently hardcoded stats', () => {
    render(<StatsToggle />, state);
    expect(screen.getByText('downloads')).toBeInTheDocument();
  });
});
