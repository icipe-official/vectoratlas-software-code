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
import { EmailSendResponse, sendEmail } from './mailer';

@Injectable()
export class CommunicationLogService {
  constructor(
    private readonly httpService: HttpService,
    private readonly mailService: MailerService,
    @InjectRepository(CommunicationLog)
    private communicationLogRepository: Repository<CommunicationLog>,
  ) {}

  async create(communicationLog: CommunicationLog) {
    const res = await this.communicationLogRepository.save(communicationLog);
    return res;
  }

  async send(communicationLog: CommunicationLog) {
    if (!communicationLog.id) {
      await this.create(communicationLog);
    }
    switch (communicationLog.channel_type) {
      case CommunicationChannelType.EMAIL:
        const res: EmailSendResponse = await sendEmail(
          communicationLog.recipients,
          communicationLog.message_type,
          communicationLog.message,
        );

        if (res.success && res.info.messageId) {
          communicationLog.sent_date = new Date();
          communicationLog.sent_status = CommunicationSentStatus.SENT;
          communicationLog.sent_response = res.info.response;
          communicationLog.updater = getCurrentUser();
          await this.create(communicationLog);
        } else {
          communicationLog.sent_date = new Date();
          communicationLog.sent_status = CommunicationSentStatus.FAILED;
          communicationLog.sent_response = res.error;
          communicationLog.error_description = res.error;
          communicationLog.updater = getCurrentUser();
          await this.create(communicationLog);
        }
        break;
      default:
        break;
    }
    return false;
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
