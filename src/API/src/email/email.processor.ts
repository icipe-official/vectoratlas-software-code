import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as nodemailer from 'nodemailer';
import { CommunicationLogService } from '../db/communication-log/communication-log.service';
import { CommunicationSentStatus } from '../../src/commonTypes';

@Processor('email-sending')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly communicationLogService: CommunicationLogService) {
    super();
  }

  /**
   * Asynchronous background listener method executed on each dequeued job ticket.
   */
  async process(job: Job<any, any, string>): Promise<boolean> {
    // Unpack data from stringified Redis payload container
    const { emails, copyEmails, title, emailBody, files, commLogId } = job.data;

    try {
      // Build Nodemailer network client using environment variables
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

      // Execute network SMTP mail distribution call
      const res = await transporter.sendMail({
        subject: title,
        html: emailBody,
        attachments: files,
        to: emails,
        cc: copyEmails,
      });

      // Update database status log row to SENT
      await this.communicationLogService.updateSentStatus(
        commLogId, 
        CommunicationSentStatus.SENT, 
        res.response
      );
      
      return true;
    } catch (err: any) {
      // Update database status log row to FAILED with error descriptions
      await this.communicationLogService.updateSentStatus(
        commLogId, 
        CommunicationSentStatus.FAILED, 
        err.message
      );
      
      // Throwing error tells BullMQ to activate retry timers
      throw err; 
    }
  }
}
