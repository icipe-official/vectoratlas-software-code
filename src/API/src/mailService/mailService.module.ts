import { Module } from '@nestjs/common';
import { MailServiceController } from './mailService.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mailService.service';
import { HttpModule } from '@nestjs/axios';
import { CommunicationLogModule } from 'src/db/communication-log/communication-log.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationLog } from 'src/db/communication-log/entities/communication-log.entity';
import { CommunicationLogService } from 'src/db/communication-log/communication-log.service';

@Module({
  controllers: [MailServiceController],
  providers: [MailService, CommunicationLogService],
  imports: [
    HttpModule,
    CommunicationLogModule,
    TypeOrmModule.forFeature([
      CommunicationLog,
    ]),
  ],
  exports: [MailService],
})
export class MailServiceModule {}
