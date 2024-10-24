import { Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationLog } from '../db/communication-log/entities/communication-log.entity';
import { CommunicationLogService } from '../../src/db/communication-log/communication-log.service';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Module({
  controllers: [EmailController],
  providers: [EmailService, CommunicationLogService, Logger],
  imports: [HttpModule, TypeOrmModule.forFeature([CommunicationLog])],
  exports: [EmailService],
})
export class EmailModule {}
