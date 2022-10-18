import {
  triggerAllDataCreationHandler,
  handleLastIngestLock,
} from './triggerCsvRebuild';
const fs = require('fs');

const flattenSpy = jest.spyOn(fs, 'writeFileSync');
jest.spyOn(fs, 'readFileSync').mockReturnValue(
  JSON.stringify({
    ingestion: { ingestTime: 'a time', isLocked: false },
  }),
);

describe(triggerAllDataCreationHandler.name, () => {
  it('writes to the lastIngest.json file', () => {
    triggerAllDataCreationHandler();
    expect(flattenSpy).toBeCalled();
  });
});

describe(handleLastIngestLock.name, () => {
  it('toggles the isLocked property given the appropriate argument', () => {
    handleLastIngestLock(true);
    expect(flattenSpy).toBeCalledWith(
      `${process.cwd()}/../../lastIngest.json`,
      '{"ingestion":{"ingestTime":"a time","isLocked":true}}',
    );
  });
});
