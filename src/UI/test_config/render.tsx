import React, { ReactElement } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { UserProfile, UserProvider } from '@auth0/nextjs-auth0';
import { render as statelessRender } from '@testing-library/react';
import { AppState } from '../state/store';
import mockStore from './mockStore';

const customRender = (
  ui: ReactElement,
  preloadedState?: Partial<AppState>,
  options = {}
) => {
  const { store } = mockStore(preloadedState as AppState);

  const AllTheProviders = ({children}: {children: ReactElement}) => {
    return (
      <ReduxProvider  store={store}>
        {children}
      </ReduxProvider>
    )
  }

  const wrapper = statelessRender(ui, {wrapper: AllTheProviders, ...options})
  return { wrapper, store, history };
}

export const renderWithUser = (
  ui: ReactElement,
  preloadedState?: Partial<AppState>,
  user?: Partial<UserProfile>,
  options = {}
) => {
  const { store } = mockStore(preloadedState as AppState);

  const AllTheProviders = ({children}: {children: ReactElement}) => {
    return (
      <ReduxProvider  store={store}>
        <UserProvider user={user}>
          {children}
        </UserProvider>
      </ReduxProvider>
    )
  }

  const wrapper = statelessRender(ui, {wrapper: AllTheProviders, ...options})
  return { wrapper, store, history };
}

// re-export everything
export * from '@testing-library/react'

// override render method
export {customRender as render};
