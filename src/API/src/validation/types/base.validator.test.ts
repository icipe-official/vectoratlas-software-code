import { Validator } from './base.validator';

const occurrenceMock = {
  num_id: '1',
  ENL_ID: '405',
  Author: 'Afari',
  Year: '1995',
  'Report Type': 'report',
  Published: 'no',
  'V Data': 'yes',
  SITE_ID: '28912',
  Country: 'Ghana',
  'Full Name': 'Kasim el Girba',
  'Admin 2 Id': '22855',
  Latitude: '5.883',
  Longitude: '-0.118',
  SITE_NOTES: 'Is listed',
  'Area type': 'point',
  'Rural/Urban': 'rural',
  'Month Start': '11',
  'Month End': '11',
  'Year Start': '1992',
  'Year End': '1992',
  'Species 1': 'gambiae',
  's.s./s.l.': 's.l.',
  ASSI: 'no',
  SPECIES2: 'arabiensis',
  'Mossamp Tech 1': 'MBI',
  'Mossamp Tech 2': 'MBO',
  'Mossamp Tech 3': 'L',
  n3: '0',
  'Mossamp Tech 4': 'HRI',
  ALLNCHECK: '0',
  'MOS Id1': '?',
  'MOS Id2': 'PCR',
  'MOS Id3': 'CBS',
  Control: 'yes',
  'Control Type': 'irs',
  'DEC Id': 'RMO',
  'DEC Check': 'RAH',
  'Map Check': 'RH',
  'Vector Notes':
    'Results are not presented in very clear way. Might be worth following\
     up with author (WHO) to get site details etc, and \
    results of subsequent trials (refered to in text)',
};

const bionomicsMock = {
  num_id: '1',
  ID: '4',
  enlid: '355',
  citation:
    'Malaria infection, morbidity and transmission in two ecological zones Southern Ghana',
  author: 'Afari',
  'Article title':
    'Malaria infection, morbidity and transmission in two ecological zones Southern Ghana',
  'Journal title': 'Afr J Health Sci',
  Year: '1995',
  'Adult data': 'TRUE',
  'Larval site data': 'FALSE',
  Country: 'Ghana',
  Site: 'Dodowa',
  'MAP site id': '28912',
  Latitude: '5.883',
  Longitude: '-0.118',
  'insecticide control': 'FALSE',
  Month_st: '11',
  Month_end: '11',
  Year_st: '1992',
  Year_end: '1992',
  'Season (calc)': 'rainy',
  Species_1: 'gambiae',
  species: 'gambiae',
  'HBR sampling (combined)_1': 'MBI',
  'HBR sampling (combined)_2': 'MBO',
  'combined HBR': '3.13',
  'HBR (unit)': 'HBR (night)',
};

describe('Validator class', () => {
  describe('Occurrence validation', () => {
    it('returns no errors on clean data', () => {
      const data = occurrenceMock;
      const occurrenceValidator = new Validator('occurrence', data, 1);
      occurrenceValidator.isValid();
      expect(occurrenceValidator.errors).toEqual([]);
    });
    it('returns appropriate error for incorrect data', () => {
      const data = occurrenceMock;
      const incorrectData = { ...data, Year: 'incorrect' };
      const occurrenceValidator = new Validator('occurrence', incorrectData, 1);
      occurrenceValidator.isValid();
      expect(occurrenceValidator.errors).toEqual([
        'Ingest Type Error - Column: Year, Row: 2 - A data type of number was expected, but string was received',
      ]);
    });
    it('returns appropriate error for incomplete data', () => {
      const data = occurrenceMock;
      const incompleteData = { ...data, Country: undefined };
      const occurrenceValidator = new Validator(
        'occurrence',
        incompleteData,
        1,
      );
      occurrenceValidator.isValid();
      expect(occurrenceValidator.errors).toEqual([
        'Required Field - Column: Country, Row: 2 - Expected Type: string',
      ]);
    });
    it('returns appropriate errors for incomplete data and incorrect data', () => {
      const data = occurrenceMock;
      const incompleteIncorrectData = {
        ...data,
        Country: undefined,
        Year: 'incorrect',
      };
      const occurrenceValidator = new Validator(
        'occurrence',
        incompleteIncorrectData,
        1,
      );
      occurrenceValidator.isValid();
      expect(occurrenceValidator.errors).toEqual([
        'Ingest Type Error - Column: Year, Row: 2 - A data type of number was expected, but string was received',
        'Required Field - Column: Country, Row: 2 - Expected Type: string',
      ]);
    });
  });
  describe('Bionomics validation', () => {
    it('returns no errors on clean data', () => {
      const data = bionomicsMock;
      const bionomicsValidator = new Validator('bionomics', data, 1);
      bionomicsValidator.isValid();
      expect(bionomicsValidator.errors).toEqual([]);
    });
    it('returns appropriate error for incorrect data', () => {
      const data = bionomicsMock;
      const incorrectData = { ...data, Year: 'incorrect' };
      const bionomicsValidator = new Validator('bionomics', incorrectData, 1);
      bionomicsValidator.isValid();
      expect(bionomicsValidator.errors).toEqual([
        'Ingest Type Error - Column: Year, Row: 2 - A data type of number was expected, but string was received',
      ]);
    });
    it('returns appropriate error for incomplete data', () => {
      const data = bionomicsMock;
      const incompleteData = { ...data, Country: undefined };
      const bionomicsValidator = new Validator('bionomics', incompleteData, 1);
      bionomicsValidator.isValid();
      expect(bionomicsValidator.errors).toEqual([
        'Required Field - Column: Country, Row: 2 - Expected Type: string',
      ]);
    });
    it('returns appropriate errors for incomplete data and incorrect data', () => {
      const data = bionomicsMock;
      const incompleteIncorrectData = {
        ...data,
        Country: undefined,
        Year: 'incorrect',
      };
      const bionomicsValidator = new Validator(
        'bionomics',
        incompleteIncorrectData,
        1,
      );
      bionomicsValidator.isValid();
      expect(bionomicsValidator.errors).toEqual([
        'Ingest Type Error - Column: Year, Row: 2 - A data type of number was expected, but string was received',
        'Required Field - Column: Country, Row: 2 - Expected Type: string',
      ]);
    });
  });
});
