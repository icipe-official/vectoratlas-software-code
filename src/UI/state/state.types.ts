export type TimeRange = {
  start: number | null;
  end: number | null;
};

export type MapFilter<T> = {
  value: T;
};

export type VectorAtlasFilters = {
  country: MapFilter<string[] | string>;
  species: MapFilter<string[] | string>;
  isLarval: MapFilter<boolean[]>;
  isAdult: MapFilter<boolean[]>;
  control: MapFilter<boolean[]>;
  season: MapFilter<string[]>;
  timeRange: MapFilter<TimeRange>;

  [index: string]:
    | MapFilter<string[] | string>
    | MapFilter<boolean[]>
    | MapFilter<string[]>
    | MapFilter<TimeRange>;
};

export type SpeciesInformation = {
  id: string | undefined;
  name: string;
  shortDescription: string;
  description: string;
  speciesImage: string;
};

export type FilterSort = {
  page: number;
  rowsPerPage: number;
  orderBy: string;
  order: 'asc' | 'desc';
  startId: number | null;
  endId: number | null;
  textFilter: string;
};

export type News = {
  id: string | undefined;
  title: string;
  summary: string;
  article: string;
  image: string;
};
