import { combineReducers } from 'redux';
import configReducer from './config/configSlice';
import mapReducer from './map/mapSlice';
import authReducer from './auth/authSlice';
import sourceReducer from './source/sourceSlice';
import speciesInfoReducer from './speciesInformation/speciesInformationSlice';
import newsReducer from './news/newsSlice';

import uploadReducer from './upload/uploadSlice';

const rootReducer = combineReducers({
  config: configReducer,
  map: mapReducer,
  auth: authReducer,
  source: sourceReducer,
  speciesInfo: speciesInfoReducer,
  news: newsReducer,
  upload: uploadReducer,
});

export default rootReducer;
