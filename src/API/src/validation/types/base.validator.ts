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
import {
  errorMessageType,
  errorMessageNullable,
} from '../utils/validationError';
import { isBool, isNumber } from '../utils/typeValidation';

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
    const validationObject =
      this.flag === 'occurrence'
        ? {
            ...occurrenceValidatorCheck,
            ...sampleValidatorCheck,
            ...referenceCitationOccurrenceValidatorCheck,
            ...siteOccurrenceValidatorCheck,
            ...recordedSpeciesOccurrenceValidatorCheck,
          }
        : {
            ...bionomicsValidatorCheck,
            ...referenceBionomicsCitationValidatorCheck,
            ...recordedSpeciesBionomicsValidatorCheck,
            ...siteBionomicsValidatorCheck,
            ...biologyValidatorCheck,
            ...infectionValidatorCheck,
            ...bitingRateValidatorCheck,
            ...anthropoZoophagicValidatorCheck,
            ...endoExophagicValidatorCheck,
            ...bitingActivityValidatorCheck,
            ...endoExophilyValidatorCheck,
            ...environmentValidatorCheck,
          };
    this.isCorrectType(validationObject);
  }

  isCorrectType(keysAndTypes) {
    Object.keys(keysAndTypes).forEach((key) => {
      // eslint-disable-next-line max-len
      const field = this.data[key];
      if (field === undefined && keysAndTypes[key].nullable === false) {
        this.errors.push(
          errorMessageNullable(key, keysAndTypes[key].fieldType, this.row),
        );
      }
      if (keysAndTypes[key].fieldType === 'number' && field !== undefined) {
        const numberCheck = isNumber(field);
        if (numberCheck === false) {
          this.errors.push(
            errorMessageType(
              key,
              typeof this.data[key],
              keysAndTypes[key].fieldType,
              this.row,
            ),
          );
        }
      }
      if (keysAndTypes[key].fieldType === 'boolean' && field !== undefined) {
        const boolCheck = isBool(field);
        if (boolCheck === false) {
          this.errors.push(
            errorMessageType(
              key,
              typeof this.data[key],
              keysAndTypes[key].fieldType,
              this.row,
            ),
          );
        }
      }
    });
  }
  // isLinked();
  // isCharacterLimited();
}

const referenceCitationOccurrenceValidatorCheck = {
  Author: { fieldType: 'string', nullable: true },
  Year: { fieldType: 'number', nullable: true },
  Published: { fieldType: 'boolean', nullable: true },
  'Report Type': { fieldType: 'string', nullable: true },
  'V Data': { fieldType: 'boolean', nullable: true },
};

const siteOccurrenceValidatorCheck = {
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

const recordedSpeciesOccurrenceValidatorCheck = {
  's.s./s.l.': { fieldType: 'string', nullable: true },
  ASSI: { fieldType: 'boolean', nullable: true },
  'Notes ASSI': { fieldType: 'string', nullable: true },
  'MOS Id1': { fieldType: 'string', nullable: true },
  'MOS Id2': { fieldType: 'string', nullable: true },
  'MOS Id3': { fieldType: 'string', nullable: true },
  'Species 1': { fieldType: 'string', nullable: false },
  'Species 2': { fieldType: 'string', nullable: false },
};
