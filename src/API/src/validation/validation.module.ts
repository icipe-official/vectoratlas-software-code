import { Module, Logger } from '@nestjs/common';
import { ValidationController } from './validation.controller';
import { ValidationService } from './validation.service';

@Module({
  controllers: [ValidationController],
  providers: [ValidationService, Logger],
  imports: [],
  exports: [ValidationService],
})
export class ValidationModule {}
