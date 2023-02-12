export type TimeRange = {
  start: number | null;
  end: number | null;
};

export type MapFilter<T> = {
  value: T;
};

export type VectorAtlasFilters = {
  country: MapFilter<string[] | string>;
  species: MapFilter<string[]>;
  isLarval: MapFilter<boolean[]>;
  isAdult: MapFilter<boolean[]>;
  control: MapFilter<boolean[]>;
  season: MapFilter<string[]>;
  timeRange: MapFilter<TimeRange>;
  areaCoordinates: MapFilter<number[][]>;

  [index: string]:
    | MapFilter<string[] | string>
    | MapFilter<boolean[]>
    | MapFilter<string[]>
    | MapFilter<TimeRange>
    | MapFilter<number[][]>;
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

export type MapStyles = {
  layers: {
    name: string;
    colorChange: 'fill' | 'stroke';
    fillColor: number[];
    strokeColor: number[];
    strokeWidth: number;
    zIndex: number;
  }[];
};

export type MapOverlay = {
  name: string;
  displayName: string;
  sourceLayer: string;
  sourceType: string;
  isVisible: boolean;
  blobLocation?: string;
  url?: string;
  params?: string;
  serverType?: string;
  externalLink?: string;
};

export type UsersWithRoles = {
  email: string;
  auth0_id: string;
  is_uploader: boolean;
  is_reviewer: boolean;
  is_editor: boolean;
  is_admin: boolean;
};
