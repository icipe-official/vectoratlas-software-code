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
import communicationLogReducer from './communicationLog/communicationLogSlice';
import uploadedModelReducer from './uploadedModel/uploadedModelSlice';
import datasetReducer from './approval/approvalSlice';
import localizationReducer from './localization/localizationSlice';
import ingestJobReducer from './uploadedDataset/ingestJobSlice';

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
  ingestJob: ingestJobReducer,
  doi: doiReducer,
  communicationLog: communicationLogReducer,
  uploadedModel: uploadedModelReducer,
  dataset: datasetReducer,
  localization: localizationReducer,
});

export default rootReducer;
