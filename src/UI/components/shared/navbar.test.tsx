import { AppState } from '../../state/store';
import { renderWithUser } from '../../test_config/render';
import { act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './navbar';
import { initialState } from '../../state/config/configSlice';
import { AuthState } from '../../state/auth/authSlice';

jest.mock(
  './navlink',
  () =>
    function MockNavLink({ text }: { text: string }) {
      return (
        <div key={text} data-testid={text}>
          {text}
        </div>
      );
    }
);
jest.mock(
  './navmenu',
  () =>
    function MockNavMenu({ text, options }: { text: string, options: any }) {
      return (
        <div key={text} data-testid={text}>
          {text}
          {options.map((o: any) => `${o.text}: ${o.url}`)}
        </div>
      );
    }
);
jest.mock(
  './userInfo',
  () =>
    function MockUserInfo() {
      return (
        <div key="user" data-testid="userInfo">
          UserInfo
        </div>
      );
    }
);

describe('Navbar component', () => {
  it('displays the correct menu items with no feature flags off', () => {
    const state: Partial<AppState> = {
      config: { ...initialState, feature_flags: [{ flag: 'MAP', on: true }] },
    };

    renderWithUser(<Navbar />, state, {});
    expect(screen.getByTestId('Map')).toHaveTextContent('Map');
    expect(screen.getByTestId('About')).toHaveTextContent('About');
    expect(screen.getByTestId('News')).toHaveTextContent('News');
    expect(screen.getByTestId('More')).toHaveTextContent('More');
  });

  it('displays the correct menu items with feature flags off', () => {
    const state: Partial<AppState> = {
      config: { ...initialState, feature_flags: [{ flag: 'MAP', on: false }] },
    };

    renderWithUser(<Navbar />, state, {});
    expect(screen.queryByTestId('Map')).not.toBeInTheDocument();
    expect(screen.getByTestId('About')).toHaveTextContent('About');
    expect(screen.getByTestId('More')).toHaveTextContent('More');
  });

  it('displays the correct menu items with user signed in', async () => {
    const state: Partial<AppState> = {
      config: { ...initialState, feature_flags: [{ flag: 'MAP', on: false }] },
    };

    renderWithUser(<Navbar />, state, { nickname: 'Test user' });
    expect(screen.getByTestId('userInfo')).toHaveTextContent('UserInfo');
    expect(screen.queryByTestId('Login')).not.toBeInTheDocument();
  });

  it('displays the correct menu items with user not signed in', async () => {
    const state: Partial<AppState> = {
      config: { ...initialState, feature_flags: [{ flag: 'MAP', on: false }] },
    };

    await act(async () => {
      renderWithUser(<Navbar />, state, undefined);
      return undefined;
    });
    expect(screen.getByTestId('Login')).toHaveTextContent('Login');
    expect(screen.queryByTestId('userInfo')).not.toBeInTheDocument();
  });

  it('renders admin menu option if admin user', async () => {
    const state: Partial<AppState> = {
      config: { ...initialState, feature_flags: [{ flag: 'MAP', on: false }] },
      auth: { roles: ['admin']} as any
    };

    renderWithUser(<Navbar />, state, { nickname: 'Test user' });

    expect(screen.getByText('Admin: /admin', {exact: false})).toBeInTheDocument();
  })
});
