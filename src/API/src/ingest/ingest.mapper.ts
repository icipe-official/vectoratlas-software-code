import { Reference } from "src/db/shared/entities/reference.entity";
import { Site } from "src/db/shared/entities/site.entity";

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
