import { CommunicationLogService } from '../db/communication-log/communication-log.service';
import { Injectable } from '@nestjs/common';
import { AttachmentLikeObject } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';
import { CommunicationLog } from '../db/communication-log/entities/communication-log.entity';
import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';

import {
  CommunicationChannelType,
  CommunicationSentStatus,
} from 'src/commonTypes';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { getCurrentUser } from 'src/db/doi/util';

@Injectable()
export class EmailService {
  constructor(
    private readonly communicationLogService: CommunicationLogService,
    // private readonly mailerService: MailerService,
  ) {}

  async sendEmail(
    emails: string[],
    copyEmails: string[],
    title: string,
    emailBody: string,
    files?: AttachmentLikeObject[],
    communicationLog?: CommunicationLog,
  ): Promise<boolean> {
    const mailOptions: ISendMailOptions = {
      to: emails,
      cc: copyEmails,
      subject: title,
      html: emailBody,
      attachments: files,
    };

    // Log communication before attempting to send
    const allRecipients = emails.slice();
    const commLog = await this.saveLog(
      communicationLog,
      allRecipients,
      emailBody,
    );

    try {
      // //send email
      // const res = await this.mailerService.sendMail(mailOptions);
      // // Update sent status
      // this.updateSentStatus(commLog, res);
      return true;
    } catch (err) {
      throw err;
    }
  }

  async saveLog(
    communicationLog: CommunicationLog,
    recipients: Array<string>,
    message: string,
  ): Promise<CommunicationLog> {
    if (communicationLog) {
      await this.communicationLogService.upsert(communicationLog);
    } else {
      communicationLog = new CommunicationLog();
      communicationLog.channel_type = CommunicationChannelType.EMAIL;
      communicationLog.recipients = recipients;
      communicationLog.message_type = 'General Email';
      communicationLog.message = message;
      communicationLog.sent_status = CommunicationSentStatus.PENDING;
      communicationLog.sent_date = null;
      communicationLog.reference_entity_type = null;
      communicationLog.reference_entity_name = null;
      this.communicationLogService.upsert(communicationLog);
    }
    return communicationLog;
  }

  async updateSentStatus(
    communicationLog: CommunicationLog,
    info: SMTPTransport.SentMessageInfo,
  ) {
    if (info.messageId) {
      communicationLog.sent_status = CommunicationSentStatus.SENT;
      communicationLog.sent_date = new Date();
      communicationLog.sent_response = String(info.response);
    } else {
      communicationLog.sent_status = CommunicationSentStatus.FAILED;
      communicationLog.sent_date = new Date();
      communicationLog.sent_response = String(info.response);
      communicationLog.error_description = String(info.response);
    }
    communicationLog.updater = getCurrentUser();
    this.communicationLogService.upsert(communicationLog);
  }
}