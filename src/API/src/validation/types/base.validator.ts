import {
  occurrenceValidatorCheck,
  recordedSpeciesOccurrenceValidatorCheck,
  referenceCitationOccurrenceValidatorCheck,
  sampleValidatorCheck,
  siteOccurrenceValidatorCheck,
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
  recordedSpeciesBionomicsValidatorCheck,
  referenceCitationBionomicsValidatorCheck,
  siteBionomicsValidatorCheck,
} from './bionomics.validation';
import {
  errorMessageType,
  errorMessageNullable,
  errorMessageCharLimit,
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
            ...referenceCitationBionomicsValidatorCheck,
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

  isCharacterLimited(keysAndTypes) {
    Object.keys(keysAndTypes).forEach((key) => {
      const field = this.data[key];
      const dataLength = field.length;
      if (
        keysAndTypes[key].fieldType === 'string' &&
        keysAndTypes[key].hasOwnProperty('charLimit')
      ) {
        const expectedLength = keysAndTypes.charLimit;
        this.data[key].length <= keysAndTypes[key].charLimit &&
          this.errors.push(
            errorMessageCharLimit(key, expectedLength, dataLength, this.row),
          );
      }
    });
  }
}
