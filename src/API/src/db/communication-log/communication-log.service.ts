import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunicationLog } from './entities/communication-log.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import {
  CommunicationChannelType,
  CommunicationSentStatus,
} from 'src/commonTypes';
import { MailerService } from '@nestjs-modules/mailer';
import { getCurrentUser } from '../doi/util';
import { EmailSendResponse/*, sendEmail*/ } from './mailer';
import { MailService } from 'src/mailService/mailService.service';

@Injectable()
export class CommunicationLogService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(CommunicationLog)
    private communicationLogRepository: Repository<CommunicationLog>,
  ) {}

  async create(communicationLog: CommunicationLog) {
    const res = await this.communicationLogRepository.save(communicationLog);
    return res;
  }
  
  async upsert(communicationLog: CommunicationLog) {
    const res = await this.communicationLogRepository.save(communicationLog);
    return res;
  }

  async getCommunications() {
    return await this.communicationLogRepository.find();
  }

  async getCommunication(id: string) {
    return await this.communicationLogRepository.findOne({ where: { id } });
  }

  async update(id: string, communicationLog: CommunicationLog) {
    const exists = await this.getCommunication(id);
    if (exists) {
      return await this.communicationLogRepository.save(communicationLog);
    }
    return null;
  }

  async updateSentStatus(
    id: string,
    sentStatus: CommunicationSentStatus,
    errorDescription: string = null,
  ) {
    const log = await this.getCommunication(id);
    let res = null;
    switch (sentStatus) {
      case CommunicationSentStatus.SENT:
        log.sent_status = CommunicationSentStatus.SENT;
        log.sent_date = new Date();
        res = await this.communicationLogRepository.save(log);
        break;

      case CommunicationSentStatus.FAILED:
        log.sent_status = CommunicationSentStatus.FAILED;
        log.error_description = errorDescription;
        res = await this.communicationLogRepository.save(log);
        break;

      default:
        break;
    }
    return await res;
  }

  async remove(id: string) {
    const log = await this.getCommunication(id);
    if (log) {
      return await this.communicationLogRepository.remove(log);
    }
    return null;
  }
}