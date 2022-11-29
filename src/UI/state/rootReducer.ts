import { combineReducers } from 'redux';
import configReducer from './configSlice';
import mapReducer from './map/mapSlice';
import authReducer from './authSlice';
import sourceReducer from './sourceSlice';
import speciesInfoReducer from './speciesInformation/speciesInformationSlice';

const rootReducer = combineReducers({
  config: configReducer,
  map: mapReducer,
  auth: authReducer,
  source: sourceReducer,
  speciesInfo: speciesInfoReducer,
});

export default rootReducer;
