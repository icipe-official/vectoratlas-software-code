import { combineReducers } from 'redux';
import configReducer from './config/configSlice';
import mapReducer from './map/mapSlice';
import authReducer from './auth/authSlice';
import sourceReducer from './source/sourceSlice';
import speciesInfoReducer from './speciesInformation/speciesInformationSlice';
import newsReducer from './news/newsSlice';
import homeReducer from './home/homeSlice';
import adminReducer from './admin/adminSlice';
import reviewReducer from './review/reviewSlice';

import uploadReducer from './upload/uploadSlice';
import uploadedDatasetReducer from './uploadedDataset/uploadedDatasetSlice';
import doiReducer from './doi/doiSlice';

const rootReducer = combineReducers({
  config: configReducer,
  map: mapReducer,
  auth: authReducer,
  source: sourceReducer,
  speciesInfo: speciesInfoReducer,
  news: newsReducer,
  upload: uploadReducer,
  home: homeReducer,
  admin: adminReducer,
  review: reviewReducer,
  uploadedDataset: uploadedDatasetReducer,
  doi: doiReducer,
});

export default rootReducer;
