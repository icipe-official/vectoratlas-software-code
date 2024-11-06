import { Logger, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationLog } from '../db/communication-log/entities/communication-log.entity';
import { CommunicationLogModule } from '../db/communication-log/communication-log.module';
import { CommunicationLogService } from '../db/communication-log/communication-log.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [EmailController],
  providers: [EmailService, CommunicationLogService, Logger],
  imports: [
    HttpModule,
    CommunicationLogModule,
    TypeOrmModule.forFeature([CommunicationLog]),
  ],
  exports: [EmailService],
})
export class EmailModule {}
