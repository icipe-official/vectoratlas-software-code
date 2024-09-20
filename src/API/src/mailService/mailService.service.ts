import { Injectable } from '@nestjs/common';
import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { AttachmentLikeObject } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  async sendEmail(
    emails: string[], 
    copyEmails: string[], 
    title: string, 
    emailBody: string, 
    files?: AttachmentLikeObject[]
  ): Promise<boolean> {
    const mailOptions: ISendMailOptions = {
      to: emails,
      cc: copyEmails,
      subject: title,
      html: emailBody,
      attachments: files,
    };

    try {
      await this.mailerService.sendMail(mailOptions);
      console.log('Email sent successfully');
      return true;
    } catch (err) {
      console.error('Error sending email:', err.message);
      throw err;
    }
  }
}
