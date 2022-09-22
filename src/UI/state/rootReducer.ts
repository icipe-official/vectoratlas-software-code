import { combineReducers } from 'redux';
import configReducer from './configSlice';
import mapReducer from './mapSlice';
import authReducer from './authSlice';

const rootReducer = combineReducers({
  config: configReducer,
  map:  mapReducer,
  auth: authReducer
});

export default rootReducer;
