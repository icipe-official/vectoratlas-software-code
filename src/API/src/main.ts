import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExportModule } from './export/export.module';
import { AllDataFileBuilder } from './builder/allDataFileBuilder.service';
import { triggerAllDataCreationHandler } from './ingest/utils/triggerCsvRebuild';
import { json } from 'express';

async function bootstrap() {
  const exportModule = await NestFactory.create(ExportModule);
  triggerAllDataCreationHandler();
  const allDataFileBuilder = exportModule.get(AllDataFileBuilder);
  allDataFileBuilder.initialiseBuilder();
  allDataFileBuilder.lastIngestWatch();
  setInterval(() => allDataFileBuilder.lastIngestWatch(), 1000);
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '2mb' }));
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
