// import fs from 'fs';

const fs = require('fs')

// let lastIngestTime = lastIngest.ingestion.ingestTime;
const lastIngestTime = JSON.parse(
  fs.readFileSync(__dirname + '/../../../../../lastIngest.json', {
    encoding: 'utf8',
    flag: 'r',
  }),
);

export function lastIngestWatch() {
  const currentIngestTime = JSON.parse(
    fs.readFileSync(__dirname + '/../../../../../lastIngest.json', {
      encoding: 'utf8',
      flag: 'r',
    }),
  );
  if (
    lastIngestTime !== null &&
    currentIngestTime.ingestion.ingestTime ===
      lastIngestTime.ingestion.ingestTime
  ) {
    console.log('no new ingest');
    return;
  } else {
    console.log('new ingest - run csv - update lastIngestTime');
    // new ingest
    // create .lock and make sure it is watched
    // create new csv
    // update last inges time
    console.log('Last injest: ', lastIngestTime);
    console.log('Current ingest time: ', currentIngestTime);
  }
}
