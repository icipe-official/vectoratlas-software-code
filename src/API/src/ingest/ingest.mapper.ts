import { Bionomics } from "src/db/bionomics/entities/bionomics.entity";
import { Reference } from "src/db/shared/entities/reference.entity";
import { Site } from "src/db/shared/entities/site.entity";

export const mapBionomics = (bionomics): Partial<Bionomics> => {
  return {
    adult_data: bionomics['Adult data'],
    larval_site_data: bionomics['Larval site data'],
    contact_authors: bionomics['Contact authors'],
    contact_notes: bionomics['Contact notes'],
    secondary_info: bionomics['Secondary or general info'],
    insecticide_control: bionomics['Insecticide control'],
    control: bionomics.Control,
    control_notes: bionomics['Control notes'],
    month_start: bionomics.Month_st,
    month_end: bionomics.Month_end,
    year_start: bionomics.Year_st,
    year_end: bionomics.Year_end,
    season_given: bionomics['Season (given)'],
    season_calc: bionomics['Season (calc)'],
    season_notes: bionomics['Season notes'],
    data_abstracted_by: bionomics['Data abstracted by'],
    data_checked_by: bionomics['Data checked by'],
  };
}

export const mapBionomicsReference = (bionomics): Partial<Reference> => {
  return {
    author: bionomics.Author,
    article_title: bionomics['Article title'],
    journal_title: bionomics['Journal title'],
    year: bionomics.Year,
  }
}

export const mapBionomicsSite = (bionomics): Partial<Site> => {
  return {
    country: bionomics.Country,
    name: bionomics.Site,
    map_site: bionomics['MAP site id'],
    location: {
      type: 'Point',
      coordinates: [Number(bionomics.Longitude), Number(bionomics.Latitude)],
    },
    area_type: bionomics['Area type'],
    georef_source: bionomics['Georef source'],
    gaul_code: bionomics['GAUL code'],
    admin_level: bionomics['Admin level'],
    georef_notes: bionomics['Georef notes'],
    latitude: bionomics.Latitude,
    longitude: bionomics.Longitude,
  }
}
