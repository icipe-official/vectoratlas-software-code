import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { AttachmentLikeObject } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('mailService')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('sendNewEmail')
  @UseInterceptors(FilesInterceptor('files'))
  async sendNewEmail(
    @Body('recipients') recipients?: string | string[],
    @Body('emails') emails?: string | string[],
    @Body('subject') subject?: string,
    @Body('title') title?: string,
    @Body('copyEmails') copyEmails?: string | string[],
    @Body('message') message?: string,
    @Body('emailBody') emailBody?: string,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    try {
      const tempDir = join(__dirname, '..', 'temp');
      if (!existsSync(tempDir)) {
        mkdirSync(tempDir, { recursive: true });
      }
      const rawRecipients = recipients || emails || [];
      const finalRecipients = Array.isArray(rawRecipients)
        ? rawRecipients
        : [rawRecipients];

      const rawCopy = copyEmails || [];
      const finalCopyEmails = Array.isArray(rawCopy) ? rawCopy : [rawCopy];

      const finalTitle = subject || title || 'No Subject';

      const finalBody = message || emailBody || '';

      const safeFiles = files || [];
      const attachedFiles: AttachmentLikeObject[] = safeFiles.map((file) => {
        const tempFilePath = join(tempDir, file.originalname);
        writeFileSync(tempFilePath, file.buffer);
        return { path: tempFilePath };
      });

      const result = await this.emailService.sendEmail(
        finalRecipients,
        finalCopyEmails,
        finalTitle,
        finalBody,
        attachedFiles,
        null,
      );

      return { success: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
