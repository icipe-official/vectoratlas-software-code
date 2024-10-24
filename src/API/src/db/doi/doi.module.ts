import { Module } from '@nestjs/common';
import { DoiService } from './doi.service';
import { DoiController } from './doi.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOI } from './entities/doi.entity';
import { DoiResolver } from './doi.resolver';
import { CommunicationLogService } from '../communication-log/communication-log.service';
import { CommunicationLog } from '../communication-log/entities/communication-log.entity'; 
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    HttpModule,
    EmailModule,
    TypeOrmModule.forFeature([DOI, CommunicationLog]),
  ],
  controllers: [DoiController],
  providers: [DoiResolver, DoiService, CommunicationLogService],
  exports: [DoiService],
})
export class DoiModule {}
