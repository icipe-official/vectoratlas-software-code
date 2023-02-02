import { Module, Logger } from '@nestjs/common';
import { IngestService } from 'src/ingest/ingest.service';
import { ValidationController } from './validation.controller';
import { ValidationService } from './validation.service';

@Module({
  controllers: [ValidationController],
  providers: [ValidationService, Logger],
  imports: [],
  exports: [ValidationService],
})
export class ValidationModule {}
