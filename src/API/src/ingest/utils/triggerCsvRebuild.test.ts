import {
  triggerAllDataCreationHandler,
  handleLastIngestLock,
} from './triggerCsvRebuild';
import * as fs from 'fs';

const flattenSpy = jest.spyOn(fs, 'writeFileSync');
jest.mock('fs');
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
      `${process.cwd()}/public/lastIngest.json`,
      '{"ingestion":{"ingestTime":"a time","isLocked":true}}',
    );
  });
});
