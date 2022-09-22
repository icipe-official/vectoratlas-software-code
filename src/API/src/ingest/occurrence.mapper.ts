import { v4 as uuidv4 } from 'uuid';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';
import { Sample } from 'src/db/occurrence/entities/sample.entity';
import { Reference } from 'src/db/shared/entities/reference.entity';
import { Site } from 'src/db/shared/entities/site.entity';
import { Species } from 'src/db/shared/entities/species.entity';

export const mapOccurrence = (occurrence): Partial<Occurrence> => {
  return {
    id: uuidv4(),
    month_start: occurrence['Month Start'],
    year_start: occurrence['Year Start'],
    month_end: occurrence['Month End'],
    year_end: occurrence['Year End'],
    dec_id: occurrence['DEC Id'],
    dec_check: occurrence['DEC Check'],
    map_check: occurrence['Map Check'],
    vector_notes: occurrence['Vector Notes'],
  };
};

export const mapOccurrenceReference = (occurrence): Partial<Reference> => {
  return {
    id: uuidv4(),
    author: occurrence.Author,
    year: occurrence.Year,
    report_type: occurrence['Report Type'],
    published: occurrence.Published,
    v_data: occurrence['V Data'],
  };
};

export const mapOccurrenceSite = (occurrence): Partial<Site> => {
  return {
    id: uuidv4(),
    country: occurrence.Country,
    name: occurrence['Full Name'],
    admin_1: occurrence['Admin 1 Paper'],
    admin_2: occurrence['Admin 2 Paper'],
    admin_3: occurrence['Admin 3 Paper'],
    admin_2_id: occurrence['Admin 2 Id'],
    latitude: occurrence.Latitude,
    longitude: occurrence.Longitude,
    location: {
      type: 'Point',
      coordinates: [Number(occurrence.Longitude), Number(occurrence.Latitude)],
    },
    latitude_2: occurrence['Latitude 2'],
    longitude_2: occurrence['Longitude 2'],
    location_2: {
      type: 'Point',
      coordinates: [
        Number(occurrence['Longitude 2']),
        Number(occurrence['Latitude 2']),
      ],
    },
    latlong_source: occurrence['Lat Long Source'],
    good_guess: occurrence['Good guess'],
    bad_guess: occurrence['Bad guess'],
    rural_urban: occurrence['Rural/Urban'],
    is_forest: occurrence.Forest,
    is_rice: occurrence.Rice,
    area_type: occurrence['Area type'],
  };
};

export const mapOccurrenceSpecies = (occurrence): Partial<Species> => {
  return {
    id: uuidv4(),
    species_1: occurrence['Species 1'],
    ss_sl: occurrence['s.s./s.l.'],
    assi: occurrence['ASSI'],
    assi_notes: occurrence['Notes ASSI'],
    species_2: occurrence['Species 2'],
    id_method_1: occurrence['MOS Id1'],
    id_method_2: occurrence['MOS Id2'],
    id_method_3: occurrence['MOS Id3'],
  };
};

export const mapOccurrenceSample = (occurrence): Partial<Sample> => {
  return {
    id: uuidv4(),
    mossamp_tech_1: occurrence['Mossamp Tech 1'],
    n_1: occurrence['n1'],
    mossamp_tech_2: occurrence['Mossamp Tech 2'],
    n_2: occurrence['n2'],
    mossamp_tech_3: occurrence['Mossamp Tech 3'],
    n_3: occurrence['n3'],
    mossamp_tech_4: occurrence['Mossamp Tech 4'],
    n_4: occurrence['n4'],
    n_all: occurrence['All n'],
    control: occurrence['Control'],
    control_type: occurrence['Control Type'],
  };
};
