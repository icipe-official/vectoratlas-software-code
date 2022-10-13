import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { lastIngestWatch } from './export/utils/lastIngestWatch';

async function bootstrap() {
  lastIngestWatch();
  setInterval(lastIngestWatch, 100000);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
