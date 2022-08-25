import { initialState } from '../../state/configSlice';
import { AppState } from '../../state/store';
import { renderWithUser } from '../../test_config/render';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './navbar';

jest.mock(
  './navlink',
  () =>
    function MockNavLink({ text }: { text: string }) {
      return <div data-testid={text}>{text}</div>;
    }
);
jest.mock(
  './userInfo',
  () =>
    function MockUserInfo() {
      return <div data-testid='userInfo'>UserInfo</div>;
    }
);

describe('Navbar component', () => {
  it('displays the correct menu items with no feature flags off', () => {
    const state: Partial<AppState> = {
      config: { ...initialState, feature_flags: [{ flag: 'MAP', on: true }] },
    };

    renderWithUser(<Navbar />, state, {});
    expect(screen.getByTestId('Home')).toHaveTextContent('Home');
    expect(screen.getByTestId('Map')).toHaveTextContent('Map');
    expect(screen.getByTestId('About')).toHaveTextContent('About');
  });

  it('displays the correct menu items with feature flags off', () => {
    const state: Partial<AppState> = {
      config: { ...initialState, feature_flags: [{ flag: 'MAP', on: false }] },
    };

    renderWithUser(<Navbar />, state, {});
    expect(screen.getByTestId('Home')).toHaveTextContent('Home');
    expect(screen.queryByTestId('Map')).not.toBeInTheDocument();
    expect(screen.getByTestId('About')).toHaveTextContent('About');
  });

  it('displays the correct menu items with user signed in', () => {
    const state: Partial<AppState> = {
      config: { ...initialState, feature_flags: [{ flag: 'MAP', on: false }] },
    };

    renderWithUser(<Navbar />, state, { nickname: 'Test user' });
    expect(screen.getByTestId('userInfo')).toHaveTextContent('UserInfo');
    expect(screen.queryByTestId('Login')).not.toBeInTheDocument();
  });

  it('displays the correct menu items with user not signed in', () => {
    const state: Partial<AppState> = {
      config: { ...initialState, feature_flags: [{ flag: 'MAP', on: false }] },
    };

    renderWithUser(<Navbar />, state, undefined);
    expect(screen.getByTestId('Login')).toHaveTextContent('Login');
    expect(screen.queryByTestId('userInfo')).not.toBeInTheDocument();
  });
});
