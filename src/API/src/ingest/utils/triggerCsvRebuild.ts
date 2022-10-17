// All dates UTC
const fs = require('fs');
import * as lastIngest from '../../../../../lastIngest.json';

function generateContent() {
  const lastIngest = {
    ingestion: {
      ingestTime: new Date(),
      isLocked: true,
    },
  };
  return JSON.stringify(lastIngest);
}

export function triggerAllDataCreationHandler() {
  fs.writeFileSync(`${process.cwd()}/../../lastIngest.json`, generateContent());
}

export function handleLastIngestLock(lockStatus) {
  const lastIngestObject = lastIngest;
  lastIngestObject.ingestion.isLocked = lockStatus;
  console.log(typeof lastIngest, lastIngest);
  const lastIngestJSON = JSON.stringify(lastIngest);
  // fs.writeFileSync(`${process.cwd()}/../../lastIngest.json`, lastIngestJSON);
}
