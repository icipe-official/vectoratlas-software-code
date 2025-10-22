import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EditLogsService } from './editLogs.service';
import { EditLog } from './editLog.entity';

@Controller('edit-logs')
export class EditLogsController {
  constructor(private readonly editLogsService: EditLogsService) {}

  // Create a new edit log
  @Post()
  async createLog(@Body() body: any) {
    const { occurrenceId, initialData, modifiedData, editor, reasonForEdit } = body;
    return this.editLogsService.createLog(
      occurrenceId,
      initialData,
      modifiedData,
      editor,
      reasonForEdit,
    );
  }

  @Get('getAllLogs')
  async getAllTheLogs(): Promise<EditLog[]> {
    return this.editLogsService.getAllLogs();
  }

  // Get logs by occurrenceId
  @Get(':occurrenceId')
  async getLogsByOccurrence(@Param('occurrenceId') occurrenceId: string) {
    return this.editLogsService.getLogsByOccurrence(occurrenceId);
  }
}
