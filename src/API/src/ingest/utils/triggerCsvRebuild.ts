// All dates UTC
import * as fs from 'fs';

function generateContent() {
  const lastIngest = {
    ingestion: {
      ingestTime: new Date(),
      isLocked: true,
    },
  };
  return JSON.stringify(lastIngest);
}

function writeToLastIngest(content: string) {
  fs.writeFileSync(`${process.cwd()}/public/lastIngest.json`, content);
}

export function triggerAllDataCreationHandler() {
  writeToLastIngest(generateContent());
}

export function handleLastIngestLock(lockStatus) {
  const lastIngestJSON = fs.readFileSync(
    `${process.cwd()}/public/lastIngest.json`,
    { encoding: 'utf8', flag: 'r' },
  );
  const lastIngestObject = JSON.parse(lastIngestJSON);
  lastIngestObject.ingestion.isLocked = lockStatus;
  const updatedLastIngestJSON = JSON.stringify(lastIngestObject);
  writeToLastIngest(updatedLastIngestJSON);
}
