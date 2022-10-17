// All dates UTC
const fs = require('fs');

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
  const lastIngestJSON = fs.readFileSync(
    `${process.cwd()}/../../lastIngest.json`,
    'UTF-8',
  );
  const lastIngestObject = JSON.parse(lastIngestJSON);
  lastIngestObject.ingestion.isLocked = lockStatus;
  const updatedLastIngestJSON = JSON.stringify(lastIngestObject);
  fs.writeFileSync(
    `${process.cwd()}/../../lastIngest.json`,
    updatedLastIngestJSON,
  );
}
