import { AppState } from "../../state/store";
import { initialState } from '../../state/authSlice';
import { renderWithUser, render } from "../../test_config/render";
import { screen } from '@testing-library/react';
import AuthWrapper from "./AuthWrapper";
import * as router from 'next/router';

describe('AuthWrapper', () => {
  it('renders nothing if user token is loading', () => {
    const state: Partial<AppState> = {
      auth: { ...initialState },
    };
    renderWithUser(<AuthWrapper role='uploader'><div data-testid='child'></div></AuthWrapper>, state, { nickname: 'Test user' });

    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    expect(screen.queryByTestId('unauthorized')).not.toBeInTheDocument();
  });

  it('redirects to login if not logged in', () => {
    const mockPush = jest.fn()
    jest.spyOn(router, 'useRouter').mockReturnValue({
      push: mockPush
    })
    const state: Partial<AppState> = {
      auth: { ...initialState },
    };
    renderWithUser(<AuthWrapper role='uploader'><div data-testid='child'></div></AuthWrapper>, state, {});

    expect(mockPush).toHaveBeenCalledWith('/api/auth/login')
  });

  it('renders unauthorized message if user doesnt have role', () => {
    const state: Partial<AppState> = {
      auth: { ...initialState, roles: ['admin'], isLoading: false },
    };
    renderWithUser(<AuthWrapper role='uploader'><div data-testid='child'></div></AuthWrapper>, state, { nickname: 'Test user' });

    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    expect(screen.getByTestId('unauthorized')).toBeInTheDocument();
  });

  it('renders child if user is authorized', () => {
    const state: Partial<AppState> = {
      auth: { ...initialState, roles: ['uploader'], isLoading: false },
    };
    renderWithUser(<AuthWrapper role='uploader'><div data-testid='child'></div></AuthWrapper>, state, { nickname: 'Test user' });

    expect(screen.queryByTestId('child')).toBeInTheDocument();
    expect(screen.queryByTestId('unauthorized')).not.toBeInTheDocument();
  });
})