import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { MailService } from './mailService.service';
import { AttachmentLikeObject } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('mailService')
export class MailServiceController {
  constructor(private readonly mailService: MailService) {}

  @Post('sendNewEmail')
  @UseInterceptors(FilesInterceptor('files'))
  async sendNewEmail(
    @Body('emails') emails: string[],
    @Body('copyEmails') copyEmails: string[],
    @Body('title') title: string,
    @Body('emailBody') emailBody: string,
    @UploadedFiles() files: Express.Multer.File[] // Handles file upload
  ) {
    try {
      const tempDir = join(__dirname, '..', 'temp');
      if (!existsSync(tempDir)) {
        mkdirSync(tempDir, { recursive: true });
      }
      const attachedFiles: AttachmentLikeObject[] = files.map(file => {
        const tempFilePath = join(tempDir, file.originalname);
        writeFileSync(tempFilePath, file.buffer);
        return { path: tempFilePath };
      });

      const result = await this.mailService.sendEmail(emails, copyEmails, title, emailBody,attachedFiles, null);
      return { success: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
