import { Logger, Module } from '@nestjs/common';
import { CommunicationLogService } from './communication-log.service';
import { CommunicationLogController } from './communication-log.controller';
import { HttpModule } from '@nestjs/axios';
import { CommunicationLog } from './entities/communication-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationLogResolver } from './communication-log.resolver';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([CommunicationLog])],
  controllers: [CommunicationLogController],
  providers: [CommunicationLogService, Logger, CommunicationLogResolver],
  exports: [CommunicationLogService],
})
export class CommunicationLogModule {}
