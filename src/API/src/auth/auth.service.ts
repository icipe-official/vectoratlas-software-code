import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(private readonly mailerService: MailerService) {}

  requestRoles(requestReason, rolesRequested, userId): Boolean {
    try {
      this.mailerService.sendMail({
        to: 'andrew.kitchener@capgemini.com',
        from: 'vectoratlas-donotreply@icipe.org',
        subject: 'Role request',
        html: '<p>PLEASE</p>'
      }).then(() => {
        return true;
      })
      .catch((err) => {
        throw err;
      });
      return true;
    } catch {
      return false;
    }
  }
}
