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
  insecticide: MapFilter<string[]>;
  binary_presence: MapFilter<string[]>;
  abundance_data: MapFilter<string[]>;
  bionomics: MapFilter<boolean[]>;
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
  scales: {
    name: string;
    colorMap: number[][];
    unit: string;
    min: number;
    max: number;
  }[];
};

export type MapOverlay = {
  name: string;
  displayName: string;
  sourceLayer: string;
  sourceType: string;
  isVisible: boolean;
  scale?: string;
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
  is_reviewer_manager: boolean;
};

export type UploadedDataset = {
  id: string | undefined;
  title: string;
  description: string;
  last_uploaded_date: Date;
  country: string;
  region: string;
  is_doi_requested: boolean;
};

export interface DOIMetadata {
  filters: object;
  fields: string[];
}

export type DOI = {
  id: string | undefined;
  creation: Date;
  creator_name: string;
  creator_email: string;
  description: string;
  title: string;
  publication_year: number;
  source_type: string;
  meta_data: DOIMetadata;
  resolving_url: string;
  doi_response: string;
  resolver_id: string;
  doi_id: string;
  is_draft: boolean;
  approval_status: string;
  status_updated_on: Date;
  status_updated_by: string;
  dataset: UploadedDataset | undefined;
  comments: string;
};

export enum StatusEnum {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  UNDER_REVIEW = 'Under Review',
  REJECTED = 'Rejected',
  REJECTED_BY_REVIEW_MANAGER = 'Rejected By Reviewer Manager',
}
