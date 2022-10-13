import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;
export const rootInitialState = store.getState() as AppState;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
