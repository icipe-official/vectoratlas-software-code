import { initialState } from '../state/config/configSlice';
import { AppState } from '../state/store';
import { render } from '../test_config/render';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../pages';

jest.mock(
  '../components/home/aboutBanner',
  () =>
    function MockMapBanner() {
      return <div data-testid="about">about</div>;
    }
);
jest.mock(
  '../components/home/newsBox',
  () =>
    function MockNewsBox() {
      return <div data-testid="newsBox">newsBox</div>;
    }
);
jest.mock(
  '../components/home/statsBox',
  () =>
    function MockStatsBox() {
      return <div data-testid="statsBox">statsBox</div>;
    }
);

describe('Home page', () => {
  it('displays the correct items with no feature flags off', () => {
    const state: Partial<AppState> = {
      config: {
        ...initialState,
        feature_flags: [
          { flag: 'HOME_NEWS', on: true },
          { flag: 'HOME_STATS', on: true },
        ],
      },
    };

    render(<Home />, state);
    expect(screen.getByTestId('about')).toHaveTextContent('about');
    expect(screen.getByTestId('newsBox')).toHaveTextContent('newsBox');
    expect(screen.getByTestId('statsBox')).toHaveTextContent('statsBox');
  });

  it('displays the correct menu items with feature flags off', () => {
    const state: Partial<AppState> = {
      config: {
        ...initialState,
        feature_flags: [
          { flag: 'HOME_NEWS', on: false },
          { flag: 'HOME_STATS', on: false },
        ],
      },
    };

    render(<Home />, state);
    expect(screen.getByTestId('about')).toHaveTextContent('about');
    expect(screen.queryByTestId('newsBox')).not.toBeInTheDocument();
    expect(screen.queryByTestId('statsBox')).not.toBeInTheDocument();
  });
});
