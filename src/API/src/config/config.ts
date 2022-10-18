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
});

export default config;
