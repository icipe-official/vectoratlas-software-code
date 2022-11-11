export type TimeRange = {
  start: number | null
  end: number | null
}
export type MapFilter<T> = {
  value: T
}
export type VectorAtlasFilters = {
  country: MapFilter<string[] | string>;
  species: MapFilter<string[] | string>;
  isLarval: MapFilter<boolean[]>;
  isAdult: MapFilter<boolean[]>;
  control: MapFilter<boolean[]>;
  season: MapFilter<string[]>;
  timeRange: MapFilter<TimeRange>;

  [index:string]: MapFilter<string[] | string> | MapFilter<boolean[]> | MapFilter<string[]> | MapFilter<TimeRange>
}