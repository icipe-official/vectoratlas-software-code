import * as convict from 'convict';

const config = convict({
  publicFolder: {
    type: String,
    doc: 'The location of the public assets',
    default: process.cwd(),
    env: 'PUBLIC_FOLDER',
  },
  configFolder: {
    type: String,
    doc: 'The location of the config files for the API',
    default: process.cwd() + '/public',
    env: 'CONFIG_FOLDER',
  },
  modelOutputBlobFolder: {
    type: String,
    doc: 'The location of model output files that have been uploaded',
    default: process.cwd() + '/../TileServer/data/blobStore/',
    env: 'OVERLAY_BLOB_FOLDER',
  },
  datasetBlobFolder: {
    type: String,
    doc: 'The location where draft datasets have been uploaded',
    default: process.cwd() + '/../TileServer/data/datasetStore/',
    env: 'DATASET_BLOB_FOLDER',
  },
  tileServerDataFolder: {
    type: String,
    doc: 'The location of data for the tile server',
    default: process.cwd() + '/../TileServer/data/',
    env: 'TILESERVER_DATA_FOLDER',
  },
  blobStorageConnectionString: {
    type: String,
    doc: 'The connection string for the blob storage container',
    default: '',
    env: 'AZURE_STORAGE_CONNECTION_STRING',
  },
  blobContainer: {
    type: String,
    doc: 'The name of the blob container',
    default: 'vectoratlas-container',
  },
  dataTemplatesFolder: {
    type: String,
    doc: 'Path to folder storing the data templates',
    default: process.cwd() + '/templates',
    env: 'DATA_TEMPLATES_FOLDER',
  },
  fullOccurrenceDataFolder: {
    type: String,
    doc: 'Path to folder storing the full occurrence data files',
    default: process.cwd() + '/../OccurrenceGeoJob/.tmp',
    env: 'FULL_OCCURRENCE_DATA_FOLDER',
  },
});

export default config;
