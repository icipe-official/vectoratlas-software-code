import { Validator } from './base.validator';

const occurrenceMock = {
  num_id: '1',
  ENL_ID: '405',
  author: 'Afari',
  'publication year': '1995',
  'Report Type': 'report',
  published: 'no',
  'adult data': 'yes',
  SITE_ID: '28912',
  country: 'Ghana',
  site: 'Kasim el Girba',
  'admin level_1': '22855',
  latitude_1: '5.883',
  longitude_1: '-0.118',
  'site notes': 'Is listed',
  'area type': 'point',
  'Rural/Urban': 'rural',
  month_st: '11',
  month_end: '11',
  year_st: '1992',
  year_end: '1992',
  SPECIES1: 'gambiae',
  's.s./s.l.': 's.l.',
  ASSI: 'no',
  SPECIES2: 'arabiensis',
  'sampling method_1': 'MBI',
  'sampling method_2': 'MBO',
  'sampling method_3': 'L',
  n_3: '0',
  'sampling method_4': 'HRI',
  ALLNCHECK: '0',
  id_1: '?',
  id_2: 'PCR',
  'insecticide control': 'yes',
  'control Type': 'irs',
  'data abstracted by': 'RMO',
  'data checked by': 'RAH',
  'final check': 'RH',
  MAP_NOTES:
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
  'publication year': '1995',
  'adult data': 'TRUE',
  'larval site data': 'FALSE',
  country: 'Ghana',
  site: 'Dodowa',
  'MAP site id': '28912',
  latitude_1: '5.883',
  longitude_1: '-0.118',
  'insecticide control': 'FALSE',
  month_st: '11',
  month_end: '11',
  year_st: '1992',
  year_end: '1992',
  'season (calc)': 'rainy',
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
      const incorrectData = { ...data, 'publication year': 'incorrect' };
      const occurrenceValidator = new Validator('occurrence', incorrectData, 1);
      occurrenceValidator.isValid();
      expect(occurrenceValidator.errors).toEqual([
        {
          errorType: 'Incorrect data type',
          expectedType: 'number',
          key: 'publication year',
          receivedType: 'string',
          row: 1,
        },
      ]);
    });
    it('returns appropriate error for incomplete data', () => {
      const data = occurrenceMock;
      const incompleteData = { ...data, country: undefined };
      const occurrenceValidator = new Validator(
        'occurrence',
        incompleteData,
        1,
      );
      occurrenceValidator.isValid();
      expect(occurrenceValidator.errors).toEqual([
        {
          errorType: 'Required data',
          expectedType: 'string',
          key: 'country',
          row: 1,
        },
      ]);
    });
    it('returns appropriate errors for incomplete data and incorrect data', () => {
      const data = occurrenceMock;
      const incompleteIncorrectData = {
        ...data,
        country: undefined,
        'publication year': 'incorrect',
      };
      const occurrenceValidator = new Validator(
        'occurrence',
        incompleteIncorrectData,
        1,
      );
      occurrenceValidator.isValid();
      expect(occurrenceValidator.errors).toEqual([
        {
          errorType: 'Incorrect data type',
          expectedType: 'number',
          key: 'publication year',
          receivedType: 'string',
          row: 1,
        },
        {
          errorType: 'Required data',
          expectedType: 'string',
          key: 'country',
          row: 1,
        },
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
      const incorrectData = { ...data, 'publication year': 'incorrect' };
      const bionomicsValidator = new Validator('bionomics', incorrectData, 1);
      bionomicsValidator.isValid();
      expect(bionomicsValidator.errors).toEqual([
        {
          errorType: 'Incorrect data type',
          expectedType: 'number',
          key: 'publication year',
          receivedType: 'string',
          row: 1,
        },
      ]);
    });
    it('returns appropriate error for incomplete data', () => {
      const data = bionomicsMock;
      const incompleteData = { ...data, country: undefined };
      const bionomicsValidator = new Validator('bionomics', incompleteData, 1);
      bionomicsValidator.isValid();
      expect(bionomicsValidator.errors).toEqual([
        {
          errorType: 'Required data',
          expectedType: 'string',
          key: 'country',
          row: 1,
        },
      ]);
    });
    it('returns appropriate errors for incomplete data and incorrect data', () => {
      const data = bionomicsMock;
      const incompleteIncorrectData = {
        ...data,
        country: undefined,
        'publication year': 'incorrect',
      };
      const bionomicsValidator = new Validator(
        'bionomics',
        incompleteIncorrectData,
        1,
      );
      bionomicsValidator.isValid();
      expect(bionomicsValidator.errors).toEqual([
        {
          errorType: 'Incorrect data type',
          expectedType: 'number',
          key: 'publication year',
          receivedType: 'string',
          row: 1,
        },
        {
          errorType: 'Required data',
          expectedType: 'string',
          key: 'country',
          row: 1,
        },
      ]);
    });
  });
});
