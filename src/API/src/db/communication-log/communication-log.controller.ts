import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommunicationLogService } from './communication-log.service';
import { CommunicationLog } from './entities/communication-log.entity';

@Controller('communication-log')
export class CommunicationLogController {
  constructor(
    private readonly communicationLogService: CommunicationLogService,
  ) {}

  @Post()
  create(@Body() communicationLog: CommunicationLog) {
    return this.communicationLogService.upsert(communicationLog);
  }

  @Get()
  findAll() {
    return this.communicationLogService.getCommunications();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.communicationLogService.getCommunication(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() communicationLog: CommunicationLog) {
    return this.communicationLogService.update(id, communicationLog);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.communicationLogService.remove(id);
  }
}
