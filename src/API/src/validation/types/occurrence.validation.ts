export const referenceCitationOccurrenceValidatorCheck = {
  author: { fieldType: 'string', nullable: true },
  'publication year': { fieldType: 'number', nullable: true },
  published: { fieldType: 'boolean', nullable: true },
  'Report Type': { fieldType: 'string', nullable: true },
  'adult data': { fieldType: 'boolean', nullable: true },
};

export const siteOccurrenceValidatorCheck = {
  country: { fieldType: 'string', nullable: false },
  site: { fieldType: 'string', nullable: false },
  latitude_1: { fieldType: 'string', nullable: false },
  longitude_1: { fieldType: 'string', nullable: false },
  'admin level_1': { fieldType: 'string', nullable: true },
  'admin level_2': { fieldType: 'string', nullable: true },
  latitude_2: { fieldType: 'string', nullable: true },
  longitude_2: { fieldType: 'string', nullable: true },
  'georef source': { fieldType: 'string', nullable: true },
  GOOD_GUESS: { fieldType: 'boolean', nullable: true },
  BAD_GUESS: { fieldType: 'boolean', nullable: true },
  'Rural/Urban': { fieldType: 'string', nullable: true },
  Forest: { fieldType: 'boolean', nullable: true },
  Rice: { fieldType: 'boolean', nullable: true },
};

export const recordedSpeciesOccurrenceValidatorCheck = {
  's.s./s.l.': { fieldType: 'string', nullable: true },
  ASSI: { fieldType: 'boolean', nullable: true },
  'species notes': { fieldType: 'string', nullable: true },
  id_1: { fieldType: 'string', nullable: true },
  id_2: { fieldType: 'string', nullable: true },
  SPECIES1: { fieldType: 'string', nullable: false },
  SPECIES2: { fieldType: 'string', nullable: true },
};

export const occurrenceValidatorCheck = {
  month_st: { fieldType: 'number', nullable: false },
  year_st: { fieldType: 'number', nullable: false },
  month_end: { fieldType: 'number', nullable: false },
  year_end: { fieldType: 'number', nullable: false },
  'data abstracted by': { fieldType: 'string', nullable: true },
  'data checked by': { fieldType: 'string', nullable: true },
  'Map Check': { fieldType: 'string', nullable: true },
  'Vector Notes': { fieldType: 'string', nullable: true },
  'ir data': { fieldType: 'string', nullable: true }
};

export const sampleValidatorCheck = {
  'sampling method_1': { fieldType: 'string', nullable: true },
  n_1: { fieldType: 'number', nullable: true },
  'sampling method_2': { fieldType: 'string', nullable: true },
  n_2: { fieldType: 'number', nullable: true },
  'sampling method_3': { fieldType: 'string', nullable: true },
  n_3: { fieldType: 'number', nullable: true },
  'sampling method_4': { fieldType: 'string', nullable: true },
  n_4: { fieldType: 'number', nullable: true },
  n_tot: { fieldType: 'number', nullable: true },
  'insecticide control': { fieldType: 'boolean', nullable: true },
  'control Type': { fieldType: 'string', nullable: true },
};
