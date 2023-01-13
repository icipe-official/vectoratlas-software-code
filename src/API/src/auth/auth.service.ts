import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(private readonly mailerService: MailerService) {}

  requestRoles(requestReason, rolesRequested, userId) {
    this.mailerService.sendMail({
      to: 'andrew.kitchener@capgemini.com',
      from: 'vectoratlas-donotreply@icipe.org',
      subject: 'Role request',
      text: 'Please can I have the following roles',
      html: '<p>PLEASE</p>'
    }).then((success) => {
      console.log(success)
    })
    .catch((err) => {
      console.log(err)
    });
  }
}
