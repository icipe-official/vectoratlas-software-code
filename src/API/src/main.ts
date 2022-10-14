import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllDataFileBuilder } from './export/utils/lastIngestWatch';
import { ExportService } from './export/export.service';
import exp from 'constants';

async function bootstrap() {
  const AllDataFileBuilderInit = await NestFactory.create(AllDataFileBuilder);
  const fileBuilder = AllDataFileBuilderInit.get(AllDataFileBuilder);
  fileBuilder.lastIngestWatch;
  setInterval(fileBuilder.lastIngestWatch, 100000);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
