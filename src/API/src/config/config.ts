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
});

export default config;
