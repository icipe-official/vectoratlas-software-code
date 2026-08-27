import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExportModule } from './export/export.module';
import { AllDataFileBuilder } from './builder/allDataFileBuilder.service';
import { triggerAllDataCreationHandler } from './ingest/utils/triggerCsvRebuild';
import { json } from 'express';
import { WinstonModule } from 'nest-winston';
// we need to import it to make transports.DailyRotate is available
import { transports, format } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
// import DailyRotateFile from 'winston-daily-rotate-file';

async function bootstrap() {
  const exportModule = await NestFactory.create(ExportModule);
  triggerAllDataCreationHandler();
  const allDataFileBuilder = exportModule.get(AllDataFileBuilder);
  allDataFileBuilder.initialiseBuilder();
  allDataFileBuilder.lastIngestWatch();
  setInterval(() => allDataFileBuilder.lastIngestWatch(), 1000);
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        // file on daily rotation (error only)
        new DailyRotateFile({
          //%DATE will be replaced by the current date
          filename: 'logs/%DATE%-error.log',
          level: 'error',
          format: format.combine(
            format.timestamp(),
            //format.json(),
            format.printf(({ timestamp, level, message }) => {
              return `[${level.toUpperCase()}]|${timestamp}| ${message}`;
            }),
          ),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m', //rotate file once they are 20mbs
          maxFiles: '30d', // will keep log until they are older than 30 days
        }),
        // Rotate file for all levels
        new DailyRotateFile({
          //%DATE will be replaced by the current date
          filename: 'logs/%DATE%-all.log',
          level: 'log',
          format: format.combine(
            format.timestamp(),
            //format.json(),
            format.printf(({ timestamp, level, message }) => {
              return `[${level.toUpperCase()}]|${timestamp}| ${message}`;
            }),
          ),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m', //rotate file once they are 20mbs
          maxFiles: '7d', // will keep log until they are older than 7 days
        }),
        // we also want to see logs in our console
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp(),
            format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
      ],
    }),
  });
  app.use(json({ limit: '30mb' }));
  app.enableCors();
  await app.listen(3001, '0.0.0.0');
}
bootstrap();
