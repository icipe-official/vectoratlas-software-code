import { createHue } from './speciesColorMapper';
import { speciesColorMapRGB } from './speciesColorMapper';

const testArraySpeciesObject = [{ species: 'brumpti' }, { species: 'daudi' }];

describe(createHue.name, () => {
  it('given a color number and the total number of colours, returns the assosciated hue', () => {
    const testHue = createHue(1, 10);
    expect(testHue).toEqual(0.1);
  });
});
describe(speciesColorMapRGB.name, () => {
  it('converts a hcl value to rgb and appends this to species data object before returning the specified species', () => {
    const testSpeciesColorMap = speciesColorMapRGB(
      testArraySpeciesObject,
      'brumpti'
    );
    expect(testSpeciesColorMap).toEqual({
      color: [255, 0, 0, 0.5],
      species: 'brumpti',
    });
  });
});
