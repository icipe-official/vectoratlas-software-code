import { Injectable, Logger } from '@nestjs/common';
import * as csvtojson from 'csvtojson';
import { Validator } from '../validation/types/base.validator';

@Injectable()
export class ValidationService {
  constructor(private logger: Logger) {}

  async validateBionomicsCsv(csv: string) {
    const errorLog = [];
    const rawArray = await csvtojson({
      ignoreEmpty: true,
      flatKeys: true,
      checkColumn: true,
    }).fromString(csv);
    try {
      for (const [i, bionomics] of rawArray.entries()) {
        const bionomicsValidator = new Validator('bionomics', bionomics, i);
        bionomicsValidator.isValid();
        errorLog.push(bionomicsValidator.errors);
      }
      return errorLog;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async validateOccurrenceCsv(csv: string) {
    const errorLog = [];
    const rawArray = await csvtojson({
      ignoreEmpty: true,
      flatKeys: true,
      checkColumn: true,
    }).fromString(csv);
    console.log(rawArray);
    try {
      for (const [i, occurrence] of rawArray.entries()) {
        const occurrenceValidator = new Validator('occurrence', occurrence, i);
        occurrenceValidator.isValid();
        errorLog.push(occurrenceValidator.errors);
      }
      return errorLog;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
