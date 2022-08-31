import * as convict from 'convict';

const config = convict({
  publicFolder: {
    type: String,
    doc: 'The location of the public assets',
    default: process.cwd(),
    env: 'PUBLIC_FOLDER',
  },
});

export default config;
