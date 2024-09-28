import { Module } from '@nestjs/common';
import { CommunicationLogService } from './communication-log.service';
import { CommunicationLogController } from './communication-log.controller';
import { HttpModule } from '@nestjs/axios';
import { CommunicationLog } from './entities/communication-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([CommunicationLog])],
  controllers: [CommunicationLogController],
  providers: [CommunicationLogService],
  exports: [CommunicationLogService],
})
export class CommunicationLogModule {}
