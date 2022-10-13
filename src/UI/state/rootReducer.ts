import { combineReducers } from 'redux';
import configReducer from './configSlice';
import mapReducer from './mapSlice';
import authReducer from './authSlice';
import sourceReducer from './sourceSlice';

const rootReducer = combineReducers({
  config: configReducer,
  map:  mapReducer,
  auth: authReducer,
  source: sourceReducer
});

export default rootReducer;
