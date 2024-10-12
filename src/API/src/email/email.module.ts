import { Logger, Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { HttpModule } from '@nestjs/axios';
import { CommunicationLogModule } from 'src/db/communication-log/communication-log.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationLog } from 'src/db/communication-log/entities/communication-log.entity';
import { CommunicationLogService } from 'src/db/communication-log/communication-log.service';
import { EmailService } from './email.service';

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
