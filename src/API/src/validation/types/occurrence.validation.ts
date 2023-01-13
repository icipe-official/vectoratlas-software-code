export const referenceCitationOccurrenceValidatorCheck = {
  Author: { fieldType: 'string', nullable: true },
  Year: { fieldType: 'number', nullable: true },
  Published: { fieldType: 'boolean', nullable: true },
  'Report Type': { fieldType: 'string', nullable: true },
  'V Data': { fieldType: 'boolean', nullable: true },
};

export const siteOccurrenceValidatorCheck = {
  Country: { fieldType: 'string', nullable: false },
  'Full Name': { fieldType: 'string', nullable: false },
  Latitude: { fieldType: 'string', nullable: false },
  Longitude: { fieldType: 'string', nullable: false },
  'Admin 1 Paper': { fieldType: 'string', nullable: true },
  'Admin 2 Paper': { fieldType: 'string', nullable: true },
  'Admin 3 Paper': { fieldType: 'string', nullable: true },
  'Admin 2 Id': { fieldType: 'number', nullable: true },
  'Latitude 2': { fieldType: 'string', nullable: true },
  'Longitude 2': { fieldType: 'string', nullable: true },
  'Lat Long Source': { fieldType: 'string', nullable: true },
  'Good guess': { fieldType: 'boolean', nullable: true },
  'Bad guess': { fieldType: 'boolean', nullable: true },
  'Rural/Urban': { fieldType: 'string', nullable: true },
  Forest: { fieldType: 'boolean', nullable: true },
  Rice: { fieldType: 'boolean', nullable: true },
};

export const recordedSpeciesOccurrenceValidatorCheck = {
  's.s./s.l.': { fieldType: 'string', nullable: true },
  ASSI: { fieldType: 'boolean', nullable: true },
  'Notes ASSI': { fieldType: 'string', nullable: true },
  'MOS Id1': { fieldType: 'string', nullable: true },
  'MOS Id2': { fieldType: 'string', nullable: true },
  'MOS Id3': { fieldType: 'string', nullable: true },
  'Species 1': { fieldType: 'string', nullable: false },
  'SPECIES2': { fieldType: 'string', nullable: false },
};

export const occurrenceValidatorCheck = {
  'Month Start': { fieldType: 'number', nullable: false },
  'Year Start': { fieldType: 'number', nullable: false },
  'Month End': { fieldType: 'number', nullable: false },
  'Year End': { fieldType: 'number', nullable: false },
  'DEC Id': { fieldType: 'string', nullable: false },
  'DEC Check': { fieldType: 'string', nullable: false },
  'Map Check': { fieldType: 'string', nullable: true },
  'Vector Notes': { fieldType: 'string', nullable: true },
};

export const sampleValidatorCheck = {
  'Mossamp Tech 1': { fieldType: 'string', nullable: true },
  n1: { fieldType: 'number', nullable: true },
  'Mossamp Tech 2': { fieldType: 'string', nullable: true },
  n2: { fieldType: 'number', nullable: true },
  'Mossamp Tech 3': { fieldType: 'string', nullable: true },
  n3: { fieldType: 'number', nullable: true },
  'Mossamp Tech 4': { fieldType: 'string', nullable: true },
  n4: { fieldType: 'number', nullable: true },
  'All n': { fieldType: 'number', nullable: true },
  Control: { fieldType: 'boolean', nullable: true },
  'Control Type': { fieldType: 'string', nullable: true },
};
