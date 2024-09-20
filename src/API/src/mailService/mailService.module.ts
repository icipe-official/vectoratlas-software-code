import { Module } from '@nestjs/common';
import { MailServiceController } from './mailService.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mailService.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [MailServiceController],
  providers: [MailService],
  imports: [
    HttpModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.MAILERUSER, // your Gmail email
          pass: process.env.MAILERPASSWORD, // app-specific password
        },
      },
      defaults: {
        from: process.env.MAILERDEFAULTEMAIL,
      },
    }),
  ],
  exports: [MailService],
})
export class MailModule {}
