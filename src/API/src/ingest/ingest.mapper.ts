import { v4 as uuidv4 } from 'uuid';
import { Bionomics } from "src/db/bionomics/entities/bionomics.entity";
import { Reference } from "src/db/shared/entities/reference.entity";
import { Site } from "src/db/shared/entities/site.entity";
import { Species } from "src/db/shared/entities/species.entity";
import { Biology } from 'src/db/bionomics/entities/biology.entity';

export const mapBionomics = (bionomics): Partial<Bionomics> => {
  return {
    id: uuidv4(),
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
    id: uuidv4(),
    author: bionomics.Author,
    article_title: bionomics['Article title'],
    journal_title: bionomics['Journal title'],
    year: bionomics.Year,
  }
}

export const mapBionomicsSpecies = (bionomics): Partial<Species> => {
  return {
    id: uuidv4(),
    species_1: bionomics.Species_1,
    species_2: bionomics.Species_2,
    assi: bionomics.ASSI,
    id_method_1: bionomics.Id_1,
    id_method_2: bionomics.Id_2,
  }
}

export const mapBionomicsSite = (bionomics): Partial<Site> => {
  return {
    id: uuidv4(),
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

export const mapBionomicsBiology = (bionomics): Partial<Biology> => {
  return {
    id: uuidv4(),
    sampling_1: bionomics['Sampling (biology)_1'],
    sampling_2: bionomics['Sampling (biology)_2'],
    sampling_3: bionomics['Sampling (biology)_3'],
    sampling_n: bionomics['Sampling (biology)_n'],
    parity_n: bionomics['Parity (n)'],
    parity_total: bionomics['Parity (total)'],
    parity_perc: bionomics['Parity (%)'],
    daily_survival_rate: bionomics['Daily survival rate (%)'],
    fecundity: bionomics['Fecundity (mean batch size)'],
    gonotrophic_cycle_days: bionomics['Gonotrophic cycle (days)'],
    notes: bionomics['Biology notes'],
  }
}
