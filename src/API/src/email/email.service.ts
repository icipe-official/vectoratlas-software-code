import { Injectable, Logger } from '@nestjs/common';
import { CommunicationLogService } from '../db/communication-log/communication-log.service';
import { CommunicationLog } from '../db/communication-log/entities/communication-log.entity';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as nodemailer from 'nodemailer';
import {
  CommunicationChannelType,
  CommunicationSentStatus,
} from '../../src/commonTypes';
import {
  AttachmentLikeObject,
  ISendMailOptions,
} from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';
import { ImapFlow } from 'imapflow';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
// import { Html } from '@react-email/components';
// import Email from 'templates/email';

@Injectable()
export class EmailService {
  constructor(
    // private readonly mailerService: MailerService,
    private readonly communicationLogService: CommunicationLogService,
    private readonly logger: Logger,
  ) {}

  async sendEmail(
    emails: string[],
    copyEmails: string[],
    title: string,
    emailBody: string,
    files?: AttachmentLikeObject[],
    communicationLog?: CommunicationLog,
  ): Promise<boolean> {
    if (typeof emails === 'string') {
      emails = [emails];
    }
    if (typeof copyEmails === 'string') {
      copyEmails = [copyEmails];
    }
    emails = (emails || []).filter((e) => e && e.trim());
    copyEmails = (copyEmails || []).filter((e) => e && e.trim());

    if (emails.length === 0) {
      this.logger.warn('sendEmail called with no valid recipients — skipping');
      return false;
    }

  
    const allRecipients = emails.slice();
    const commLog = await this.saveLog(
      communicationLog,
      allRecipients,
      title,
      emailBody,
    );

    try {
      const transporter = nodemailer.createTransport(
        {
          host: process.env.EMAIL_HOST,
          port: Number(process.env.EMAIL_PORT),
          secure: Boolean(Number(process.env.EMAIL_SECURE)),
          auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASSWORD,
          },
        },
        {
          from: {
            name: process.env.EMAIL_FROM,
            address: process.env.EMAIL_FROM,
          },
        },
      );

      const res = await transporter.sendMail({
        subject: title,
        html: emailBody,
        attachments: files,
        to: emails,
        cc: copyEmails,
      });

      await this.updateSentStatus(commLog, res);
      await this.appendToSent(commLog.subject, allRecipients, emailBody).catch(
        console.error,
      );
      return true;
    } catch (err: any) {
      this.logger.error(err);
      commLog.sent_status = CommunicationSentStatus.FAILED;
      commLog.sent_date = new Date();
      commLog.error_description = err?.message || String(err);
      await this.communicationLogService.upsert(commLog);
      throw err;
    }
  }

  /**
   * Append sent emails to the sender's outbox
   * @param subject
   * @param recipients
   * @param message
   */
  async appendToSent(subject: string, recipients: string[], message: string) {
    return true;
    /*
    const client = new ImapFlow({
      host: process.env.IMAP_SERVER
      port: process.env.IMAP_PORT, // 993,
      secure: true,
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const recps = recipients.join(',');
    const msg = `Subject: ${subject}\r\nFrom: ${process.env.EMAIL_FROM}\r\nTo: ${recps}\r\nContent-Type: text/plain; format=flowed\r\n\r\n${message}`;
    try {
      await client.connect();
      const resss = await client.list();
      console.log('Outlook mail boxes: ');
      resss.forEach((mailbox) => console.log(mailbox.path));
      await client.append(process.env.SENT_EMAIL_FOLDER, msg, [], new Date());
    } catch (error) {
      this.logger.error(error);
      console.log(error);
    } finally {
      await client.logout();
    }*/
  }

  async sendEmailWithRawFiles(
    emails: string[],
    copyEmails: string[],
    title: string,
    emailBody: string,
    communicationLog?: CommunicationLog,
    files?: Express.Multer.File | Express.Multer.File[], // Handles file upload
  ) {
    try {
      const tempDir = join(__dirname, '..', 'temp');
      if (!existsSync(tempDir)) {
        mkdirSync(tempDir, { recursive: true });
      }
      const finalFiles: Express.Multer.File[] = [].concat(files || []);
      const attachedFiles: AttachmentLikeObject[] = finalFiles.map((file) => {
        const tempFilePath = join(tempDir, file.originalname);
        writeFileSync(tempFilePath, new Uint8Array(file.buffer));
        return { path: tempFilePath };
      });

      const result = await this.sendEmail(
        emails,
        copyEmails,
        title,
        emailBody,
        attachedFiles,
        communicationLog,
      );
      return { success: result };
    } catch (error: any) {
      this.logger.error(error);
      return { success: false, message: error?.message || String(error) };
    }
  }

  async saveLog(
    communicationLog: CommunicationLog,
    recipients: Array<string>,
    title: string,
    message: string,
  ): Promise<CommunicationLog> {
    if (communicationLog) {
      return await this.communicationLogService.upsert(communicationLog);
    } else {
      const newLog = new CommunicationLog();
      newLog.channel_type = CommunicationChannelType.EMAIL;
      newLog.recipients = recipients;
      newLog.subject = title || 'General Email';
      newLog.message_type = 'General Email';
      newLog.message = message;
      newLog.sent_status = CommunicationSentStatus.PENDING;
      newLog.sent_date = null;
      newLog.reference_entity_type = null;
      newLog.reference_entity_name = null;
      return await this.communicationLogService.upsert(newLog);
    }
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
    return await this.communicationLogService.upsert(communicationLog);
  }
}
