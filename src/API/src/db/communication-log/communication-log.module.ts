import { Logger, Module } from '@nestjs/common';
import { CommunicationLogService } from './communication-log.service';
import { CommunicationLogController } from './communication-log.controller';
import { HttpModule } from '@nestjs/axios';
import { CommunicationLog } from './entities/communication-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailServiceModule } from 'src/mailService/mailService.module';
import { MailService } from 'src/mailService/mailService.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([CommunicationLog])],
  controllers: [CommunicationLogController],
  providers: [CommunicationLogService, Logger],
  exports: [CommunicationLogService],
})
export class CommunicationLogModule {}
