import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import configReducer from './configSlice'

export function makeStore() {
  return configureStore({
    reducer: { config: configReducer },
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>
export const rootInitialState = store.getState() as AppState;

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export default store