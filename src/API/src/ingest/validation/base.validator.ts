import {
  occurrenceValidatorCheck,
  sampleValidatorCheck,
} from './occurrence.validation';
import {
  bionomicsValidatorCheck,
  biologyValidatorCheck,
  infectionValidatorCheck,
  bitingRateValidatorCheck,
  anthropoZoophagicValidatorCheck,
  endoExophagicValidatorCheck,
  bitingActivityValidatorCheck,
  endoExophilyValidatorCheck,
  environmentValidatorCheck,
} from './bionomics.validation';
import { errorMessage } from '../utils/validationError';

export type DictionaryValidationItem = {
  fieldType: string;
  nullable: boolean;
};

export class Validator {
  data: any; // Prior to mapping so will require different type
  flag: string;
  row: number;
  errors: string[];

  constructor(flag, ingestData, row) {
    this.data = ingestData;
    this.flag = flag;
    this.row = row;
    this.errors = [];
  }

  isValid() {
    if (this.flag === 'occurrrence') {
      const occurrenceValidationObject = {
        ...occurrenceValidatorCheck,
        ...sampleValidatorCheck,
        ...referenceCitationValidatorCheck,
        ...siteValidatorCheck,
        ...recordedSpeciesValidatorCheck,
      };
      this.isCorrectType(occurrenceValidationObject);
    }
    if (this.flag === 'bionomics') {
      // missing some shared ones but come back to this
      const bionomicsValidationObject = {
        ...bionomicsValidatorCheck,
        ...biologyValidatorCheck,
        ...infectionValidatorCheck,
        ...bitingRateValidatorCheck,
        ...anthropoZoophagicValidatorCheck,
        ...endoExophagicValidatorCheck,
        ...bitingActivityValidatorCheck,
        ...endoExophilyValidatorCheck,
        ...environmentValidatorCheck,
      };
      this.isCorrectType(bionomicsValidationObject);
    }
  }

  isCorrectType(keysAndTypes) {
    Object.keys(keysAndTypes).forEach((key) => {
      const typeCheck = typeof this.data[key] === keysAndTypes[key].fieldType;
      if (typeCheck === false) {
        this.errors.push(
          errorMessage(
            key,
            typeof this.data[key],
            keysAndTypes[key].fieldType,
            this.row,
          ),
        );
      }
    });
  }
}

const referenceCitationValidatorCheck = {
  Author: { fieldType: 'string', nullable: true },
  'Article Title': { fieldType: 'string', nullable: true },
  'Journal title': { fieldType: 'string', nullable: true },
  Year: { fiedType: 'number', nullable: true },
  Published: { fieldType: 'boolean', nullable: true },
  'Report Type': { fieldType: 'string', nullable: true },
  'V Data': { fieldType: 'boolean', nullable: true },
};

const siteValidatorCheck = {
  Country: { fieldType: 'string', nullable: false },
  'Full Name': { fieldType: 'string', nullable: false },
  Site: { fieldType: 'string', nullable: false },
  'Site notes': { fieldType: 'string', nullable: true },
  'Map site id': { fieldType: 'string', nullable: true },
  'Area type': { fieldType: 'string', nullable: true },
  'Georef source': { fieldType: 'string', nullable: true },
  'GAUL code': { fieldType: 'number', nullable: true },
  'Admin level': { fieldType: 'number', nullable: true },
  'Georef notes': { fieldType: 'string', nullable: true },
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

const recordedSpeciesValidatorCheck = {
  's.s./s.l.': { fieldType: 'string', nullable: true },
  ASSI: { fieldType: 'boolean', nullable: true },
  'Notes ASSI': { fieldType: 'string', nullable: true },
  'MOS Id1': { fieldType: 'string', nullable: true },
  'MOS Id2': { fieldType: 'string', nullable: true },
  'MOS Id3': { fieldType: 'string', nullable: true },
  'Species 1': { fieldType: 'string', nullable: false },
  'Species 2': { fieldType: 'string', nullable: false },
  'Species notes': { fieldType: 'string', nullable: true },
};
