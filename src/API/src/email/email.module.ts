import { Logger, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailController } from './email.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationLog } from '../db/communication-log/entities/communication-log.entity';
import { CommunicationLogModule } from '../db/communication-log/communication-log.module';
import { CommunicationLogService } from '../db/communication-log/communication-log.service';
import { HttpModule } from '@nestjs/axios';
import { EmailProcessor } from './email.processor';

@Module({
  controllers: [EmailController],
  providers: [EmailService, CommunicationLogService, Logger, EmailProcessor],
  imports: [
    BullModule.registerQueue({
      name: 'email-sending',
    }),
    HttpModule,
    CommunicationLogModule,
    TypeOrmModule.forFeature([CommunicationLog]),
  ],
  exports: [EmailService],
})
export class EmailModule {}
