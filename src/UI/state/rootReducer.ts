import { combineReducers } from 'redux';
import configReducer from './configSlice';
import mapReducer from './mapSlice';
  
const rootReducer = combineReducers({
  config: configReducer,
  map:  mapReducer
});
  
export default rootReducer;
