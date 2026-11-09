import type { Geometry } from 'geojson';

export interface OccurrenceData {
  id: string;
  species: string | undefined;
  species_display_name: string | undefined;
  species_category: string | undefined;
  species_color: string | undefined;
  binary_presence: string | undefined;
  location: Geometry;
  country: string;
  country_iso2: string | undefined;
  country_iso3: string | undefined;
  year_start: number | undefined;
  season_val: string | undefined;
  insecticide: string | undefined;
  abundance_data: string | undefined;
  bio_data: string | undefined;
  // Boolean evaluations of string fields
  is_presence: boolean | undefined;
  has_abundance: boolean | undefined;
  has_bionomics: boolean | undefined;
  has_adult: boolean | undefined;
  has_larval: boolean | undefined;
  // Epoch timestamp for time filtering, defaults to 0
  year_start_epoch: number;
}
