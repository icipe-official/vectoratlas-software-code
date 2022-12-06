export function speciesDict(species: any) {
  const speciesDict = species.map((object: any) => ({
    ...object,
    fullDetailsLoaded: false,
  }));
  return speciesDict;
}
