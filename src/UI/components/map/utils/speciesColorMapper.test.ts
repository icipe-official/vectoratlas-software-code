import {
  speciesColorMapRGB,
  stringToColour,
  hexToRgb,
} from './speciesColorMapper';

const testArraySpeciesObject = [{ species: 'brumpti' }, { species: 'daudi' }];

describe(stringToColour.name, () => {
  it('given a string, returns a colour in hex format', () => {
    const testString = stringToColour('testing');
    expect(testString).toEqual('#103237');
  });
});
describe(speciesColorMapRGB.name, () => {
  it('appends rgb color to species data object before returning the specified species', () => {
    const testSpeciesColorMap = speciesColorMapRGB(
      testArraySpeciesObject,
      'brumpti'
    );
    expect(testSpeciesColorMap).toEqual({
      color: [253, 34, 79, 0.5],
      species: 'brumpti',
    });
  });
});
describe(hexToRgb.name, () => {
  it('given a value in hsl, an rgb equivalent is returned with a fixed opacity', () => {
    const testHslToRgb = hexToRgb('#993d2d');
    expect(testHslToRgb).toEqual([153, 61, 45, 0.5]);
  });
});
