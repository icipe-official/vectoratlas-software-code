import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EditLogsService } from './editLogs.service';
import { EditLogsController } from './editLogs.controller';
import { EditLog } from './editLog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EditLog])],
  providers: [EditLogsService],
  controllers: [EditLogsController],
  exports: [EditLogsService],
})
export class EditLogsModule {}
