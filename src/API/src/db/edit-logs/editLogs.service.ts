import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EditLog } from './editLog.entity';

@Injectable()
export class EditLogsService {
  constructor(
    @InjectRepository(EditLog)
    private readonly editLogRepo: Repository<EditLog>,
  ) {}

  async getAllTheLogs(): Promise<EditLog[]> {
    return this.editLogRepo.find({
      order: { timestamp: 'DESC' },
    });
  }

  // Create a new edit log
  async createLog(
    occurrenceId: string,
    initialData: any,
    modifiedData: any,
    editor: { name?: string; email?: string },
    reasonForEdit?: string,
  ): Promise<EditLog> {
    const newLog = this.editLogRepo.create({
      occurrenceId,
      initialData,
      modifiedData,
      editor,
      reasonForEdit,
    });

    return this.editLogRepo.save(newLog);
  }

  // Fetch all logs
  async getAllLogs(): Promise<EditLog[]> {
    return this.editLogRepo.find({
      order: { timestamp: 'DESC' },
    });
  }

  // Fetch logs by occurrenceId
  async getLogsByOccurrence(occurrenceId: string): Promise<EditLog[]> {
    return this.editLogRepo.find({
      where: { occurrenceId },
      order: { timestamp: 'DESC' },
    });
  }
}
