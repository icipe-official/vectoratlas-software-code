import { Controller, Get, HttpException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DatasetService } from './dataset.service';
import {
  arrayOfFlattenedObjects,
  arrayToCSV,
} from 'src/export/utils/allDataCsvCreation';

@Controller('dataset')
export class DatasetController {
  constructor(private datasetService: DatasetService) {}

  @Get('/:datasetid')
  async getDataSetByid(
    @Param('datasetid') datasetid: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const data = await this.datasetService.findOneByIdWithChildren(datasetid);

      res.contentType('text/csv');
      if (data?.occurrence?.length > 0) {
        res
          .status(200)
          .send(arrayToCSV(arrayOfFlattenedObjects(data.occurrence)));
      } else if (data?.bionomics?.length > 0) {
        res
          .status(200)
          .send(arrayToCSV(arrayOfFlattenedObjects(data.bionomics)));
      } else {
        res.contentType('text/plain');
        res.status(404).send('Dataset with specified id does not exist');
      }
    } catch (e: any) {
      console.log(e);
      throw new HttpException(
        'Something went wrong downloading the data.',
        500,
      );
    }
  }
}
