import { initialState } from '../src/state/configSlice';
import { AppState } from '../src/state/store';
import { render } from '../src/test_config/render';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../pages';

jest.mock(
  '../src/components/home/aboutBanner',
  () =>
    function MockAboutBanner() {
      return <div data-testid="about">about</div>;
    }
);
jest.mock(
  '../src/components/home/newsBox',
  () =>
    function MockNewsBox() {
      return <div data-testid="newsBox">newsBox</div>;
    }
);
jest.mock(
  '../src/components/home/statsBox',
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
