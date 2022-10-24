import { createHue } from './speciesColorMapper';
import { speciesColorMapRGB } from './speciesColorMapper';
import { hslToRgb } from './speciesColorMapper';

const testArraySpeciesObject = [{ species: 'brumpti' }, { species: 'daudi' }];

describe(createHue.name, () => {
  it('given a color number and the total number of colours, returns the assosciated hue', () => {
    const testHue = createHue(1, 10);
    expect(testHue).toEqual(0.1);
  });
});
describe(speciesColorMapRGB.name, () => {
  it('appends rgb color to species data object before returning the specified species', () => {
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
describe(hslToRgb.name, () => {
  it('given a value in hsl, an rgb equivalent is returned', () => {
    const testHslToRegb = hslToRgb(0.5, 1.0, 0.5);
    expect(testHslToRegb).toEqual([0, 255, 255, 0.5]);
  });
});
