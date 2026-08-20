import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CommunicationLogService } from '../db/communication-log/communication-log.service';
import { CommunicationLog } from '../db/communication-log/entities/communication-log.entity';
import { CommunicationChannelType, CommunicationSentStatus } from '../../src/commonTypes';
import { AttachmentLikeObject } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('email-sending') private readonly emailQueue: Queue,
    private readonly communicationLogService: CommunicationLogService,
    private readonly logger: Logger,
  ) {}

  /**
   * Enqueues a standardized email job into Redis for background execution.
   */
  async sendEmail(
    emails: string[],
    copyEmails: string[],
    title: string,
    emailBody: string,
    files?: AttachmentLikeObject[],
    communicationLog?: CommunicationLog,
  ): Promise<boolean> {
    // Sanitize string inputs into formal arrays
    if (typeof emails === 'string') emails = [emails];
    if (typeof copyEmails === 'string') copyEmails = [copyEmails];

    const allRecipients = emails.slice();
    
    // Save audit log to DB as 'PENDING' before queue routing
    const commLog = await this.saveLog(communicationLog, allRecipients, title, emailBody);

    try {
      // Add the job payload along with native BullMQ retry instructions
      await this.emailQueue.add(
        'send-smtp-email',
        {
          emails,
          copyEmails,
          title,
          emailBody,
          files,
          commLogId: commLog.id,
        },
        {
          attempts: 3,             // Try sending up to 3 times total on failure
          backoff: {
            type: 'exponential',   // Multiplies wait time incrementally per try
            delay: 5000,          // Wait 5s before attempt 2, 10s before attempt 3
          },
          removeOnComplete: true,  // Automatically purge successful metadata from Redis
        },
      );
      
      return true;
    } catch (err) {
      this.logger.error('Failed to hand off email job to Redis queue storage', err);
      return false;
    }
  }

  /**
   * Helper utility to flush incoming upload streams onto local hard disk
   * and convert them into stable string paths before queue dispatch.
   */
  async sendEmailWithRawFiles(
    emails: string[],
    copyEmails: string[],
    title: string,
    emailBody: string,
    communicationLog?: CommunicationLog,
    files?: Express.Multer.File | Express.Multer.File[],
  ) {
    try {
      const tempDir = join(__dirname, '..', 'temp');
      if (!existsSync(tempDir)) {
        mkdirSync(tempDir, { recursive: true });
      }
      
      const finalFiles: Express.Multer.File[] = [].concat(files || []);
      const attachedFiles: AttachmentLikeObject[] = finalFiles.map((file) => {
        const tempFilePath = join(tempDir, file.originalname);
        writeFileSync(tempFilePath, file.buffer);
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
    } catch (error) {
      this.logger.error('Multipart form attachment pipeline broken', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Compiles and guarantees an initialized PENDING log entry exists inside DB tables.
   */
  async saveLog(
    communicationLog: CommunicationLog, 
    recipients: string[], 
    title: string, 
    message: string
  ): Promise<CommunicationLog> {
    if (communicationLog) {
      return await this.communicationLogService.upsert(communicationLog);
    }
    
    const log = new CommunicationLog();
    log.channel_type = CommunicationChannelType.EMAIL;
    log.recipients = recipients;
    log.subject = title || 'General Email';
    log.message_type = 'General Email';
    log.message = message;
    log.sent_status = CommunicationSentStatus.PENDING;
    return await this.communicationLogService.upsert(log);
  }
}

