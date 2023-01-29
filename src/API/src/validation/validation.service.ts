import { Injectable, Logger } from '@nestjs/common';
import * as csvtojson from 'csvtojson';
import { Validator } from '../validation/types/base.validator';

@Injectable()
export class ValidationService {
  constructor(private logger: Logger) {}

  async validateCsv(csv: string, dataType: string) {
    try {
      const errorLog = [];
      const rawArray = await csvtojson({
        ignoreEmpty: true,
        flatKeys: true,
        checkColumn: true,
      }).fromString(csv);
      for (const [i, row] of rawArray.entries()) {
        const validator = new Validator(dataType, row, i);
        validator.isValid();
        errorLog.push(validator.errors);
      }
      return errorLog;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
