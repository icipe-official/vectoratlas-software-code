import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunicationLog } from './entities/communication-log.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { CommunicationSentStatus } from 'src/commonTypes';

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

  // async send(communicationLog: CommunicationLog) {
  //   if (!communicationLog.id) {
  //     await this.upsert(communicationLog);
  //   }
  //   switch (communicationLog.channel_type) {
  //     case CommunicationChannelType.EMAIL:
  //       try {
  //         const res: EmailSendResponse = await sendEmail(
  //           communicationLog.recipients,
  //           communicationLog.message_type,
  //           communicationLog.message,
  //         );

  //         if (res.success && res.info.messageId) {
  //           communicationLog.sent_date = new Date();
  //           communicationLog.sent_status = CommunicationSentStatus.SENT;
  //           communicationLog.sent_response = res.info.response;
  //           communicationLog.updater = getCurrentUser();
  //           return await this.upsert(communicationLog);
  //         } else {
  //           communicationLog.sent_date = new Date();
  //           communicationLog.sent_status = CommunicationSentStatus.FAILED;
  //           communicationLog.sent_response = res.error;
  //           communicationLog.error_description = res.error;
  //           communicationLog.updater = getCurrentUser();
  //           return await this.upsert(communicationLog);
  //         }
  //       } catch (e) {
  //         communicationLog.sent_date = new Date();
  //         communicationLog.sent_status = CommunicationSentStatus.FAILED;
  //         communicationLog.sent_response = e.toString();
  //         communicationLog.error_description = e.toString();
  //         communicationLog.updater = getCurrentUser();
  //         await this.upsert(communicationLog);
  //         this.logger.error(e);
  //         // throw new HttpException('Error occurred when sending emails', 500);
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  //   return null;
  // }

  async getCommunications() {
    return await this.communicationLogRepository.find();
  }

  async getCommunicationsBySentStatus(sentStatus: CommunicationSentStatus) {
    return await this.communicationLogRepository.find({
      where: { sent_status: sentStatus },
    });
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
