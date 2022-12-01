import { combineReducers } from 'redux';
import configReducer from './config/configSlice';
import mapReducer from './map/mapSlice';
import authReducer from './auth/authSlice';
import sourceReducer from './source/sourceSlice';

const rootReducer = combineReducers({
  config: configReducer,
  map: mapReducer,
  auth: authReducer,
  source: sourceReducer,
});

export default rootReducer;
