export function stringToColour(speciesString: string) {
  var hash = 0;
  for (var i = 0; i < speciesString.length; i++) {
    hash = speciesString.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}
export function hexToRgb(hexColourString: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hexColourString
  );
  return result
    ? [
        parseInt(result[1], 16), // r
        parseInt(result[2], 16), // g
        parseInt(result[3], 16), // b
        0.5, // a
      ]
    : null;
}

export function speciesColorMapRGB(
  arrayofSpeciesObjects: any,
  speciesName: string
) {
  const speciesColorMapObject = arrayofSpeciesObjects.map((species: any) => ({
    ...species,
    color: hexToRgb(stringToColour(species.species)),
  }));
  return speciesColorMapObject.find((l: any) => l.species === speciesName);
}
