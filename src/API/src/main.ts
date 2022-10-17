import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExportModule } from './export/export.module';
import { AllDataFileBuilder } from './export/utils/allDataFileBuilder.service';

async function bootstrap() {
  const exportModule = await NestFactory.create(ExportModule);
  const allDataFileBuilder = exportModule.get(AllDataFileBuilder);
  allDataFileBuilder.lastIngestWatch();
  setInterval(() => allDataFileBuilder.lastIngestWatch(), 1000);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
