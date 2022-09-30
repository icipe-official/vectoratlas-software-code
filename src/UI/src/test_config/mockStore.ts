import configureStore from 'redux-mock-store';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { rootInitialState, AppState } from '../state/store';
import { AnyAction } from '@reduxjs/toolkit';

type DispatchExts = ThunkDispatch<AppState, void, AnyAction>;

const mockStoreConf = configureStore<AppState, DispatchExts>([thunk]);

export const mockInitialState: AppState = {
  ...rootInitialState,
};

export default function mockStore(preloadedState: Partial<AppState>) {
  const store = mockStoreConf({ ...mockInitialState, ...preloadedState });

  return { store };
}
