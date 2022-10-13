// All dates UTC
const fs = require('fs');
// import fs from 'fs'; <===== Needs investigating

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
