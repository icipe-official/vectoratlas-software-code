import { AppState } from '../../state/store';
import { renderWithUser, render } from '../../test_config/render';
import { screen } from '@testing-library/react';
import AuthWrapper from './AuthWrapper';
import * as router from 'next/router';
import { initialState } from '../../state/auth/authSlice';

describe('AuthWrapper', () => {
  it('renders nothing if user token is loading', () => {
    const state: Partial<AppState> = {
      auth: { ...initialState() },
    };
    renderWithUser(
      <AuthWrapper role="uploader">
        <div data-testid="child"></div>
      </AuthWrapper>,
      state,
      { nickname: 'Test user' }
    );

    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    expect(screen.queryByTestId('unauthorized')).not.toBeInTheDocument();
  });

  it('redirects to login if not logged in', () => {
    const mockPush = jest.fn();
    jest.spyOn(router, 'useRouter').mockReturnValue({
      push: mockPush,
    });
    const state: Partial<AppState> = {
      auth: { ...initialState() },
    };
    renderWithUser(
      <AuthWrapper role="uploader">
        <div data-testid="child"></div>
      </AuthWrapper>,
      state,
      {}
    );

    expect(mockPush).toHaveBeenCalledWith('/api/auth/login');
  });

  it('renders unauthorized message if user doesnt have role', () => {
    const state: Partial<AppState> = {
      auth: { ...initialState(), roles: ['admin'], isLoading: false },
    };
    renderWithUser(
      <AuthWrapper role="uploader">
        <div data-testid="child"></div>
      </AuthWrapper>,
      state,
      { nickname: 'Test user' }
    );

    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    expect(screen.getByTestId('unauthorized')).toBeInTheDocument();
  });

  it('renders child if user is authorized', () => {
    const state: Partial<AppState> = {
      auth: { ...initialState(), roles: ['uploader'], isLoading: false },
    };
    renderWithUser(
      <AuthWrapper role="uploader">
        <div data-testid="child"></div>
      </AuthWrapper>,
      state,
      { nickname: 'Test user' }
    );

    expect(screen.queryByTestId('child')).toBeInTheDocument();
    expect(screen.queryByTestId('unauthorized')).not.toBeInTheDocument();
  });

  it('renders child if user is authorized and no role is passed in', () => {
    const state: Partial<AppState> = {
      auth: { ...initialState(), roles: [], isLoading: false },
    };
    renderWithUser(
      <AuthWrapper role="">
        <div data-testid="child"></div>
      </AuthWrapper>,
      state,
      { nickname: 'Test user' }
    );

    expect(screen.queryByTestId('child')).toBeInTheDocument();
    expect(screen.queryByTestId('unauthorized')).not.toBeInTheDocument();
  });

  it('renders the correct prefix for unauthorized uploader', () => {
    const state: Partial<AppState> = {
      auth: { ...initialState(), roles: [], isLoading: false },
    };
    renderWithUser(
      <AuthWrapper role="uploader">
        <div data-testid="child"></div>
      </AuthWrapper>,
      state,
      { nickname: 'Test uploader' }
    );

    expect(
      screen.getByText('You are not currently an uploader...')
    ).toBeVisible();
  });

  it('renders the correct prefix for unauthorized admin', () => {
    const state: Partial<AppState> = {
      auth: { ...initialState(), roles: [], isLoading: false },
    };
    renderWithUser(
      <AuthWrapper role="admin">
        <div data-testid="child"></div>
      </AuthWrapper>,
      state,
      { nickname: 'Test uploader' }
    );

    expect(screen.getByText('You are not currently an admin...')).toBeVisible();
  });

  it('renders the correct prefix for unauthorized editor', () => {
    const state: Partial<AppState> = {
      auth: { ...initialState(), roles: [], isLoading: false },
    };
    renderWithUser(
      <AuthWrapper role="editor">
        <div data-testid="child"></div>
      </AuthWrapper>,
      state,
      { nickname: 'Test uploader' }
    );

    expect(
      screen.getByText('You are not currently an editor...')
    ).toBeVisible();
  });

  it('renders the correct prefix for unauthorized reviewer', () => {
    const state: Partial<AppState> = {
      auth: { ...initialState(), roles: [], isLoading: false },
    };
    renderWithUser(
      <AuthWrapper role="reviewer">
        <div data-testid="child"></div>
      </AuthWrapper>,
      state,
      { nickname: 'Test uploader' }
    );

    expect(
      screen.getByText('You are not currently a reviewer...')
    ).toBeVisible();
  });
});
