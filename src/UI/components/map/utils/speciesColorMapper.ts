export function createHue(numColor: any, totalColors: any) {
  if (totalColors === 0) {
    totalColors = 1;
  }
  return ((numColor * (360 / totalColors)) % 360) / 360;
}

export function speciesColorMapRGB(
  arrayofSpeciesObjects: any,
  speciesName: string
) {
  const numSpecies = arrayofSpeciesObjects.length;
  const speciesColorMapObject = arrayofSpeciesObjects.map(
    (species: any, index: GLfloat) => ({
      ...species,
      color: hslToRgb(createHue(index, numSpecies), 1.0, 0.5),
    })
  );
  return speciesColorMapObject.find((l: any) => l.species === speciesName);
}

export function hslToRgb(h: any, s: any, l: any) {
  var r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p: any, q: any, t: any) {
      if (t < 0.0) t += 1.0;
      if (t > 1.0) t -= 1.0;
      if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t;
      if (t < 1.0 / 2.0) return q;
      if (t < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
      return p;
    };

    var q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
    var p = 2.0 * l - q;
    r = hue2rgb(p, q, h + 1.0 / 3.0);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1.0 / 3.0);
  }

  return [
    Math.round(r * 255.0),
    Math.round(g * 255.0),
    Math.round(b * 255.0),
    0.5,
  ];
}
