import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CommunicationLogService } from '../db/communication-log/communication-log.service';
import { CommunicationLog } from '../db/communication-log/entities/communication-log.entity';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as nodemailer from 'nodemailer';
import { render } from '@react-email/render';

import {
  CommunicationChannelType,
  CommunicationSentStatus,
} from 'src/commonTypes';
import {
  AttachmentLikeObject,
  ISendMailOptions,
} from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';
import { ImapFlow } from 'imapflow';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getCurrentUser } from '../db/doi/util';
// import { Html } from '@react-email/components';
// import Email from 'templates/email';
import * as sendGrid from '@sendgrid/mail';
import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';

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
    const sendViaMailGun = async () => {
      const mailgun = new Mailgun(FormData);
      const mg = mailgun.client({
        username: 'api',
        key: 'e25c8e55961325431fe7a26b024703c6-f55d7446-1eb4ba2c',
        url: 'https://api.eu.mailgun.net'
      });

      mg.messages
        .create('sandbox-123.mailgun.org', {
          from: 'Excited User <mailgun@sandboxfc5a61aa8e8d4d68918604998221991c.mailgun.org>',
          to: ['test@example.com'],
          subject: 'Hello',
          text: 'Testing some Mailgun awesomeness!',
          html: '<h1>Testing some Mailgun awesomeness!</h1>',
        })
        .then((msg) => console.log(msg)) // logs response data
        .catch((err) => console.log(err)); // logs any error
    };
    const sendViaSendGrid = async () => {
      sendGrid.setApiKey(
        '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',
      ); // process.env.SENDGRID_API_KEY);
      const msg = {
        to: 'lkemboi@icipe.org',
        from: emails.join(','), // 'test@example.com', // Use the email address or domain you verified above
        subject: communicationLog.subject, // 'Sending with Twilio SendGrid is Fun',
        text: communicationLog.message, // 'and easy to do anywhere, even with Node.js',
        html: communicationLog.message, // '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      //ES6
      sendGrid.send(msg).then(
        () => {
          console.log('Email sent...');
        },
        (error) => {
          console.error(error);

          if (error.response) {
            console.error(error.response.body);
          }
        },
      );
    };

    const sendViaTransport = async () => {
      try {
        // //send email
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
        // const res = await this.mailerService.sendMail(mailOptions);
        const res = await transporter.sendMail({
          subject: title,
          html: emailBody,
          text: emailBody,
          attachments: files,
          to: emails,
          cc: copyEmails,
        });
        // // Update sent status
        this.updateSentStatus(commLog, res);
        await this.appendToSent(
          commLog.subject,
          allRecipients,
          emailBody,
        ).catch(console.error);
        return true;
      } catch (err) {
        this.logger.error(err);
        console.log(err);
        throw err;
      }
    };

    emailBody = await render(emailBody);

    if (typeof emails === 'string') {
      emails = [emails];
    }
    if (typeof copyEmails === 'string') {
      copyEmails = [copyEmails];
    }
    const mailOptions: ISendMailOptions = {
      from: process.env.EMAIL_FROM,
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

    // await sendViaTransport();
    // await sendViaSendGrid();
    await sendViaMailGun();
    return true;
  }

  /**
   * Append sent emails to the sender's outbox
   * @param subject
   * @param recipients
   * @param message
   */
  async appendToSent(subject: string, recipients: string[], message: string) {
    const client = new ImapFlow({
      host: process.env.IMAP_SERVER,
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
    }
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
      this.logger.error(error);
      return { success: false, message: error.message };
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
      communicationLog.subject = 'General Email';
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
