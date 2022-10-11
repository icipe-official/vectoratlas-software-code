// import fs from 'fs';

// All dates UTC
const fs = require('fs')

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
  console.log('Ingest Complete');
}

// Try catch mindful of quirky errors
