import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { lastIngestWatch } from './export/lastInjestWatch';

async function bootstrap() {
  lastIngestWatch();
  setInterval(lastIngestWatch, 10000);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
