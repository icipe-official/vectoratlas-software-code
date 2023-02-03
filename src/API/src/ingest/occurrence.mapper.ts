import { v4 as uuidv4 } from 'uuid';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';
import { Sample } from 'src/db/occurrence/entities/sample.entity';
import { Reference } from 'src/db/shared/entities/reference.entity';
import { Site } from 'src/db/shared/entities/site.entity';
import { RecordedSpecies } from 'src/db/shared/entities/recorded_species.entity';
import { makeDate } from 'src/utils';

export const mapOccurrence = (occurrence): Partial<Occurrence> => {
  return {
    id: uuidv4(),
    month_start: occurrence.month_st,
    year_start: occurrence.year_st,
    month_end: occurrence.month_end,
    year_end: occurrence.year_end,
    dec_id: occurrence['data abstracted by'],
    dec_check: occurrence['data checked by'],
    map_check: occurrence['final check'],
    vector_notes: occurrence['MAP_NOTES'],
    timestamp_start: makeDate(
      occurrence.year_st,
      occurrence.month_st,
    ),
    timestamp_end: makeDate(occurrence.year_end, occurrence.month_end),
  };
};

export const mapOccurrenceReference = (occurrence): Partial<Reference> => {
  return {
    id: uuidv4(),
    author: occurrence.author,
    year: occurrence['publication year'],
    report_type: occurrence['Report Type'],
    published: occurrence.Published,
    v_data: occurrence['adult data'],
    citation: createOccurrenceCitation(occurrence),
  };
};

export const createOccurrenceCitation = (occurrence) =>
  'Author: ' + occurrence.author + ', Year: ' + occurrence['publication year'];

export const mapOccurrenceSite = (occurrence): Partial<Site> => {
  return {
    id: uuidv4(),
    country: occurrence.country,
    name: occurrence.site,
    admin_1: occurrence['admin level_1'],
    admin_2: occurrence['admin level_2'],
    latitude: occurrence.latitude_1,
    longitude: occurrence.longitude_1,
    location: {
      type: 'Point',
      coordinates: [Number(occurrence.longitude_1), Number(occurrence.latitude_1)],
    },
    latitude_2: occurrence.latitude_2,
    longitude_2: occurrence.longitude_2,
    location_2: {
      type: 'Point',
      coordinates: [
        Number(occurrence.longitude_2),
        Number(occurrence.latitude_2),
      ],
    },
    latlong_source: occurrence['georef source'],
    good_guess: occurrence['GOOD_GUESS'],
    bad_guess: occurrence['BAD_GUESS'],
    rural_urban: occurrence['Rural/Urban'],
    is_forest: occurrence.Forest,
    is_rice: occurrence.Rice,
    area_type: occurrence['area type'],
    site_notes: occurrence['site notes']
  };
};

export const mapOccurrenceRecordedSpecies = (
  occurrence,
): Partial<RecordedSpecies> => {
  return {
    id: uuidv4(),
    ss_sl: occurrence['s.s./s.l.'],
    assi: occurrence['ASSI'],
    assi_notes: occurrence['species notes'],
    id_method_1: occurrence['id_1'],
    id_method_2: occurrence['id_2'],
    species: occurrence['SPECIES2'] ?? occurrence['SPECIES1'],
  };
};

export const mapOccurrenceSample = (occurrence): Partial<Sample> => {
  return {
    id: uuidv4(),
    mossamp_tech_1: occurrence['sampling method_1'],
    n_1: occurrence['n_1'],
    mossamp_tech_2: occurrence['sampling method_2'],
    n_2: occurrence['n_2'],
    mossamp_tech_3: occurrence['sampling method_3'],
    n_3: occurrence['n_3'],
    mossamp_tech_4: occurrence['sampling method_4'],
    n_4: occurrence['n_4'],
    n_all: occurrence['n_tot'],
    control: occurrence['insecticide control'],
    control_type: occurrence['control type'],
  };
};
