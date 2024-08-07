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
    ir_data: occurrence['ir data'],
    dec_id: occurrence['data abstracted by'],
    dec_check: occurrence['data checked by'],
    map_check: occurrence['final check'],
    vector_notes: occurrence['MAP_NOTES'],
    timestamp_start: makeDate(occurrence.year_st, occurrence.month_st),
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
    site: occurrence.site,
    admin_level_1: occurrence['admin level_1'],
    admin_level_2: occurrence['admin level_2'],
    latitude: occurrence.latitude_1,
    longitude: occurrence.longitude_1,
    location: {
      type: 'Point',
      coordinates: [
        Number(occurrence.longitude_1),
        Number(occurrence.latitude_1),
      ],
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
    //latlong_source: occurrence['georef source'],
    // good_guess: occurrence['GOOD_GUESS'],
    // bad_guess: occurrence['BAD_GUESS'],
    //rural_urban: occurrence['Rural/Urban'],
    // is_forest: occurrence.Forest,
    // is_rice: occurrence.Rice,
    area_type: occurrence['area type'],
    site_notes: occurrence['site notes'],
  };
};

export const mapOccurrenceRecordedSpecies = (
  occurrence,
): Partial<RecordedSpecies> => {
  return {
    id: uuidv4(),
    species_id_1: occurrence['id_1'],
    species_id_2: occurrence['id_2'],
    species: occurrence['species'] ?? occurrence['SPECIES1'],
  };
};

export const mapOccurrenceSample = (occurrence): Partial<Sample> => {
  return {
    id: uuidv4(),
    sampling_occurrence_1: occurrence['sampling method_1'],
    occurrence_n_1: occurrence['n_1'],
    sampling_occurrence_2: occurrence['sampling method_2'],
    occurrence_n_2: occurrence['n_2'],
    sampling_occurrence_3: occurrence['sampling method_3'],
    occurrence_n_3: occurrence['n_3'],
    sampling_occurrence_4: occurrence['sampling method_4'],
    occurrence_n_4: occurrence['n_4'],
    occurrence_n_tot: occurrence['n_tot'],
    control: occurrence['insecticide control'],
    control_type: occurrence['control type'],
  };
};
